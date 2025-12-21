// API service for communicating with the RAG chatbot backend
interface ChatRequest {
  message: string;
  session_id?: string | null;
}

interface ChatResponse {
  response: string;
  sources: string[];
  session_id?: string;
  confidence?: number;
}

interface IngestRequest {
  directory?: string;
  recursive?: boolean;
}

interface IngestResponse {
  status: string;
  processed_files: number;
  skipped_files: number;
}

interface IngestionStatus {
  status: string;
  indexed_documents: number;
  indexed_chunks: number;
  last_ingestion: string;
}

interface SessionResponse {
  session_id: string;
  created_at: string;
  last_interaction: string;
  message_count: number;
}

interface DeleteSessionResponse {
  status: string;
  session_id: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // Use the API base URL from window.ENV (defined in docusaurus.config.ts)
    this.baseUrl = (typeof window !== 'undefined' && (window as any).ENV?.REACT_APP_API_BASE_URL) ||
                  'http://127.0.0.1:8000';
  }

  async chat(message: string, sessionId: string | null = null): Promise<ChatResponse> {
    // Note: This API service is not used by the ChatKit component
    // ChatKit handles the communication directly via the useChatKit hook
    // This method is kept for compatibility with other parts of the system
    try {
      const response = await fetch(`${this.baseUrl}/chatkit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: {
            type: "input",
            payload: {
              content: [
                {
                  type: "text",
                  text: message
                }
              ]
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response from ChatKit
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantMessageContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6); // Remove 'data: ' prefix
              if (data === '[DONE]') {
                // Streaming complete
                break;
              }

              const parsed = JSON.parse(data);
              // Handle different types of events from the ChatKit server
              if (parsed.type === 'thread.item.added' && parsed.item?.content?.[0]?.text) {
                assistantMessageContent += parsed.item.content[0].text;
              } else if (parsed.type === 'thread.item.updated' && parsed.delta?.content?.[0]?.text) {
                assistantMessageContent += parsed.delta.content[0].text;
              }
            } catch (e) {
              // Skip malformed JSON lines
              continue;
            }
          }
        }
      }

      reader.releaseLock();

      // Return the accumulated response
      return {
        response: assistantMessageContent,
        sources: [],
        session_id: sessionId || undefined
      };
    } catch (error) {
      console.error('Error in chat API call:', error);
      throw error;
    }
  }

  async ingestDocuments(directory: string = 'book_source/docs', recursive: boolean = true): Promise<IngestResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ingestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          directory: directory,
          recursive: recursive
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in ingestion API call:', error);
      throw error;
    }
  }

  async getIngestionStatus(): Promise<IngestionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ingestion/status`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in ingestion status API call:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<SessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat/session/${sessionId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in get session API call:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat/session/${sessionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in delete session API call:', error);
      throw error;
    }
  }
}

export default new ApiService();