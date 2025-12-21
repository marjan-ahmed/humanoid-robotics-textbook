"""
Example usage script for the RAG Pipeline Validation Tool
"""
from src.retrieve import validate_rag_pipeline, get_embedding, retrieve


def main():
    print("RAG Pipeline Validation - Example Usage")
    print("=" * 50)

    # Example 1: Basic validation
    print("\n1. Basic RAG Pipeline Validation:")
    try:
        validation_result = validate_rag_pipeline(
            query="What is humanoid robotics?",
            collection_name="humanoid-book-rag",  # Replace with your actual collection name
            top_k=3
        )
        print(f"Found {len(validation_result.retrieved_documents)} relevant documents")
        print(f"Relevance score: {validation_result.relevance_score:.2f}")
        print(f"Metadata completeness: {validation_result.metadata_completeness:.2f}")
        print(f"Query time: {validation_result.query_time:.2f} seconds")
    except Exception as e:
        print(f"Error during validation: {e}")
        print("Note: This requires valid Cohere and Qdrant configuration")

    # Example 2: Generate embedding for a query
    print("\n2. Generate Embedding for Query:")
    try:
        query_text = "Explain physical AI concepts"
        embedding = get_embedding(query_text)
        print(f"Generated embedding for: '{query_text}'")
        print(f"Embedding dimension: {embedding.dimension}")
        print(f"First 5 values: {embedding.vector[:5]}")
    except Exception as e:
        print(f"Error generating embedding: {e}")

    # Example 3: Direct retrieval with embedding
    print("\n3. Direct Retrieval with Embedding:")
    try:
        query_text = "How do robots perceive their environment?"
        query_embedding = get_embedding(query_text)

        results = retrieve(
            query_embedding=query_embedding,
            collection_name="humanoid-book-rag",  # Replace with your actual collection name
            top_k=2
        )

        print(f"Retrieved {len(results.retrieved_documents)} documents")
        for i, doc in enumerate(results.retrieved_documents, 1):
            print(f"  Document {i}: {doc.content[:100]}... (score: {doc.score:.2f})")
            print(f"    Source: {doc.metadata.source}")
            print(f"    Created: {doc.metadata.created_date}")
    except Exception as e:
        print(f"Error during retrieval: {e}")

    print("\nNote: To run this example successfully, you need to:")
    print("- Set up your COHERE_API_KEY environment variable")
    print("- Set up your QDRANT_URL and QDRANT_API_KEY environment variables")
    print("- Have a Qdrant collection with the appropriate data")


if __name__ == "__main__":
    main()