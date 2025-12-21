import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import time
import re
from typing import List, Dict, Any

# Load environment variables
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

# Configuration
CHUNK_SIZE = 512  # Number of characters per chunk
OVERLAP_SIZE = 50  # Number of characters to overlap between chunks
BASE_URL = "https://marjan-ahmed.github.io/humanoid-robotics-textbook/"
COLLECTION_NAME = "humanoid-book-rag"

def get_all_urls(base_url: str) -> List[str]:
    """
    Discover all URLs from the Docusaurus site by trying multiple approaches:
    1. Check for sitemap.xml
    2. Crawl internal links from the base URL
    """
    urls = set()

    # Try to get URLs from sitemap first
    sitemap_url = urljoin(base_url, "sitemap.xml")
    try:
        response = requests.get(sitemap_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'xml')
            for loc in soup.find_all('loc'):
                url = loc.text.strip()
                if url.startswith(base_url):
                    urls.add(url)
    except Exception as e:
        print(f"Could not fetch sitemap: {e}")

    # If sitemap didn't work or returned no URLs, try crawling
    if not urls:
        print("Sitemap not found or empty, attempting to crawl...")
        try:
            response = requests.get(base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find all internal links
            for link in soup.find_all('a', href=True):
                href = link['href']
                full_url = urljoin(base_url, href)

                # Only add URLs from the same domain
                if urlparse(full_url).netloc == urlparse(base_url).netloc:
                    if full_url.startswith(base_url):
                        urls.add(full_url)
        except Exception as e:
            print(f"Could not crawl base URL: {e}")

    # Filter out non-HTML URLs and add base URL
    filtered_urls = []
    for url in urls:
        if url.endswith(('.html', '/')) or not '.' in urlparse(url).path:
            filtered_urls.append(url)

    # Add base URL if not already included
    if base_url not in filtered_urls:
        filtered_urls.append(base_url)

    return list(filtered_urls)


def extract_text_from_url(url: str) -> Dict[str, Any]:
    """
    Extract text content from a given URL, including title and other metadata
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer", "aside"]):
            script.decompose()

        # Try to get the main content area (Docusaurus specific selectors)
        content_selectors = [
            'main', '.main-wrapper', '.theme-doc-markdown',
            '.markdown', '.container', '.doc-content', '.content'
        ]

        content_element = None
        for selector in content_selectors:
            content_element = soup.select_one(selector)
            if content_element:
                break

        if not content_element:
            content_element = soup.find('body')

        # Extract text content
        text_content = content_element.get_text(separator=' ', strip=True) if content_element else soup.get_text(separator=' ', strip=True)

        # Extract title
        title = ''
        title_element = soup.find('title')
        if title_element:
            title = title_element.get_text().strip()
        else:
            h1_element = soup.find('h1')
            if h1_element:
                title = h1_element.get_text().strip()

        # Extract description if available
        description = ''
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        if desc_tag:
            description = desc_tag.get('content', '')

        return {
            'url': url,
            'title': title,
            'description': description,
            'content': text_content
        }
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
        return {
            'url': url,
            'title': '',
            'description': '',
            'content': ''
        }


def chunk(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = OVERLAP_SIZE) -> List[str]:
    """
    Split text into chunks of specified size with optional overlap
    """
    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        # If we're near the end, include the remainder
        if end > len(text):
            end = len(text)

        chunk_text = text[start:end]
        chunks.append(chunk_text)

        # Move start position by chunk_size minus overlap
        start = end - overlap

        # If start >= len(text), we're done
        if start >= len(text):
            break

    # Remove any empty chunks
    chunks = [chunk_text for chunk_text in chunks if chunk_text.strip()]

    return chunks


def embed(text_chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings for text chunks using Cohere
    """
    cohere_api_key = os.getenv('COHERE_API_KEY')
    if not cohere_api_key:
        raise ValueError("COHERE_API_KEY environment variable not set")

    co = cohere.Client(cohere_api_key)

    # Cohere has limits on number of texts per request, so we batch them
    batch_size = 96  # Leave some room under the 96 text limit
    all_embeddings = []

    for i in range(0, len(text_chunks), batch_size):
        batch = text_chunks[i:i + batch_size]

        try:
            response = co.embed(
                texts=batch,
                model='embed-english-v3.0',  # Using the latest English embedding model
                input_type='search_document'  # Optimize for search documents
            )

            embeddings = [embedding for embedding in response.embeddings]
            all_embeddings.extend(embeddings)

            # Add a small delay to respect rate limits
            time.sleep(0.1)

        except Exception as e:
            print(f"Error generating embeddings for batch {i//batch_size + 1}: {e}")
            # Return zero vectors for failed embeddings to maintain alignment
            for _ in range(len(batch)):
                all_embeddings.append([0.0] * 1024)  # Assuming 1024-dim embeddings

    return all_embeddings


def create_collection(collection_name: str):
    """
    Create a Qdrant collection for storing embeddings
    """
    qdrant_url = os.getenv('QDRANT_URL')
    qdrant_api_key = os.getenv('QDRANT_API_KEY')

    if not qdrant_url or not qdrant_api_key:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY environment variables must be set")

    client = QdrantClient(
        url=qdrant_url,
        api_key=qdrant_api_key,
        timeout=10
    )

    # Check if collection already exists
    try:
        client.get_collection(collection_name)
        print(f"Collection '{collection_name}' already exists")
        return
    except:
        pass  # Collection doesn't exist, will create it

    # Create the collection
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=1024,  # Cohere embeddings are 1024-dimensional
            distance=models.Distance.COSINE
        )
    )

    print(f"Created collection '{collection_name}'")


