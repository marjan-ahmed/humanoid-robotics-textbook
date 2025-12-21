"""
Test script to verify Qdrant retrieval functionality
"""
import os
from src.retrieve import get_embedding, retrieve
from qdrant_client import QdrantClient


def test_qdrant_connection():
    """Test basic connection to Qdrant"""
    try:
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")

        client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)

        # Test connection by getting collection list
        collections = client.get_collections()
        print(f"Connected to Qdrant successfully!")
        print(f"Available collections: {[col.name for col in collections.collections]}")
        return True
    except Exception as e:
        print(f"Failed to connect to Qdrant: {e}")
        return False


def test_retrieval():
    """Test the retrieval functionality with a sample query"""
    try:
        # Create a sample embedding
        query_text = "humanoid robotics"
        query_embedding = get_embedding(query_text)

        print(f"Generated embedding for query: '{query_text}'")
        print(f"Embedding dimension: {query_embedding.dimension}")

        # Attempt to retrieve from a collection
        # Using a common collection name for humanoid robotics content
        collection_names = ["humanoid-book-rag"]

        for collection_name in collection_names:
            try:
                print(f"\nTrying to retrieve from collection: {collection_name}")
                results = retrieve(
                    query_embedding=query_embedding,
                    collection_name="humanoid-book-rag",
                    top_k=3
                )

                print(f"Successfully retrieved {len(results.retrieved_documents)} documents")
                print(f"Relevance score: {results.relevance_score:.2f}")
                print(f"Metadata completeness: {results.metadata_completeness:.2f}")

                for i, doc in enumerate(results.retrieved_documents, 1):
                    print(f"  Doc {i}: Score={doc.score:.2f}, Content length={len(doc.content)}")
                    print(f"    Source: {doc.metadata.source}")
                    print(f"    Created: {doc.metadata.created_date}")

                return True  # If any collection works, return success

            except Exception as e:
                print(f"  Failed to retrieve from {collection_name}: {e}")
                continue

        print("Tried all common collection names, none worked")
        return False

    except Exception as e:
        print(f"Error during retrieval test: {e}")
        return False


if __name__ == "__main__":
    print("Testing Qdrant Retrieval Functionality")
    print("=" * 50)

    # Check if required environment variables are set
    if not os.getenv("COHERE_API_KEY"):
        print("ERROR: COHERE_API_KEY environment variable is not set")
        print("Please set your Cohere API key before running this test")
        exit(1)

    print("Environment variables check: OK")

    # Test Qdrant connection
    if test_qdrant_connection():
        print("\nProceeding with retrieval test...")
        success = test_retrieval()
        if success:
            print("\n✓ Retrieval test completed successfully!")
        else:
            print("\n✗ Retrieval test failed - check collection names and data")
    else:
        print("\n✗ Cannot connect to Qdrant - check URL and credentials")