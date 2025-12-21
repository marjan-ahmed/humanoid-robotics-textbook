# Data Model: RAG Pipeline Validation

## Core Entities

### EmbeddingVector
- **Description**: A numerical representation of text data used for similarity matching in the vector database
- **Fields**:
  - `vector`: List[float] - The embedding values
  - `text`: str - The original text that was embedded (for query embeddings)
  - `dimension`: int - The dimensionality of the embedding vector

### RetrievedDocument
- **Description**: A document retrieved from Qdrant that matches the query embedding, containing both content and metadata
- **Fields**:
  - `id`: str - Unique identifier for the document in Qdrant
  - `content`: str - The text content of the retrieved document
  - `metadata`: Dict[str, Any] - Associated metadata from Qdrant
  - `score`: float - Similarity score relative to the query
  - `embedding`: List[float] - The vector representation of the document

### Metadata
- **Description**: Information associated with each document in the vector database
- **Fields**:
  - `source`: str - Origin of the document (optional)
  - `created_date`: str - Creation timestamp (optional)
  - `document_type`: str - Type/classification of document (optional)
  - `additional_fields`: Dict[str, Any] - Any other metadata fields

### QueryResult
- **Description**: The result of a retrieval operation containing relevant documents and validation metrics
- **Fields**:
  - `query_embedding`: EmbeddingVector - The embedding used for the query
  - `retrieved_documents`: List[RetrievedDocument] - Documents returned from Qdrant
  - `relevance_score`: float - Overall relevance metric of the results
  - `metadata_completeness`: float - Metric indicating completeness of metadata
  - `query_time`: float - Time taken to execute the query in seconds

## Validation Rules

### EmbeddingVector Validation
- `vector` must be a non-empty list of floats
- `dimension` must match the expected embedding model dimension
- `text` must be non-empty for query embeddings

### RetrievedDocument Validation
- `id` must be non-empty
- `content` must be non-empty
- `score` must be between 0 and 1
- `embedding` must be a valid vector

### QueryResult Validation
- `retrieved_documents` must contain at least one document for successful queries
- `relevance_score` must be between 0 and 1
- `metadata_completeness` must be between 0 and 1
- `query_time` must be non-negative

## State Transitions

### Query Process
1. Input text → get_embedding() → EmbeddingVector
2. EmbeddingVector → retrieve() → QueryResult
3. QueryResult → validation → success/failure metrics