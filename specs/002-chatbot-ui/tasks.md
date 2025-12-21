# Implementation Tasks: Chatbot UI with Dynamic Settings

**Feature**: Chatbot UI with Dynamic Settings
**Branch**: `002-chatbot-ui`
**Date**: 2025-01-17
**Spec**: [specs/002-chatbot-ui/spec.md](specs/002-chatbot-ui/spec.md)

## Overview
This document lists all implementation tasks for the Chatbot UI with Dynamic Settings feature. Tasks are organized by user story priority and include setup, foundational, and user story-specific tasks.

## Dependencies
- Node.js and npm installed
- Docusaurus project set up in `book_source` directory
- TypeScript configured
- React and @openai/chatkit-react dependencies available

## Parallel Execution Examples
- T002-T004 can be executed in parallel during setup phase
- US1 tasks can run independently of US2 tasks after foundational phase
- UI components (FAB, ChatPopup) can be developed in parallel during US1

## Implementation Strategy
MVP will focus on User Story 1 (Access Chatbot Interface) to deliver core functionality first, followed by User Story 2 (Engage in Chat Conversation) and User Story 3 (Adjust Search Parameters).

---

## Phase 1: Setup

**Goal**: Prepare project structure and dependencies for chatbot UI implementation

- [ ] T001 Create directory structure in book_source/src/components/chat-popup/
- [ ] T002 [P] Install required dependencies: @openai/chatkit-react, lucide-react
- [ ] T003 [P] Create placeholder files: book_source/src/components/chat-popup/ChatPopup.tsx
- [ ] T004 [P] Create placeholder files: book_source/src/components/chat-popup/FAB.tsx
- [ ] T005 [P] Create placeholder files: book_source/src/components/chat-popup/ChatPopup.module.css

---

## Phase 2: Foundational

**Goal**: Implement core functionality required by all user stories

- [ ] T006 Create chat service with placeholder getClientSecret function in book_source/src/services/chat-service.ts
- [ ] T007 Implement thread ID management with localStorage in book_source/src/services/chat-service.ts
- [ ] T008 Create TypeScript interfaces for Chat Thread, Top-K Parameter, and Chat Message entities
- [ ] T009 [P] Implement CSS module for basic chat popup styling with fixed dimensions (350px x 550px)
- [ ] T010 [P] Implement CSS module for FAB positioning in bottom-right corner with proper z-index

---

## Phase 3: User Story 1 - Access Chatbot Interface (Priority: P1)

**Goal**: Enable users to access a chatbot interface while browsing documentation with a floating action button

**Independent Test**: Can be fully tested by clicking the FAB and verifying the chat window opens with proper dimensions (350px x 550px) and styling (rounded corners, shadow).

- [ ] T011 [US1] Create FAB component with toggle functionality in book_source/src/components/chat-popup/FAB.tsx
- [ ] T012 [US1] Implement ChatPopup component with visibility state management
- [ ] T013 [US1] Add CSS styling for chat window dimensions (350px x 550px) in ChatPopup.module.css
- [ ] T014 [US1] Add CSS styling for modern aesthetic (rounded corners, shadow) in ChatPopup.module.css
- [ ] T015 [US1] Implement toggle mechanism between FAB and ChatPopup components
- [ ] T016 [US1] Test FAB appears in bottom-right corner on all pages
- [ ] T017 [US1] Test chat window opens with correct dimensions when FAB is clicked
- [ ] T018 [US1] Test chat window closes when FAB is clicked again

---

## Phase 4: User Story 2 - Engage in Chat Conversation (Priority: P1)

**Goal**: Enable users to have conversations with the chatbot and persist conversation history across page refreshes

**Independent Test**: Can be fully tested by sending messages to the chatbot and verifying they are displayed in the chat history, with persistence across page refreshes.

- [ ] T019 [US2] Integrate ChatKit component into ChatPopup in book_source/src/components/chat-popup/ChatPopup.tsx
- [ ] T020 [US2] Implement useChatKit hook for managing chat state in ChatPopup component
- [ ] T021 [US2] Pass threadId from localStorage to ChatKit configuration
- [ ] T022 [US2] Test message sending functionality with ChatKit integration
- [ ] T023 [US2] Test message receiving functionality with ChatKit integration
- [ ] T024 [US2] Test conversation history persistence across page refreshes
- [ ] T025 [US2] Test navigation between pages preserves chat history

---

## Phase 5: User Story 3 - Adjust Search Parameters (Priority: P2)

**Goal**: Allow users to control chatbot search behavior by adjusting the 'top_k' parameter with a slider

**Independent Test**: Can be fully tested by adjusting the slider and verifying the top_k value is passed to the backend with subsequent messages.

- [ ] T026 [US3] Add settings header/section within chat popup UI in ChatPopup.tsx
- [ ] T027 [US3] Implement top_k slider component with range 1-10 in ChatPopup.tsx
- [ ] T028 [US3] Add state management for top_k parameter value in ChatPopup component
- [ ] T029 [US3] Pass current top_k value in ChatKit config metadata to backend
- [ ] T030 [US3] Implement localStorage persistence for top_k value
- [ ] T031 [US3] Test slider adjusts top_k parameter value correctly
- [ ] T032 [US3] Test top_k value is passed to backend with subsequent messages
- [ ] T033 [US3] Test top_k value persists across page refreshes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Complete the implementation with additional features and quality improvements

- [ ] T034 Add visual feedback for loading states in chat interface
- [ ] T035 Implement error handling for ChatKit integration
- [ ] T036 Add smooth animations for chat window open/close transitions
- [ ] T037 Implement responsive design considerations for different screen sizes
- [ ] T038 Add accessibility features to FAB and chat components
- [ ] T039 Test all functionality works when localStorage is disabled
- [ ] T040 Update Docusaurus layout to include the chat component
- [ ] T041 Write component tests for FAB and ChatPopup components
- [ ] T042 Document the chatbot UI component usage in README
- [ ] T043 Perform final integration testing across all user stories
- [ ] T044 Verify compliance with project constitution (no Tailwind CSS, TypeScript, etc.)