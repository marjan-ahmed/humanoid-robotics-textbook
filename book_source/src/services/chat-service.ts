// TypeScript interfaces for the entities
export interface ChatThread {
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface TopKParameter {  
  value: number;
  minValue: number;
  maxValue: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  threadId: string;
}

export interface ChatUIState {
  isVisible: boolean;
  topKValue: number;
  isLoading: boolean;
  threadId: string;
}

/**
 * Placeholder function for getting client secret
 * This returns a dummy string as required by the specification
 */
export const getClientSecret = async (): Promise<string> => {
  return 'dummy-client-secret-for-testing';
};

/**
 * Manages thread ID persistence in localStorage
 * Checks for existing chat_thread_id on initialization and generates a unique one if not found
 */
export const getOrCreateThreadId = (): string => {
  const storedThreadId = localStorage.getItem('chat_thread_id');

  if (storedThreadId) {
    return storedThreadId;
  } else {
    // Generate a new unique thread ID
    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chat_thread_id', newThreadId);
    return newThreadId;
  }
};

/**
 * Updates the last activity timestamp for the current thread
 */
export const updateThreadActivity = (threadId: string): void => {
  // In a real implementation, this would update the thread's updatedAt timestamp
  // For now, we just ensure the thread ID exists in localStorage
  if (threadId) {
    localStorage.setItem('chat_thread_id', threadId);
  }
};

/**
 * Gets the current top_k value from localStorage or returns default
 */
export const getTopKValue = (): number => {
  const storedValue = localStorage.getItem('top_k_value');
  if (storedValue) {
    const value = parseInt(storedValue, 10);
    return isNaN(value) ? 3 : Math.max(1, Math.min(10, value)); // Ensure value is between 1-10
  }
  return 3; // Default value
};

/**
 * Saves the top_k value to localStorage
 */
export const saveTopKValue = (value: number): void => {
  // Ensure the value is within the valid range
  const clampedValue = Math.max(1, Math.min(10, value));
  localStorage.setItem('top_k_value', clampedValue.toString());
};