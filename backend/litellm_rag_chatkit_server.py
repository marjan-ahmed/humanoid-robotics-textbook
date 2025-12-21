"""
RAG ChatKit Server - Connects ChatKit frontend to your RAG agent using LitellmModel
"""
import os
import json
import time
import random
from typing import Any, Dict, AsyncGenerator
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
from litellm import RateLimitError, ServiceUnavailableError
from functools import lru_cache
import hashlib

# Use the correct imports that work with current agents package
from agents.agent import Agent
from agents.run import Runner
from agents.tool import function_tool
from agents.extensions.models.litellm_model import LitellmModel
from src.retrieve import validate_rag_pipeline

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

os.environ.pop("GOOGLE_APPLICATION_CREDENTIALS", None)
os.environ.pop("GOOGLE_CLOUD_PROJECT", None)
os.environ.pop("GCLOUD_PROJECT", None)
os.environ.pop("VERTEX_PROJECT", None)
os.environ.pop("VERTEX_LOCATION", None)

# Tell LiteLLM explicitly
os.environ["LITELLM_DISABLE_VERTEX"] = "true"

GEMINI_MODEL = os.getenv("GEMINI_MODEL")  # Using gemini-1.5-flash which may have better free tier availability
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize the model using LitellmModel (compatible with current agents package)
# Try to use environment variable first, fallback to gemini-1.5-flash
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "gemini")  # Options: gemini, openai, anthropic, etc.

if MODEL_PROVIDER == "gemini":
    # Use the correct format for Gemini API via OpenAI-compatible endpoint
    model = LitellmModel(
        model=f"gemini/{GEMINI_MODEL}",  # OpenAI-compatible Gemini endpoint
        api_key=GEMINI_API_KEY,
    )
else:
    # Fallback to a different model provider if specified
    model = LitellmModel(
        model=os.getenv("FALLBACK_MODEL", "gemini-1.5-flash"),
        api_key=os.getenv("FALLBACK_API_KEY", GEMINI_API_KEY)
    )

@function_tool
def search_book_knowledge(query: str) -> str:
    """
    Search the book knowledge base using Qdrant retrieval.
    This connects to your vector database for retrieval.
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

# Create the BookGuide agent with your RAG pipeline
book_guide_agent = Agent(
    name="BookGuide",
    instructions=(
        "You are an expert on the provided book. Use the search_book_knowledge tool for all factual queries. "
        "If the information is missing from the tool's output, inform the user it isn't in the book. "
        "Maintain a helpful and academic tone."
    ),
    model=model,
    tools=[search_book_knowledge]  # This connects to your RAG pipeline
)

# In-memory storage for threads and response cache
threads_store = {}
response_cache = {}
CACHE_TTL = 300  # 5 minutes cache TTL

app = FastAPI(title="Litellm RAG ChatKit Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://marjan-ahmed.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_chatkit_response_event(event_type: str, data: Dict[str, Any]) -> str:
    """Create a ChatKit-compatible server-sent event"""
    event = {
        "type": event_type,
        **data  # Flatten the data into the main event object
    }
    return f"data: {json.dumps(event)}\n\n"


def get_cache_key(user_message: str, thread_id: str) -> str:
    """Generate a cache key based on user message and thread ID"""
    cache_input = f"{thread_id}:{user_message}".encode('utf-8')
    return hashlib.md5(cache_input).hexdigest()


def get_cached_response(cache_key: str):
    """Get cached response if it exists and hasn't expired"""
    if cache_key in response_cache:
        response, timestamp = response_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return response
        else:
            # Remove expired cache entry
            del response_cache[cache_key]
    return None


def set_cached_response(cache_key: str, response: str):
    """Cache a response with current timestamp"""
    response_cache[cache_key] = (response, time.time())

