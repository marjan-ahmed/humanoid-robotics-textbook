# Website Ingestion Pipeline for RAG

This backend service ingests content from a Docusaurus website, generates embeddings using Cohere, and stores them in Qdrant for RAG (Retrieval Augmented Generation) applications.

## Features

- Discovers all URLs from a target Docusaurus site
- Extracts clean text content from web pages
- Chunks text into manageable pieces
- Generates semantic embeddings using Cohere
- Stores embeddings in Qdrant vector database
- Creates a collection named "humanoid-book-rag"

## Prerequisites

- Python 3.11+
- `uv` package manager
- Cohere API key
- Qdrant API key and cluster URL

## Setup

1. Install dependencies:
   ```bash
   uv sync
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your API keys.

## Usage

Run the ingestion pipeline:
```bash
cd src
python main.py
```

## Configuration

The script can be configured by modifying constants in `main.py`:
- `CHUNK_SIZE`: Size of text chunks (default: 512)
- `OVERLAP_SIZE`: Overlap between chunks (default: 50)
- `BASE_URL`: Target website URL (default: https://marjan-ahmed.github.io/humanoid-robotics-textbook/)

## Functions

The main.py file contains these key functions:
- `get_all_urls()`: Discovers all URLs from the target site
- `extract_text_from_url()`: Extracts clean text content from a URL
- `chunk()`: Splits text into configurable-sized chunks
- `embed()`: Generates embeddings using Cohere
- `create_collection()`: Creates Qdrant collection
- `save_chunk_to_qdrant()`: Saves chunks to Qdrant
- `main()`: Executes the complete pipeline