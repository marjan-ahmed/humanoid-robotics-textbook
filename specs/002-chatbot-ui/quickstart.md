# Quickstart Guide: Chatbot UI with Dynamic Settings

## Overview
This guide provides a quick introduction to implementing and using the floating chatbot UI component with dynamic settings for the Docusaurus-based book frontend.

## Prerequisites
- Node.js and npm installed
- Docusaurus project set up in the `book_source` directory
- Basic knowledge of React and TypeScript

## Installation
1. Install the required dependencies:
```bash
npm install @openai/chatkit-react lucide-react
```

2. Ensure you have React and TypeScript properly configured in your Docusaurus project

## Component Structure
The chatbot UI consists of the following files:
```
book_source/src/components/chat-popup/
├── ChatPopup.tsx          # Main chat component with toggle functionality
├── ChatPopup.module.css   # Minimal CSS for positioning and layout
└── FAB.tsx               # Floating Action Button component
```

## Implementation Steps

### 1. Create the FAB Component
The Floating Action Button should:
- Be positioned in the bottom-right corner of the screen
- Toggle the visibility of the chat window when clicked
- Use an appropriate icon from Lucide React

### 2. Create the ChatPopup Component
The main chat component should:
- Have fixed dimensions of 350px width and 550px height
- Integrate with the <ChatKit /> component for messaging
- Include a settings section with a top-k parameter slider
- Handle localStorage for thread ID persistence
- Use proper positioning (fixed) to appear as a popup

### 3. Implement ChatKit Integration
- Use the useChatKit hook to manage chat state
- Implement a placeholder getClientSecret function that returns a dummy string
- Pass the threadId and top_k value in the ChatKit configuration

### 4. Add Dynamic Top-K Functionality
- Create a slider in the chat header/settings area
- Implement state management for the top_k parameter (range 1-10)
- Pass the current top_k value to the backend with each message

### 5. Implement Thread Persistence
- Check for existing 'chat_thread_id' in localStorage on initialization
- Generate a new unique thread ID if none exists
- Store the thread ID in localStorage for persistence across sessions

## Usage
Once implemented, the chatbot UI will:
- Appear as a floating button in the bottom-right corner on all pages
- Open a 350px x 550px chat window when clicked
- Maintain conversation history across page refreshes
- Allow users to adjust the top-k parameter for search behavior
- Send messages to the backend with the current top_k value

## Key Configuration
- Dimensions: 350px (width) x 550px (height)
- Position: Fixed, bottom-right corner
- Top-k range: 1-10
- Thread storage key: 'chat_thread_id'
- Styling: Rounded corners (rounded-2xl equivalent), shadow (shadow-2xl equivalent)

## Testing
- Verify the FAB appears on all pages
- Test opening and closing the chat window
- Confirm message sending and receiving works
- Validate that conversation history persists across page refreshes
- Ensure the top-k slider updates and affects subsequent queries