def save_chunk_to_qdrant(chunk: str, vector: List[float], metadata: Dict[str, Any], collection_name: str):
    """
    Save a text chunk with its embedding vector and metadata to Qdrant
    """
    qdrant_url = os.getenv('QDRANT_URL')
    qdrant_api_key = os.getenv('QDRANT_API_KEY')

    if not qdrant_url or not qdrant_api_key:
        raise ValueError("QDRANT_URL and QDRANT_API_KEY environment variables must be set")

    client = QdrantClient(
        url=qdrant_url,
        api_key=qdrant_api_key,
        timeout=10
    )

    import uuid
    point_id = str(uuid.uuid4())

    try:
        client.upsert(
            collection_name=collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "content": chunk,
                        "source_url": metadata.get("source_url", ""),
                        "title": metadata.get("title", ""),
                        "description": metadata.get("description", ""),
                        "chunk_index": metadata.get("chunk_index", 0),
                        "created_at": time.time()
                    }
                )
            ]
        )
        return True
    except Exception as e:
        print(f"Error saving chunk to Qdrant: {e}")
        return False


def main():
    """
    Main function to execute the complete ingestion pipeline
    """
    print("Starting website ingestion pipeline...")

    # Step 1: Get all URLs from the target site
    print("Discovering URLs...")
    urls = get_all_urls(BASE_URL)
    print(f"Found {len(urls)} URLs to process")

    # Step 2: Process each URL
    total_chunks = 0
    processed_urls = 0

    for i, url in enumerate(urls):
        print(f"Processing URL {i+1}/{len(urls)}: {url}")

        # Extract content from URL
        content_data = extract_text_from_url(url)

        if not content_data['content'].strip():
            print(f"  No content found, skipping...")
            continue

        # Chunk the content
        text_chunks = chunk(content_data['content'])
        print(f"  Created {len(text_chunks)} chunks")

        # Generate embeddings for chunks
        if text_chunks:
            print("  Generating embeddings...")
            try:
                embeddings = embed(text_chunks)
            except Exception as e:
                print(f"  Error generating embeddings: {e}")
                continue

            # Save each chunk to Qdrant
            print("  Saving to Qdrant...")
            for j, (chunk_text, embedding) in enumerate(zip(text_chunks, embeddings)):
                metadata = {
                    'source_url': content_data['url'],
                    'title': content_data['title'],
                    'description': content_data['description'],
                    'chunk_index': j
                }

                success = save_chunk_to_qdrant(chunk_text, embedding, metadata, COLLECTION_NAME)
                if success:
                    total_chunks += 1
                else:
                    print(f"Failed to save chunk {j}")

        processed_urls += 1

        # Add a small delay to be respectful to the target website
        time.sleep(0.5)

    print(f"\nPipeline completed!")
    print(f"Processed {processed_urls} URLs")
    print(f"Saved {total_chunks} chunks to Qdrant collection '{COLLECTION_NAME}'")


if __name__ == "__main__":
    main()