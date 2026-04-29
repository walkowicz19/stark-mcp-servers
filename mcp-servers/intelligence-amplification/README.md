# Sytra Intelligence Amplification MCP Server

MCP server for the Sytra Intelligence Amplification service, providing advanced AI capabilities including prompt optimization, RAG, chain-of-thought reasoning, intelligent model routing, and large-scale code intelligence.

## Features

### Intelligence Amplification
- **Prompt Optimization**: Enhance prompts for better results
- **RAG Pipeline**: Retrieval-Augmented Generation for informed responses
- **Chain-of-Thought**: Advanced reasoning with step-by-step logic
- **Self-Reflection**: Quality improvement through iterative refinement
- **Task Decomposition**: Break complex tasks into manageable subtasks
- **Model Routing**: Intelligent routing to optimal models

### Code Intelligence (Large-Scale)
- **Repository Indexing**: Index 50GB+ repositories with incremental updates
- **Semantic Code Search**: Natural language code search with hybrid ranking
- **Dependency Analysis**: Analyze file dependencies and impact radius
- **Symbol References**: Find all references to functions, classes, variables
- **Complexity Analysis**: Calculate code complexity metrics and quality scores

## Installation

```bash
cd mcp-servers/intelligence-amplification
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `INTELLIGENCE_API_URL`: URL of the Intelligence Amplification service (default: `http://localhost:8004`)

## Available Tools

### optimize_prompt

Optimize a prompt for better results using advanced prompt engineering techniques.

**Parameters:**
- `prompt` (required): The prompt to optimize
- `task_type` (optional): Type of task - "generation", "analysis", "reasoning", "creative", or "technical" (default: "generation")
- `optimization_goals` (optional): Array of goals - "clarity", "specificity", "context", "structure", "examples"
- `target_model` (optional): Target model for optimization (e.g., "gpt-4", "claude-3")

**Example:**
```json
{
  "prompt": "Write a function to sort numbers",
  "task_type": "technical",
  "optimization_goals": ["clarity", "specificity", "examples"],
  "target_model": "gpt-4"
}
```

### rag_query

Query using Retrieval-Augmented Generation (RAG) pipeline.

**Parameters:**
- `query` (required): The query to process
- `knowledge_base` (optional): Knowledge base identifier
- `top_k` (optional): Number of documents to retrieve (default: 5, max: 20)
- `min_relevance` (optional): Minimum relevance score 0-1 (default: 0.7)
- `include_sources` (optional): Include source references (default: true)

**Example:**
```json
{
  "query": "How does authentication work in the system?",
  "knowledge_base": "technical-docs",
  "top_k": 10,
  "min_relevance": 0.8,
  "include_sources": true
}
```

### chain_of_thought

Apply chain-of-thought reasoning to break down complex problems.

**Parameters:**
- `problem` (required): The problem to reason about
- `reasoning_style` (optional): Style - "step_by_step", "tree_of_thought", or "self_consistency" (default: "step_by_step")
- `max_steps` (optional): Maximum reasoning steps (default: 10, max: 50)
- `verify_steps` (optional): Verify each step (default: true)

**Example:**
```json
{
  "problem": "Design a scalable microservices architecture for an e-commerce platform",
  "reasoning_style": "tree_of_thought",
  "max_steps": 15,
  "verify_steps": true
}
```

### self_reflect

Perform self-reflection on a response to identify improvements.

**Parameters:**
- `response` (required): The response to reflect on
- `original_query` (optional): The original query
- `reflection_aspects` (optional): Array of aspects - "accuracy", "completeness", "clarity", "relevance", "bias"
- `suggest_improvements` (optional): Generate suggestions (default: true)

**Example:**
```json
{
  "response": "The system uses JWT tokens for authentication...",
  "original_query": "Explain the authentication mechanism",
  "reflection_aspects": ["accuracy", "completeness", "clarity"],
  "suggest_improvements": true
}
```

### decompose_task

Break down a complex task into smaller, manageable subtasks.

**Parameters:**
- `task` (required): The complex task to decompose
- `decomposition_strategy` (optional): Strategy - "sequential", "parallel", "hierarchical", or "dependency_based" (default: "hierarchical")
- `max_depth` (optional): Maximum decomposition depth (default: 3, max: 5)
- `include_dependencies` (optional): Identify dependencies (default: true)
- `estimate_complexity` (optional): Estimate complexity (default: true)

**Example:**
```json
{
  "task": "Implement a complete user authentication system with OAuth2",
  "decomposition_strategy": "dependency_based",
  "max_depth": 4,
  "include_dependencies": true,
  "estimate_complexity": true
}
```

### route_to_model

Route a query to the most appropriate model based on task characteristics.

**Parameters:**
- `query` (required): The query to route
- `task_type` (optional): Type - "simple", "complex", "creative", "analytical", or "code"
- `constraints` (optional): Routing constraints
  - `max_cost`: Maximum acceptable cost
  - `max_latency`: Maximum latency in seconds
  - `required_capabilities`: Array of required capabilities
- `available_models` (optional): Array of available models

