"""
RAG Pipeline Validation Tool

This module provides functionality to validate RAG (Retrieval Augmented Generation) pipeline
by querying Qdrant using embeddings and verifying relevance and metadata.
"""

import os
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, validator
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http.models import SearchRequest
import logging


# Data Models based on data-model.md
class Metadata(BaseModel):
    """Information associated with each document in the vector database"""
    source: Optional[str] = None  # Origin of the document (optional)
    created_date: Optional[float] = None  # Creation timestamp (optional) as float
    document_type: Optional[str] = None  # Type/classification of document (optional)
    additional_fields: Dict[str, Any] = Field(default_factory=dict)  # Any other metadata fields


class EmbeddingVector(BaseModel):
    """A numerical representation of text data used for similarity matching in the vector database"""
    vector: List[float] = Field(..., description="The embedding values")
    text: str = Field(..., description="The original text that was embedded (for query embeddings)")
    dimension: int = Field(..., description="The dimensionality of the embedding vector")

    @validator('vector')
    def validate_vector(cls, v):
        if not v or len(v) == 0:
            raise ValueError('vector must be a non-empty list of floats')
        return v

    @validator('text')
    def validate_text(cls, v):
        if not v:
            raise ValueError('text must be non-empty for query embeddings')
        return v

    @validator('dimension')
    def validate_dimension(cls, v):
        if v <= 0:
            raise ValueError('dimension must be positive')
        return v


class RetrievedDocument(BaseModel):
    """A document retrieved from Qdrant that matches the query embedding, containing both content and metadata"""
    id: str = Field(..., description="Unique identifier for the document in Qdrant")
    content: str = Field(..., description="The text content of the retrieved document")
    metadata: Metadata = Field(..., description="Associated metadata from Qdrant")
    score: float = Field(..., description="Similarity score relative to the query", ge=0.0, le=1.0)
    embedding: List[float] = Field(..., description="The vector representation of the document")

    @validator('id')
    def validate_id(cls, v):
        if not v:
            raise ValueError('id must be non-empty')
        return v

    @validator('content')
    def validate_content(cls, v):
        if not v:
            raise ValueError('content must be non-empty')
        return v

    @validator('score')
    def validate_score(cls, v):
        if v < 0.0 or v > 1.0:
            raise ValueError('score must be between 0 and 1')
        return v


class QueryResult(BaseModel):
    """The result of a retrieval operation containing relevant documents and validation metrics"""
    query_embedding: EmbeddingVector = Field(..., description="The embedding used for the query")
    retrieved_documents: List[RetrievedDocument] = Field(..., description="Documents returned from Qdrant")
    relevance_score: float = Field(..., description="Overall relevance metric of the results", ge=0.0, le=1.0)
    metadata_completeness: float = Field(..., description="Metric indicating completeness of metadata", ge=0.0, le=1.0)
    query_time: float = Field(..., description="Time taken to execute the query in seconds", ge=0.0)

    @validator('retrieved_documents')
    def validate_retrieved_documents(cls, v):
        if not v:
            raise ValueError('retrieved_documents must contain at least one document for successful queries')
        return v

    @validator('relevance_score', 'metadata_completeness')
    def validate_percentage_fields(cls, v):
        if v < 0.0 or v > 1.0:
            raise ValueError('must be between 0 and 1')
        return v

    @validator('query_time')
    def validate_query_time(cls, v):
        if v < 0.0:
            raise ValueError('query_time must be non-negative')
        return v


# Initialize clients
def initialize_clients():
    """Initialize Cohere and Qdrant clients with environment configuration"""
    cohere_api_key = os.getenv("COHERE_API_KEY")
    if not cohere_api_key:
        raise ValueError("COHERE_API_KEY environment variable is required")

    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    co = cohere.Client(cohere_api_key)
    qdrant_client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)

    return co, qdrant_client


def get_embedding(text: str) -> EmbeddingVector:
    """
    Generate an embedding vector from input text using Cohere.

    Args:
        text (str): Input text to generate embedding for

    Returns:
        EmbeddingVector: Object containing the embedding vector and related metadata
    """
    try:
        co, _ = initialize_clients()

        # Generate embedding using Cohere
        response = co.embed(
            texts=[text],
            model="embed-english-v3.0",  # Using a standard Cohere embedding model
            input_type="search_query"  # Specify this is for search
        )

        embedding_vector = response.embeddings[0]

        return EmbeddingVector(
            vector=embedding_vector,
            text=text,
            dimension=len(embedding_vector)
        )
    except Exception as e:
        logging.error(f"Error generating embedding: {str(e)}")
        raise


