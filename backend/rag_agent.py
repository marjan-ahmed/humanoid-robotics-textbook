"""
RAG Agent using openai-agents SDK with Gemini for reasoning
"""
import asyncio
import os
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool, RunConfig, SQLiteSession, OpenAIChatCompletionsModel, set_tracing_disabled
from openai import AsyncOpenAI
from openai.types.responses import ResponseTextDeltaEvent
from src.retrieve import validate_rag_pipeline

# Load environment variables
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

# Disable tracing for cleaner output
set_tracing_disabled(True)

# Initialize the client and model
client = AsyncOpenAI(api_key=GEMINI_API_KEY, base_url=BASE_URL)
model = OpenAIChatCompletionsModel(GEMINI_MODEL, client)

@function_tool
def search_book_knowledge(query: str) -> str:
    """
    Search the book knowledge base using Qdrant retrieval.

    Args:
        query (str): The query to search for in the knowledge base

    Returns:
        str: The retrieved context as a string
    """
    try:
        # Use the existing retrieval function from Spec-2 modules
        results = validate_rag_pipeline(
            query=query,
            collection_name="humanoid-book-rag",  # Using the collection we verified works
            top_k=3  # Get top 3 results
        )

        # Format the retrieved documents as a context string
        context_parts = []
        for i, doc in enumerate(results.retrieved_documents, 1):
            context_parts.append(
                f"Document {i} (Score: {doc.score:.2f}):\n"
                f"Title: {doc.metadata.document_type}\n"
                f"Source: {doc.metadata.source}\n"
                f"Content: {doc.content}\n"
                f"---"
            )

        return "\n".join(context_parts)

    except Exception as e:
        return f"Error retrieving information: {str(e)}"


async def main():
    """
    Main function to run the RAG Agent with streaming and persistence.
    """
    # Create the BookGuide agent
    agent = Agent(
        name="BookGuide",
        instructions=(
            "You are an expert on the provided book. Use the search_book_knowledge tool for all factual queries. "
            "If the information is missing from the tool's output, inform the user it isn't in the book. "
            "Maintain a helpful and academic tone."
        ),
        model=model,
        tools=[search_book_knowledge]
    )

    # Create a session for persistence
    session = SQLiteSession("rag_agent_session.db")

    # Run the agent with streaming
    print("BookGuide Agent is ready! Type 'quit' to exit.")
    print("You can ask questions about the book content.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ['quit', 'exit', 'q']:
            break

        print("BookGuide: ", end="", flush=True)

        # Run the agent with streaming - using official API pattern
        result = Runner.run_streamed(agent, input=user_input, session=session)
        async for event in result.stream_events():
            if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                print(event.data.delta, end="", flush=True)

        print("\n")  # New line after response


def start():
    asyncio.run(main())


if __name__ == "__main__":
    start()