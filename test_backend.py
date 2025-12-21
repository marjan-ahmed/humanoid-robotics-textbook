import requests
import time
import json

def test_backend():
    # Wait a moment for the server to start
    time.sleep(3)

    # Test the health endpoint
    try:
        response = requests.get('http://127.0.0.1:8000/health')
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return

    # Test the chat endpoint
    try:
        chat_data = {
            "message": "Hello, how are you?",
            "thread_id": "test_thread_123"
        }
        response = requests.post('http://127.0.0.1:8000/chat', json=chat_data)
        print(f"Chat endpoint: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {result}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Chat endpoint test failed: {e}")

    # Test the new chatkit endpoint
    try:
        chatkit_data = {
            "event": {
                "type": "input",
                "payload": {
                    "content": [
                        {
                            "type": "text",
                            "text": "Hello, how are you?"
                        }
                    ]
                }
            }
        }
        response = requests.post('http://127.0.0.1:8000/chatkit', json=chatkit_data)
        print(f"ChatKit endpoint: {response.status_code}")
        if response.status_code == 200:
            print("ChatKit response received")
        else:
            print(f"ChatKit Error: {response.text}")
    except Exception as e:
        print(f"ChatKit endpoint test failed: {e}")

if __name__ == "__main__":
    test_backend()