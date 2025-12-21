# API Contracts: RAG Pipeline Validation

## Function: get_embedding

### Description
Generate an embedding vector from input text using the Cohere API.

### Parameters
- `text` (str): Input text to generate embedding for
- `model` (str, optional): Cohere model to use (default: "embed-english-v3.0")

### Returns
- `EmbeddingVector`: Object containing the embedding vector and related metadata

### Example
```python
embedding = get_embedding("What is humanoid robotics?")
# Returns: EmbeddingVector(vector=[0.1, 0.2, ...], text="What is humanoid robotics?", dimension=1024)
```

## Function: retrieve

### Description
Query Qdrant vector database using an embedding and return relevant documents with metadata.

### Parameters
- `query_embedding` (EmbeddingVector): The embedding to search for
- `collection_name` (str): Name of the Qdrant collection to search
- `top_k` (int, optional): Number of results to return (default: 5)
- `relevance_threshold` (float, optional): Minimum relevance score (default: 0.5)

### Returns
- `QueryResult`: Object containing retrieved documents and validation metrics

### Example
```python
results = retrieve(
    query_embedding=embedding,
    collection_name="robotics_docs",
    top_k=3
)
# Returns: QueryResult with documents, relevance score, and metadata completeness
```

## Function: validate_rag_pipeline

### Description
Complete validation of the RAG pipeline by combining embedding generation and retrieval.

### Parameters
- `query` (str): Input query text
- `collection_name` (str): Name of the Qdrant collection to search
- `top_k` (int, optional): Number of results to return (default: 5)
- `expected_sources` (List[str], optional): Expected document sources for validation

### Returns
- `QueryResult`: Object containing retrieved documents and validation metrics

### Example
```python
validation_result = validate_rag_pipeline(
    query="Explain physical AI concepts",
    collection_name="robotics_docs"
)
```