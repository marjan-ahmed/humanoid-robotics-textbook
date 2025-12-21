# Data Model: Website Ingestion & Vector Storage

## Document Chunk
Represents a segment of text extracted from a website page, including content, metadata, and embedding vector.

**Fields:**
- `id` (string): Unique identifier for the chunk (UUID)
- `content` (string): The actual text content of the chunk
- `source_url` (string): URL of the original page where the content was found
- `title` (string): Title of the original page
- `section` (string): Section or heading under which the content appears
- `chunk_index` (integer): Position of the chunk within the original document
- `embedding` (list[float]): Vector embedding of the content (1024-dimensional for Cohere)
- `created_at` (datetime): Timestamp when the chunk was created
- `metadata` (dict): Additional metadata including page-specific information

**Validation:**
- Content must be non-empty
- Source URL must be a valid URL
- Embedding must have the correct dimension (1024 for Cohere)

## Ingestion Job
Represents a single execution of the ingestion process with configuration parameters and status.

**Fields:**
- `id` (string): Unique identifier for the job (UUID)
- `status` (string): Current status (pending, running, completed, failed)
- `source_url` (string): Base URL of the website being ingested
- `chunk_size` (integer): Size of text chunks in characters/tokens
- `overlap` (integer): Overlap between chunks in characters/tokens
- `created_at` (datetime): When the job was initiated
- `completed_at` (datetime): When the job was completed (null if running)
- `processed_count` (integer): Number of URLs processed
- `total_count` (integer): Total number of URLs to process
- `error_count` (integer): Number of failed processing attempts
- `errors` (list[dict]): Details of any processing errors

**Validation:**
- Status must be one of the allowed values
- Chunk size must be positive
- Overlap must be non-negative and less than chunk size

## Website Source
Represents the target website being ingested, including URL and filtering rules.

**Fields:**
- `base_url` (string): The root URL of the website to be ingested
- `allowed_domains` (list[string]): List of domains allowed to be crawled
- `disallowed_paths` (list[string]): Paths to exclude from crawling
- `rate_limit` (integer): Maximum requests per second
- `timeout` (integer): Request timeout in seconds
- `include_patterns` (list[string]): Regex patterns for URLs to include
- `exclude_patterns` (list[string]): Regex patterns for URLs to exclude

**Validation:**
- Base URL must be a valid URL
- Rate limit must be positive
- Timeout must be positive

## Qdrant Point Structure
The structure of how data is stored in Qdrant vector database.

**Fields:**
- `id` (string): Unique identifier for the point
- `vector` (list[float]): The embedding vector
- `payload` (dict): Metadata associated with the vector containing:
  - `content` (string): The text content
  - `source_url` (string): Original URL
  - `title` (string): Page title
  - `section` (string): Section header
  - `chunk_index` (integer): Position in original document
  - `created_at` (datetime): Creation timestamp

## Relationships
- One Ingestion Job can process many Document Chunks
- One Website Source configuration is used by one Ingestion Job
- Each Document Chunk is stored as one Qdrant Point