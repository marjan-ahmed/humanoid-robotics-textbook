<!-- SYNC IMPACT REPORT
Version change: N/A (new constitution) → 1.0.0
Modified principles: N/A
Added sections: Version, Governance, Amendment procedure, Compliance review
Removed sections: N/A
Templates requiring updates: All ✅ updated
Follow-up TODOs: None
-->

# Project Constitution

## Version
**Constitution Version**: 1.0.0
**Ratification Date**: 2025-01-01
**Last Amended Date**: 2025-12-08

## Project Title
**Physical AI & Humanoid Robotics Book**

## Mission
Create a multi-chapter educational book using **Docusaurus (TypeScript)**.
The dedicated project folder must be named **`book_source`**.
All work is **Spec-Driven** and produced through iterative cycles using **Spec-Kit Plus**.

## Tech Stack
- Docusaurus (TypeScript)
- Node.js + npm
- Standard Docusaurus CSS / React Components
- Claude Code as the agentic execution environment

## Domain
Physical AI, Humanoid Robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, Vision-Language-Action Robotics.

## Scope

### You must complete the following:
- use context7 mcp if wants any clarity and context
- Initialize the Docusaurus project inside a folder named **`book_source`**
  *(Claude Code: Use `context7` during initialization)*
- Build a **custom, well-designed home landing page** using standard Docusaurus CSS and React
- Create a complete **book structure** with chapters & submodules
- Provide **fully written content** for every page

## Content Requirements

### The book must include **6 chapters**:

1. **Introduction to Physical AI**
2. **ROS 2: The Robotic Nervous System**
3. **Simulation: Gazebo, Unity & Digital Twins**
4. **NVIDIA Isaac & AI-Powered Robotics**
5. **Vision-Language-Action (VLA)**
6. **Capstone: The Autonomous Humanoid**

Each chapter must contain **3–5 submodules**.

## Home Page Requirements

The landing page must include:

- Course details
- Themes
- Modules overview
- Learning outcomes
- Hardware requirements
- Custom React components styled using **standard CSS modules only**

## Constraints
- Must remain **fully TypeScript compliant**
- Must use:
  - **Docusaurus default styling**
  - **or custom CSS modules**
- No Tailwind CSS
- No ReactBits
- No Magic UI MCP
- Everything must be **deployable to GitHub Pages**
- No backend, no dynamic APIs
- All assets must be **local** or Docusaurus defaults

## Goals (via Spec-Kit Plus)

Produce the following:

- **Specification** → `/sp.specify`
- **Plan** → `/sp.plan`
- **Tasks** → `/sp.tasks`
- **Implementation** → `/sp.implementation`

These must follow strict deterministic acceptance criteria.

## Values
- Clarity
- Precision
- Reusability
- Determinism
- Zero ambiguity

## Modality
- All outputs must be **Markdown**
- Code must be **fully copy–paste ready**

## Governance

### Amendment Procedure
This constitution may be amended through the following process:
1. Propose changes via `/sp.constitution` command with justification
2. Changes must be reviewed and approved by project stakeholders
3. Updated version must follow semantic versioning
4. All dependent artifacts must be synchronized

### Versioning Policy
- MAJOR: Backward incompatible governance/principle removals or redefinitions
- MINOR: New principle/section added or materially expanded guidance
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review
All project work must be validated against this constitution during:
- Plan phase (via Constitution Check section)
- Implementation phase (via automated checks where possible)
- Final review before delivery

## Follow-up
After establishing this constitution, **wait for the user to call `/sp.specify`**.