# Data Model: Physical AI & Humanoid Robotics Book Frontend

## Entities

### Course
- **Name**: Course
- **Fields**:
  - id: string (unique identifier for the course)
  - title: string (Physical AI & Humanoid Robotics)
  - description: string (course description and overview)
  - quarterOverview: string (overview of the quarter)
  - learningOutcomes: string[] (list of learning outcomes)
  - weeklyBreakdown: object[] (weekly schedule and topics)
  - hardwareRequirements: object (detailed hardware requirements)
- **Relationships**: Contains multiple Chapters
- **Validation**: All fields required; title must be non-empty

### Chapter
- **Name**: Chapter
- **Fields**:
  - id: string (unique identifier for the chapter)
  - number: number (chapter number 1-6)
  - title: string (chapter title)
  - description: string (brief description of the chapter)
  - submodules: Submodule[] (list of submodules in this chapter)
- **Relationships**: Belongs to one Course; contains multiple Submodules
- **Validation**: All fields required; number must be between 1-6

### Submodule
- **Name**: Submodule
- **Fields**:
  - id: string (unique identifier for the submodule)
  - chapterId: string (reference to parent chapter)
  - number: number (submodule number within chapter)
  - title: string (submodule title)
  - content: string (markdown content of the submodule)
- **Relationships**: Belongs to one Chapter
- **Validation**: All fields required; number must be between 1-5

### HardwareRequirement
- **Name**: HardwareRequirement
- **Fields**:
  - id: string (unique identifier for the requirement)
  - category: string ("workstation", "edge-kit", or "robot-lab")
  - name: string (name of the component)
  - description: string (detailed description)
  - specifications: object (technical specifications)
  - cost: string (cost estimate)
  - alternatives: string[] (alternative options)
- **Relationships**: Associated with Course
- **Validation**: All fields required except alternatives

### NavigationItem
- **Name**: NavigationItem
- **Fields**:
  - id: string (unique identifier for the navigation item)
  - title: string (display title)
  - path: string (URL path)
  - type: string ("chapter", "submodule", or "page")
  - parentId: string (optional, for nested structure)
  - children: NavigationItem[] (optional, for nested structure)
- **Relationships**: Hierarchical structure for site navigation
- **Validation**: All fields required except parentId and children

## State Transitions

### Course State Transitions
- DRAFT → REVIEW: When initial content is completed
- REVIEW → PUBLISHED: When content is approved for release
- PUBLISHED → ARCHIVED: When course is no longer offered

### Navigation State Transitions
- HIDDEN → VISIBLE: When navigation item is made available to users
- VISIBLE → HIDDEN: When navigation item is temporarily removed