**Example:**
```json
{
  "query": "Generate a complex SQL query with multiple joins",
  "task_type": "code",
  "constraints": {
    "max_cost": 0.05,
    "max_latency": 5,
    "required_capabilities": ["code_generation", "sql"]
  },
  "available_models": ["gpt-4", "claude-3", "codex"]
}
```

### index_repository

Index a large repository for semantic search and code intelligence.

**Parameters:**
- `repo_url` (required): Git repository URL (https or ssh)
- `branch` (optional): Branch to index (default: "main")
- `incremental` (optional): Use incremental indexing (default: true)
- `options` (optional): Indexing options
  - `languages`: Array of languages to index
  - `exclude_patterns`: Glob patterns to exclude
  - `max_file_size_mb`: Maximum file size in MB (default: 10)

**Example:**
```json
{
  "repo_url": "https://github.com/user/large-repo.git",
  "branch": "main",
  "incremental": true,
  "options": {
    "languages": ["python", "javascript", "typescript"],
    "exclude_patterns": ["*.test.js", "node_modules/**", "*.min.js"],
    "max_file_size_mb": 10
  }
}
```

### semantic_code_search

Search code using natural language queries with hybrid ranking.

**Parameters:**
- `query` (required): Natural language search query
- `repo_id` (required): Repository identifier from index_repository
- `filters` (optional): Search filters
  - `language`: Filter by programming language
  - `path_pattern`: Filter by file path pattern (glob)
  - `min_score`: Minimum relevance score 0-1 (default: 0.7)
- `limit` (optional): Maximum results (default: 20, max: 100)
- `include_context` (optional): Include surrounding code context (default: true)

**Example:**
```json
{
  "query": "authentication middleware that validates JWT tokens",
  "repo_id": "uuid-from-indexing",
  "filters": {
    "language": "python",
    "path_pattern": "src/**",
    "min_score": 0.8
  },
  "limit": 10,
  "include_context": true
}
```

### analyze_dependencies

Analyze file dependencies and calculate impact radius.

**Parameters:**
- `file_path` (required): File path to analyze (relative to repository root)
- `repo_id` (required): Repository identifier
- `depth` (optional): Dependency traversal depth (default: 3, max: 10)
- `direction` (optional): "incoming", "outgoing", or "both" (default: "both")
- `include_transitive` (optional): Include transitive dependencies (default: true)

**Example:**
```json
{
  "file_path": "src/auth/middleware.py",
  "repo_id": "uuid-from-indexing",
  "depth": 5,
  "direction": "both",
  "include_transitive": true
}
```

### get_index_status

Get the current status of a repository indexing job.

**Parameters:**
- `repo_id` (required): Repository identifier
- `job_id` (optional): Optional job ID for specific indexing job

**Example:**
```json
{
  "repo_id": "uuid-from-indexing",
  "job_id": "celery-task-id"
}
```

### find_symbol_references

Find all references to a code symbol across the repository.

**Parameters:**
- `symbol` (required): Symbol name to find references for
- `repo_id` (required): Repository identifier
- `symbol_type` (optional): "function", "class", "variable", "method", or "any" (default: "any")
- `include_definitions` (optional): Include symbol definitions (default: true)

**Example:**
```json
{
  "symbol": "authenticate_user",
  "repo_id": "uuid-from-indexing",
  "symbol_type": "function",
  "include_definitions": true
}
```

### analyze_code_complexity

Analyze code complexity metrics for files or directories.

**Parameters:**
- `path` (required): File or directory path to analyze
- `repo_id` (required): Repository identifier
- `metrics` (optional): Array of metrics - "cyclomatic", "cognitive", "maintainability", "halstead", "loc" (default: ["cyclomatic", "maintainability"])
- `recursive` (optional): Analyze directory recursively (default: true)

**Example:**
```json
{
  "path": "src/",
  "repo_id": "uuid-from-indexing",
  "metrics": ["cyclomatic", "cognitive", "maintainability"],
  "recursive": true
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "sytra-intelligence": {
      "command": "node",
      "args": ["/path/to/mcp-servers/intelligence-amplification/dist/index.js"],
      "env": {
        "INTELLIGENCE_API_URL": "http://localhost:8004"
      }
    }
  }
}
```

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Start
npm start
```

## API Endpoints

The server communicates with these API endpoints:

### Intelligence Amplification Service (Port 8004)
- `POST /api/v1/intelligence/optimize-prompt` - Optimize prompt
- `POST /api/v1/intelligence/rag-query` - RAG query
- `POST /api/v1/intelligence/chain-of-thought` - Chain-of-thought reasoning
- `POST /api/v1/intelligence/self-reflect` - Self-reflection
- `POST /api/v1/intelligence/decompose-task` - Task decomposition
- `POST /api/v1/intelligence/route-to-model` - Model routing

### Code Intelligence Service (Port 8010)
- `POST /api/v1/repositories/index` - Index repository
- `POST /api/v1/search/semantic` - Semantic code search
- `POST /api/v1/dependencies/analyze` - Analyze dependencies
- `POST /api/v1/repositories/status` - Get index status
- `POST /api/v1/symbols/references` - Find symbol references
- `POST /api/v1/analysis/complexity` - Analyze code complexity

## License

MIT