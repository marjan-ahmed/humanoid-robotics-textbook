# Implementation Plan: Website Ingestion & Vector Storage

**Branch**: `4-website-ingestion` | **Date**: 2025-12-17 | **Spec**: [link to spec](../specs/4-website-ingestion/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a single-file Python ingestion pipeline (main.py) that discovers URLs from a Docusaurus site, extracts text content, chunks it, generates embeddings using Cohere, and stores vectors in Qdrant vector database. The pipeline will target the deployed site at https://marjan-ahmed.github.io/humanoid-robotics-textbook/sitemap.xml and create a Qdrant collection named "humanoid-book-rag".

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: requests, beautifulsoup4, cohere, qdrant-client, python-dotenv
**Storage**: Qdrant vector database (external service)
**Testing**: pytest (for unit tests)
**Target Platform**: Linux server
**Project Type**: backend service
**Performance Goals**: Process up to 1000 pages within 1 hour with 95% success rate
**Constraints**: <200ms p95 for embedding generation, memory efficient processing of large documents
**Scale/Scope**: Up to 100,000 words per document, 99% embedding success rate

## Phase 0 Research Completed

Research has been completed in `research.md` and includes:
- Technology stack decisions (requests, beautifulsoup4, cohere, qdrant-client)
- Function implementation plan for all required functions
- Configuration requirements and deployment target analysis
- Architecture decisions for single-file implementation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The implementation uses Python backend which is compliant with the project constitution. The plan involves creating a backend service that processes Docusaurus content, which aligns with the project's goal of creating educational content for the Physical AI & Humanoid Robotics book. The use of external services (Cohere, Qdrant) is acceptable as they're used for processing rather than storing core content.

## Project Structure

### Documentation (this feature)

```text
specs/4-website-ingestion/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── main.py
├── pyproject.toml
├── uv.lock
├── .env.example
└── .env
```

**Structure Decision**: Single backend project with one main file (main.py) containing all ingestion functions as specified in the requirements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| External dependencies (Cohere, Qdrant) | RAG pipeline requires semantic embeddings and vector storage | Building in-house embeddings would be time-intensive and less effective |