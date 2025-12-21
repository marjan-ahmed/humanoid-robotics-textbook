# Quickstart: RAG Pipeline Validation

## Prerequisites

- Python 3.11+
- Cohere API key
- Qdrant instance accessible (URL and credentials if required)

## Setup

1. Install required dependencies:
```bash
pip install cohere qdrant-client pydantic python-dotenv
```

2. Set up environment variables:
```bash
# Create a .env file with:
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_url_here
QDRANT_API_KEY=your_qdrant_api_key_here  # if required
```

## Usage

### Basic Validation

```python
from backend.retrieve import get_embedding, retrieve

# Generate an embedding for a query
query_text = "What is humanoid robotics?"
query_embedding = get_embedding(query_text)

# Retrieve relevant documents from Qdrant
collection_name = "your_collection_name"
results = retrieve(
    query_embedding=query_embedding,
    collection_name=collection_name,
    top_k=5  # Number of documents to retrieve
)

print(f"Found {len(results.retrieved_documents)} relevant documents")
print(f"Relevance score: {results.relevance_score}")
print(f"Metadata completeness: {results.metadata_completeness}")
```

### Advanced Validation

```python
# Validate the entire RAG pipeline
from backend.retrieve import validate_rag_pipeline

validation_result = validate_rag_pipeline(
    query="Explain physical AI concepts",
    collection_name="robotics_docs",
    expected_sources=["textbook_chapter_1", "research_paper_2"]
)

if validation_result.relevance_score >= 0.8:
    print("RAG pipeline validation passed")
else:
    print(f"RAG pipeline validation failed with score: {validation_result.relevance_score}")
```

## Configuration

The validation tool can be configured with:

- `QDRANT_URL`: URL of your Qdrant instance
- `QDRANT_API_KEY`: API key for Qdrant authentication (if required)
- `COHERE_MODEL`: Cohere model to use for embeddings (default: "embed-english-v3.0")
- `DEFAULT_TOP_K`: Default number of results to retrieve (default: 5)
- `RELEVANCE_THRESHOLD`: Minimum relevance score to consider validation successful (default: 0.7)