def retrieve(
    query_embedding: EmbeddingVector,
    collection_name: str,
    top_k: int = 5,
    relevance_threshold: float = 0.5
) -> QueryResult:
    """
    Query Qdrant vector database using an embedding and return relevant documents with metadata.

    Args:
        query_embedding (EmbeddingVector): The embedding to search for
        collection_name (str): Name of the Qdrant collection to search
        top_k (int, optional): Number of results to return (default: 5)
        relevance_threshold (float, optional): Minimum relevance score (default: 0.5)

    Returns:
        QueryResult: Object containing retrieved documents and validation metrics
    """
    try:
        start_time = time.time()
        _, qdrant_client = initialize_clients()

        # Perform the search in Qdrant using the correct API method
        search_results = qdrant_client.query_points(
            collection_name=collection_name,
            query=query_embedding.vector,
            limit=top_k
        )

        # Convert Qdrant results to our data model
        retrieved_docs = []
        for result in search_results.points:  # Iterate over the points list
            # Extract content and metadata from Qdrant result (flat payload fields)
            content = result.payload.get("content", "") if result.payload else ""
            source_url = result.payload.get("source_url", "") if result.payload else ""
            title = result.payload.get("title", "") if result.payload else ""
            description = result.payload.get("description", "") if result.payload else ""
            chunk_index = result.payload.get("chunk_index", None) if result.payload else None
            created_at = result.payload.get("created_at", 0.0) if result.payload else 0.0

            # Create Metadata object from the flat Qdrant payload fields
            metadata = Metadata(
                source=source_url,  # Map source_url to source field
                created_date=created_at,  # Map created_at to created_date field
                document_type=title,  # Map title to document_type field (or could be description)
                additional_fields={
                    "description": description,
                    "chunk_index": chunk_index
                }
            )

            retrieved_doc = RetrievedDocument(
                id=result.id,
                content=content,
                metadata=metadata,
                score=result.score,
                embedding=result.vector if result.vector is not None else []
            )
            retrieved_docs.append(retrieved_doc)

        query_time = time.time() - start_time

        # Calculate relevance score as average of all document scores
        relevance_score = sum(doc.score for doc in retrieved_docs) / len(retrieved_docs) if retrieved_docs else 0.0

        # Calculate metadata completeness (percentage of documents with complete metadata)
        # Based on actual Qdrant payload fields: source_url, created_at, title, description, chunk_index
        total_metadata_fields = 0
        expected_metadata_fields = 0
        for doc in retrieved_docs:
            # Count expected fields from Qdrant payload: source_url, created_at, title, description, chunk_index
            expected_metadata_fields += 5  # source, created_date, document_type, description, chunk_index
            if doc.metadata.source:  # source_url
                total_metadata_fields += 1
            if doc.metadata.created_date is not None and doc.metadata.created_date != 0.0:  # created_at as float
                total_metadata_fields += 1
            if doc.metadata.document_type:  # title
                total_metadata_fields += 1
            if "description" in doc.metadata.additional_fields and doc.metadata.additional_fields["description"]:
                total_metadata_fields += 1
            if "chunk_index" in doc.metadata.additional_fields and doc.metadata.additional_fields["chunk_index"] is not None:
                total_metadata_fields += 1

        metadata_completeness = total_metadata_fields / expected_metadata_fields if expected_metadata_fields > 0 else 0.0

        return QueryResult(
            query_embedding=query_embedding,
            retrieved_documents=retrieved_docs,
            relevance_score=relevance_score,
            metadata_completeness=metadata_completeness,
            query_time=query_time
        )
    except Exception as e:
        logging.error(f"Error retrieving from Qdrant: {str(e)}")
        raise


def validate_rag_pipeline(
    query: str,
    collection_name: str,
    top_k: int = 5,
    expected_sources: Optional[List[str]] = None
) -> QueryResult:
    """
    Complete validation of the RAG pipeline by combining embedding generation and retrieval.

    Args:
        query (str): Input query text
        collection_name (str): Name of the Qdrant collection to search
        top_k (int, optional): Number of results to return (default: 5)
        expected_sources (List[str], optional): Expected document sources for validation

    Returns:
        QueryResult: Object containing retrieved documents and validation metrics
    """
    # Generate embedding for the query
    query_embedding = get_embedding(query)

    # Retrieve relevant documents
    results = retrieve(
        query_embedding=query_embedding,
        collection_name=collection_name,
        top_k=top_k
    )

    return results


# Error handling for Qdrant unavailability (FR-006)
def handle_qdrant_unavailability():
    """
    Handle errors gracefully when Qdrant is unavailable using a fail-fast approach
    with appropriate error messages.
    """
    logging.error("Qdrant is unavailable - failing fast with appropriate error message")
    raise ConnectionError("Qdrant service is currently unavailable")


if __name__ == "__main__":
    # Example usage
    print("RAG Pipeline Validation Tool")
    print("This module provides functions to validate RAG pipeline retrieval from Qdrant")