# Implementation Plan: Chatbot UI with Dynamic Settings

**Branch**: `002-chatbot-ui` | **Date**: 2025-01-17 | **Spec**: [specs/002-chatbot-ui/spec.md](specs/002-chatbot-ui/spec.md)
**Input**: Feature specification from `/specs/002-chatbot-ui/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a floating chatbot UI component for the Docusaurus-based book frontend. The component will provide a toggleable chat interface with dynamic settings including a top-k parameter slider. The chat will integrate with ChatKit for messaging functionality and persist conversation history using localStorage. The UI will primarily use the <ChatKit /> component's built-in styling with minimal custom CSS for positioning and layout.

## Technical Context

**Language/Version**: TypeScript (in accordance with Docusaurus project constitution)
**Primary Dependencies**: React, @openai/chatkit-react, Lucide React (for icons), Docusaurus framework
**Storage**: localStorage for chat thread persistence, no database required
**Testing**: Jest for unit tests, React Testing Library for component tests
**Target Platform**: Web browser (Docusaurus documentation site)
**Project Type**: Web frontend component
**Performance Goals**: <200ms response time for UI interactions, <500ms for chat window toggle
**Constraints**: Must comply with project constitution (no Tailwind CSS), must work with Docusaurus framework, uses <ChatKit /> component for UI
**Scale/Scope**: Single component integration with existing book frontend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Compliance Review:**
- ✅ TypeScript compliance: Feature will use TypeScript as required
- ✅ Docusaurus compliance: Feature will integrate with existing Docusaurus structure
- ✅ No backend requirement: Feature uses localStorage for persistence as allowed
- ✅ GitHub Pages deployable: Component will be client-side only
- ✅ Local assets: Will use ChatKit's built-in styling with minimal custom CSS as needed
- ✅ No Tailwind CSS: Will rely on ChatKit component styling

**Constitution Alignment**: The implementation will use the <ChatKit /> component which provides its own styling, minimizing the need for custom CSS. Any necessary custom styling will use standard CSS modules as required by the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/002-chatbot-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
book_source/src/
├── components/
│   └── chat-popup/      # Chatbot UI component using ChatKit
│       ├── ChatPopup.tsx
│       ├── ChatPopup.module.css  # Minimal custom styling only
│       └── FAB.tsx
└── pages/
    └── ...              # Existing Docusaurus pages

src/
├── components/
│   └── chat-popup/      # Alternative location if needed
│       ├── ChatPopup.tsx
│       ├── ChatPopup.module.css  # Minimal custom styling only
│       └── FAB.tsx
└── services/
    └── chat-service.ts  # ChatKit integration service
```

**Structure Decision**: The chat component will be placed in the book_source/src/components/chat-popup directory with proper TypeScript files. The component will primarily use the <ChatKit /> component's built-in styling with minimal custom CSS modules for positioning and layout as required by the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