async def run_rag_agent_and_stream_response(thread_id: str, user_message: str) -> AsyncGenerator[str, None]:
    """Helper to run your RAG agent and stream ChatKit-compatible SSE events"""

    # Check if we have a cached response for this query
    cache_key = get_cache_key(user_message, thread_id)
    cached_response = get_cached_response(cache_key)

    if cached_response:
        print(f"Cache hit for query: {user_message[:50]}...")
        # Stream the cached response
        assistant_message_id = f"msg_{uuid.uuid4().hex[:12]}"
        assistant_content = cached_response

        # Send assistant message created event with full structure
        assistant_message_obj = {
            "id": assistant_message_id,
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": assistant_content}],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "thread_id": thread_id
        }

        yield create_chatkit_response_event("thread.item.added", {
            "item": assistant_message_obj
        })

        # Send item done event with complete message object
        final_assistant_message_obj = {
            "id": assistant_message_id,
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": assistant_content}],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "thread_id": thread_id
        }

        yield create_chatkit_response_event("thread.item.done", {
            "item": final_assistant_message_obj
        })
        return

    max_retries = 3
    retry_count = 0

    while retry_count <= max_retries:
        try:
            # Run your RAG agent with streaming
            result = Runner.run_streamed(book_guide_agent, input=user_message)

            # Generate assistant message ID
            assistant_message_id = f"msg_{uuid.uuid4().hex[:12]}"
            assistant_content = ""

            # Send assistant message created event with full structure
            assistant_message_obj = {
                "id": assistant_message_id,
                "type": "message",
                "role": "assistant",
                "content": [{"type": "text", "text": ""}],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "thread_id": thread_id
            }

            yield create_chatkit_response_event("thread.item.added", {
                "item": assistant_message_obj
            })

            # Stream the RAG agent response
            async for event in result.stream_events():
                if hasattr(event, 'data') and hasattr(event.data, 'delta'):
                    delta = event.data.delta
                    if delta:
                        assistant_content += delta

                        # Send content update event with proper structure
                        yield create_chatkit_response_event("thread.item.updated", {
                            "item_id": assistant_message_id,
                            "item": {
                                "id": assistant_message_id,
                                "type": "message",
                                "role": "assistant",
                                "content": [{"type": "text", "text": assistant_content}],
                                "created_at": datetime.now(timezone.utc).isoformat(),
                                "thread_id": thread_id
                            }
                        })

            # Send item done event with complete message object
            final_assistant_message_obj = {
                "id": assistant_message_id,
                "type": "message",
                "role": "assistant",
                "content": [{"type": "text", "text": assistant_content}],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "thread_id": thread_id
            }

            yield create_chatkit_response_event("thread.item.done", {
                "item": final_assistant_message_obj
            })

            # Cache the response for future identical queries
            set_cached_response(cache_key, assistant_content)

            # If successful, break out of retry loop
            break

        except (RateLimitError, ServiceUnavailableError) as e:
            retry_count += 1
            if retry_count > max_retries:
                # Send error event to client
                error_message = f"Rate limit exceeded. Please try again later. Error: {str(e)}"
                yield create_chatkit_response_event("error", {"message": error_message})
                break

            # Calculate exponential backoff delay (1s, 2s, 4s, etc.) with jitter
            base_delay = 2 ** retry_count
            jitter = random.uniform(0, 1)
            delay = base_delay + jitter

            print(f"Rate limit hit, retrying in {delay:.2f}s (attempt {retry_count}/{max_retries})")

            # Wait before retrying
            await asyncio.sleep(delay)

        except Exception as e:
            yield create_chatkit_response_event("error", {"message": f"Error processing RAG agent response: {str(e)}"})
            break

async def process_chatkit_request(request_data: Dict[str, Any]) -> AsyncGenerator[str, None]:
    """Process ChatKit protocol request and yield server-sent events"""

    # Extract the request type
    request_type = request_data.get("type")

    if request_type == "threads.create":
        # Extract the user message from the input
        params = request_data.get("params", {})
        input_data = params.get("input", {})
        content_list = input_data.get("content", [])

        user_message = ""
        for content in content_list:
            content_type = content.get("type")
            if content_type == "input_text":
                user_message = content.get("text", "")
                break
            elif content_type == "text":
                user_message = content.get("text", "")
                break

        if not user_message:
            yield create_chatkit_response_event("error", {"message": "No text content found in input"})
            return

        # Generate a thread ID
        thread_id = f"thread_{uuid.uuid4().hex[:12]}"

        # Create thread object
        thread_obj = {
            "id": thread_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "metadata": {}
        }

        # Save to store
        threads_store[thread_id] = thread_obj

        # Send thread created event first
        yield create_chatkit_response_event("thread.created", {
            "thread": thread_obj
        })

        # Add user message to thread
        user_message_id = f"msg_{uuid.uuid4().hex[:12]}"
        user_message_obj = {
            "id": user_message_id,
            "type": "message",
            "role": "user",
            "content": [{"type": "text", "text": user_message}],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "thread_id": thread_id
        }

        # Send user message added event
        yield create_chatkit_response_event("thread.item.added", {
            "item": user_message_obj
        })

        # Process with your RAG agent (this calls your retrieval function)
        async for event in run_rag_agent_and_stream_response(thread_id, user_message):
            yield event

    elif request_type == "threads.add_user_message":
        params = request_data.get("params", {})
        thread_id = params.get("thread_id")
        input_data = params.get("input", {})
        content_list = input_data.get("content", [])

        user_message = ""
        for content in content_list:
            if content.get("type") in ["input_text", "text"]:
                user_message = content.get("text", "")
                break

        if not user_message:
            yield create_chatkit_response_event("error", {"message": "No text content found in input"})
            return

        if thread_id not in threads_store:
            # Create a placeholder if it doesn't exist
            threads_store[thread_id] = {
                "id": thread_id,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "metadata": {}
            }

        # Add user message to thread
        user_message_id = f"msg_{uuid.uuid4().hex[:12]}"
        user_message_obj = {
            "id": user_message_id,
            "type": "message",
            "role": "user",
            "content": [{"type": "text", "text": user_message}],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "thread_id": thread_id
        }

        # Send user message added event
        yield create_chatkit_response_event("thread.item.added", {
            "item": user_message_obj
        })

        # Process with your RAG agent (this calls your retrieval function)
        async for event in run_rag_agent_and_stream_response(thread_id, user_message):
            yield event

    else:
        yield create_chatkit_response_event("error", {"message": f"Unsupported request type: {request_type}"})

@app.post("/chatkit")
async def chatkit_endpoint(request: Request):
    """ChatKit protocol endpoint that connects to your RAG agent"""
    try:
        request_data = await request.json()

        async def event_generator():
            async for event in process_chatkit_request(request_data):
                yield event

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok", "model": GEMINI_MODEL}

if __name__ == "__main__":
    import uvicorn
    print("Starting Litellm RAG ChatKit Server - connecting to your RAG pipeline")
    print("Server running at http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)