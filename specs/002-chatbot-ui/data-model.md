# Data Model: Chatbot UI with Dynamic Settings

## Overview
This document defines the data model for the chatbot UI with dynamic settings feature, based on the entities identified in the feature specification.

## Entities

### Chat Thread
**Description**: Represents a persistent conversation session with a unique identifier that persists across page visits

**Attributes**:
- `threadId` (string): Unique identifier for the conversation thread, stored in localStorage
- `createdAt` (Date): Timestamp when the thread was created
- `updatedAt` (Date): Timestamp of the last activity in the thread
- `isActive` (boolean): Indicates if this is the currently active thread

**Validation Rules**:
- threadId must be unique per user session
- threadId must be stored in localStorage for persistence
- threadId should be generated if none exists

### Top-K Parameter
**Description**: Represents the number of search results to consider when processing user queries (range 1-10)

**Attributes**:
- `value` (number): Current value of the top_k parameter (1-10)
- `minValue` (number): Minimum allowed value (1)
- `maxValue` (number): Maximum allowed value (10)

**Validation Rules**:
- Value must be between 1 and 10 (inclusive)
- Value should be stored in component state
- Value should be passed to backend with each message request

### Chat Message
**Description**: Represents an individual message in the conversation history with sender, content, and timestamp

**Attributes**:
- `id` (string): Unique identifier for the message
- `content` (string): The text content of the message
- `sender` (string): Identifier for the message sender ('user' or 'assistant')
- `timestamp` (Date): When the message was sent/received
- `threadId` (string): Reference to the chat thread this message belongs to

**Validation Rules**:
- Content must not be empty
- Sender must be either 'user' or 'assistant'
- Timestamp must be set when the message is created
- Messages must be associated with a valid threadId

## State Management

### Chat UI State
**Description**: State object managing the visibility and configuration of the chat interface

**Attributes**:
- `isVisible` (boolean): Whether the chat window is currently visible
- `topKValue` (number): Current value of the top-k parameter
- `isLoading` (boolean): Whether the chat is currently loading or processing
- `threadId` (string): The current active thread ID

## Relationships
- Chat Thread contains multiple Chat Messages
- Top-K Parameter is associated with a Chat Thread
- Chat UI State manages the visibility of the Chat Thread interface

## Storage Model
- Chat Thread ID is stored in localStorage with key 'chat_thread_id'
- Top-K Parameter value is maintained in component state
- Chat Messages are managed by the ChatKit service