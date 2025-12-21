---
id: 1
title: Create Chatbot UI Spec
stage: spec
date: 2025-01-17
surface: agent
model: Claude Sonnet 4.5
feature: chatbot-ui
branch: 002-chatbot-ui
user: Claude Code User
command: /sp.specify
labels: ["spec", "chatbot", "ui", "frontend"]
links:
  spec: specs/002-chatbot-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-chatbot-ui/spec.md
 - specs/002-chatbot-ui/checklists/requirements.md
 - history/prompts/002-chatbot-ui/1-create-chatbot-ui-spec.spec.prompt.md
tests:
 - null
---

## Prompt

Create a React-based Chatbot UI for Docusaurus with Dynamic Settings

Target: A floating chat popup embedded in the book's frontend.
Stack: React, @openai/chatkit-react,



Requirements:

1. Layout: Fixed position at the bottom-right of the screen.

2. Dimensions: The chat container must be exactly 350px wide and 550px high.

3. Toggle Mechanism: A Floating Action Button (FAB) that toggles the chat window's visibility.

4. ChatKit Integration: Use the <ChatKit /> component and the useChatKit hook.

5. Placeholder: Implement an async getClientSecret function that returns a dummy string.

6. Design: Modern popup aesthetic with rounded-2xl corners and a heavy shadow (shadow-2xl).

7. Dynamic Top-K:

   - Add a settings menu/header within the popup.

   - Include a slider to modify a 'top_k' state (range 1-10).

   - Pass this 'top_k' value into the ChatKit config metadata so it can be sent to the backend later.

8. Chat History Persistence: Implement a threadId using localStorage logic that checks for an existing chat_thread_id on initialization and generates a unique one if not found; this stable ID must be passed to the <ChatKit /> configuration to ensure that in Spec-5, the backend's SQLiteSession("rag_agent_session.db") can consistently map and retrieve the user's specific history across page refreshes or navigation.

## Response snapshot

Created a comprehensive specification for the Chatbot UI with Dynamic Settings feature. The specification includes:

- User scenarios with priorities (P1-P2) describing the core functionality
- Functional requirements (FR-001 to FR-010) detailing system behaviors
- Key entities involved in the feature
- Success criteria with measurable outcomes (SC-001 to SC-005)
- Edge cases to consider during implementation

The spec addresses all requirements from the original request:
- Floating action button in bottom-right corner
- Chat window with exact dimensions (350px x 550px)
- Toggle mechanism for visibility
- ChatKit integration
- Dynamic top-k parameter with slider control
- Chat history persistence using localStorage
- Modern styling with rounded corners and shadows

## Outcome

- ✅ Impact: Created complete feature specification for chatbot UI with dynamic settings
- 🧪 Tests: null
- 📁 Files: specs/002-chatbot-ui/spec.md, specs/002-chatbot-ui/checklists/requirements.md, history/prompts/002-chatbot-ui/1-create-chatbot-ui-spec.spec.prompt.md
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Specification is comprehensive and ready for planning phase

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Begin planning implementation