# Research: Chatbot UI with Dynamic Settings

## Overview
This document captures research findings for implementing a floating chatbot UI component with dynamic settings for the Docusaurus-based book frontend.

## Decision: ChatKit Integration Approach
**Rationale**: The feature requires integration with ChatKit for messaging functionality. Research confirms that @openai/chatkit-react provides the necessary components including <ChatKit /> and useChatKit hook as specified in the requirements.

**Implementation Details**:
- Use <ChatKit /> component for the main chat interface
- Implement useChatKit hook for managing chat state
- Create a placeholder async getClientSecret function that returns a dummy string as required

## Decision: UI Positioning and Styling
**Rationale**: The component needs to be positioned as a floating action button in the bottom-right corner with a 350px x 550px chat window.

**Implementation Details**:
- Use CSS positioning (fixed) for the FAB and chat window
- Apply modern styling using ChatKit's built-in styles with minimal custom CSS for layout
- Implement rounded-2xl corners and shadow-2xl effects using CSS classes
- Ensure dimensions are exactly 350px wide and 550px high as specified

## Decision: Dynamic Top-K Parameter Implementation
**Rationale**: The feature requires a slider to modify the 'top_k' parameter (range 1-10) with the value passed to the backend.

**Implementation Details**:
- Add a settings header/section within the chat popup
- Implement a slider component for top_k parameter (range 1-10)
- Store and update the top_k value in component state
- Pass the current top_k value in ChatKit config metadata to send to backend

## Decision: Chat History Persistence
**Rationale**: The feature requires persistent chat history across page refreshes and navigation.

**Implementation Details**:
- Generate a unique threadId if none exists in localStorage
- Check for existing chat_thread_id on initialization
- Store threadId in localStorage for persistence
- Pass the threadId to <ChatKit /> configuration to maintain conversation history
- Use localStorage API for client-side storage

## Decision: FAB Toggle Mechanism
**Rationale**: The feature requires a floating action button that toggles the chat window visibility.

**Implementation Details**:
- Create a FAB component using React and Lucide React icons
- Implement state management for chat window visibility
- Position the FAB in the bottom-right corner of the screen
- Add smooth open/close animations for better UX

## Technology Stack Confirmed
- React for component implementation
- @openai/chatkit-react for chat functionality
- Lucide React for icons
- Standard CSS modules (no Tailwind CSS, as per constitution)
- TypeScript for type safety
- Docusaurus framework integration

## Next Steps
1. Implement the data model based on the key entities identified in the spec
2. Create the component structure with proper file organization
3. Implement the core functionality following the architecture decisions above