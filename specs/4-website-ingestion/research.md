# Research: Website Ingestion & Vector Storage

## Decision: Architecture and Technology Stack
**Rationale**: Based on user requirements, the implementation will use a single Python file (main.py) with specific functions for the ingestion pipeline. This approach simplifies deployment and maintenance while meeting the requirements.

## Technologies Selected:

### Web Scraping
- **Library**: `requests` + `beautifulsoup4`
- **Rationale**: Industry standard for web scraping in Python. `requests` handles HTTP requests and `beautifulsoup4` parses HTML content effectively.

### Text Chunking
- **Library**: Custom implementation with potential use of `langchain` text splitters
- **Rationale**: Need to split large documents into smaller chunks for embedding generation. Will implement configurable chunk size with overlap.

### Embedding Generation
- **Library**: `cohere` Python client
- **Rationale**: User specifically requested Cohere for embeddings. Cohere provides high-quality semantic embeddings suitable for RAG applications.

### Vector Storage
- **Library**: `qdrant-client`
- **Rationale**: User specifically requested Qdrant for vector storage. Qdrant is a high-performance vector database suitable for similarity search.

### Dependency Management
- **Tool**: `uv`
- **Rationale**: Modern, fast Python package installer and resolver that will be used to initialize the project as requested.

## Functions Implementation Plan:

### get_all_urls(base_url)
- Discovers all URLs from the Docusaurus site by parsing sitemap.xml or crawling internal links
- Returns a list of accessible URLs to process

### extract_text_from_url(url)
- Fetches HTML content from URL using requests
- Parses HTML and extracts clean text content using BeautifulSoup
- Filters out navigation, headers, footers, and other non-content elements

### chunk(text, chunk_size, overlap)
- Splits text into configurable-sized chunks with optional overlap
- Implements intelligent splitting to avoid breaking sentences/paragraphs

### embed(text_chunks)
- Sends text chunks to Cohere API for embedding generation
- Handles API rate limits and error retry logic

### create_collection(collection_name)
- Creates a Qdrant collection named "humanoid-book-rag"
- Configures vector parameters and metadata schema

### save_chunk_to_qdrant(chunk, vector, metadata)
- Stores individual text chunks with embeddings and metadata in Qdrant
- Implements error handling for failed storage attempts

## Deployment Target:
- Website: https://marjan-ahmed.github.io/humanoid-robotics-textbook/
- Will need to analyze site structure to properly extract content
- Docusaurus sites typically have predictable URL patterns and HTML structure

## Configuration:
- API keys for Cohere and Qdrant will be stored in environment variables
- Chunk size default: 512 tokens with 50-token overlap
- Rate limiting to avoid overwhelming the target website