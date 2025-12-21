# Quickstart: Website Ingestion & Vector Storage

## Prerequisites
- Python 3.11+
- `uv` package manager installed
- Cohere API key
- Qdrant API key and cluster URL

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies using uv**
   ```bash
   uv sync
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=your_qdrant_cluster_url_here
   QDRANT_API_KEY=your_qdrant_api_key_here
   ```

## Running the Ingestion Pipeline

1. **Execute the main script**
   ```bash
   cd src
   python main.py
   ```

2. **The script will:**
   - Discover all URLs from the target Docusaurus site
   - Extract text content from each page
   - Chunk the content into manageable pieces
   - Generate embeddings using Cohere
   - Store the embeddings in Qdrant vector database

## Configuration

The ingestion process can be configured by modifying constants in `main.py`:
- `CHUNK_SIZE`: Size of text chunks (default: 512)
- `OVERLAP_SIZE`: Overlap between chunks (default: 50)
- `BASE_URL`: Target website URL (default: https://marjan-ahmed.github.io/humanoid-robotics-textbook/)

## Expected Output

The script will create a Qdrant collection named "humanoid-book-rag" containing all the processed content from the website. Each entry includes the text content, its embedding vector, and metadata like source URL and page title.

## Troubleshooting

- If you get rate limit errors, reduce the `RATE_LIMIT` value in the script
- If embedding generation fails, verify your Cohere API key
- If Qdrant storage fails, verify your Qdrant connection details