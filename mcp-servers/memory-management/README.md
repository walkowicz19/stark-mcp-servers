# Sytra Memory Management MCP Server

MCP server for the Sytra Memory Management service, providing intelligent memory storage, retrieval, and context management capabilities with support for large-scale codebases, database schemas, and legacy systems.

## Features

- **Memory Storage**: Store information with different memory types (short-term, long-term, episodic)
- **Semantic Retrieval**: Retrieve relevant memories using semantic search
- **Context Compression**: Compress context while preserving key information
- **Session Management**: Track and retrieve session history
- **Advanced Search**: Filter and search memories with multiple criteria
- **Large-Scale Codebase Context**: Handle 50GB+ repositories with 700+ files
- **Database Schema Context**: Store and retrieve complex database schemas with relationships
- **Legacy System Context**: Manage COBOL, Fortran, and other legacy system analysis
- **Intelligent Prioritization**: Rank context by relevance, recency, and importance
- **Context Merging**: Combine multiple context sources with conflict resolution

## Installation

```bash
cd mcp-servers/memory-management
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `MEMORY_API_URL`: URL of the Memory Management service (default: `http://localhost:8003`)

## Available Tools

### Core Memory Management Tools

#### store_memory

Store information in memory for later retrieval.

**Parameters:**
- `content` (required): The content to store in memory
- `memory_type` (optional): Type of memory - "short_term", "long_term", or "episodic" (default: "short_term")
- `metadata` (optional): Additional metadata
  - `tags`: Array of tags for categorization
  - `importance`: Importance score (0-1)
  - `context`: Contextual information
- `session_id` (optional): Session identifier for grouping

**Example:**
```json
{
  "content": "User prefers dark mode and compact layouts",
  "memory_type": "long_term",
  "metadata": {
    "tags": ["preferences", "ui"],
    "importance": 0.8
  },
  "session_id": "session-123"
}
```

#### retrieve_memory

Retrieve relevant memories based on a query.

**Parameters:**
- `query` (required): The query to search for
- `memory_type` (optional): Type of memory to search - "short_term", "long_term", "episodic", or "all" (default: "all")
- `limit` (optional): Maximum number of memories (default: 5, max: 50)
- `min_relevance` (optional): Minimum relevance score 0-1 (default: 0.5)
- `session_id` (optional): Filter by session

**Example:**
```json
{
  "query": "user interface preferences",
  "memory_type": "long_term",
  "limit": 10,
  "min_relevance": 0.7
}
```

#### search_memory

Perform semantic search across all stored memories.

**Parameters:**
- `query` (required): The search query
- `filters` (optional): Search filters
  - `memory_type`: Array of memory types to include
  - `tags`: Array of tags to filter by
  - `date_range`: Object with `start` and `end` dates
  - `min_importance`: Minimum importance score
- `limit` (optional): Maximum results (default: 10, max: 100)

**Example:**
```json
{
  "query": "authentication implementation",
  "filters": {
    "memory_type": ["long_term"],
    "tags": ["security", "backend"],
    "min_importance": 0.6
  },
  "limit": 20
}
```

#### compress_context

Compress context for efficiency while preserving key information.

**Parameters:**
- `context` (required): The context to compress
- `target_ratio` (optional): Target compression ratio 0-1 (default: 0.5)
- `preserve_entities` (optional): Preserve named entities (default: true)
- `preserve_numbers` (optional): Preserve numerical data (default: true)
- `strategy` (optional): Compression strategy - "extractive", "abstractive", or "hybrid" (default: "hybrid")

**Example:**
```json
{
  "context": "Long context text here...",
  "target_ratio": 0.3,
  "preserve_entities": true,
  "strategy": "hybrid"
}
```

#### get_session_history

Get the history of a session including all stored memories.

**Parameters:**
- `session_id` (required): The session identifier
- `include_metadata` (optional): Include metadata (default: true)
- `limit` (optional): Maximum history items (default: 50, max: 500)
- `order` (optional): Sort order - "asc" or "desc" (default: "desc")

**Example:**
```json
{
  "session_id": "session-123",
  "include_metadata": true,
  "limit": 100,
  "order": "desc"
}
```

### Large-Scale Context Management Tools

#### store_large_codebase_context

Store context from large repository analysis (50GB+, 700+ files). Automatically chunks, deduplicates, and compresses codebase data.

**Parameters:**
- `repository_id` (required): Unique identifier for the repository
- `analysis_results` (required): Repository analysis results
  - `files`: Array of file analysis results with path, content, language, size, complexity, dependencies
  - `dependencies`: Dependency graph and relationships
  - `metrics`: Overall codebase metrics (total files, lines, languages, complexity)
  - `search_index`: Pre-built search index for fast retrieval
- `metadata` (optional): Repository metadata (name, version, description, tags, timestamp)
- `storage_options` (optional): Storage optimization options
  - `enable_compression`: Enable automatic compression (default: true)
  - `enable_deduplication`: Enable content deduplication (default: true)
  - `chunk_size`: Size of chunks for large files in lines (default: 10000)
  - `tier`: Storage tier - "hot", "warm", or "cold" (default: "warm")

**Example:**
```json
{
  "repository_id": "my-large-repo",
  "analysis_results": {
    "files": [
      {
        "path": "src/main.ts",
        "content": "// file content...",
        "language": "typescript",
        "size": 15000,
        "complexity": 8.5,
        "dependencies": ["lodash", "express"]
      }
    ],
    "dependencies": {
      "graph": {},
      "external": ["lodash", "express"],
      "internal": ["./utils", "./config"]
    },
    "metrics": {
      "total_files": 750,
      "total_lines": 250000,
      "languages": {
        "typescript": 180000,
        "javascript": 70000
      },
      "complexity_score": 7.2
    }
  },
  "metadata": {
    "name": "My Large Repository",
    "version": "2.5.0",
    "tags": ["backend", "api", "microservices"]
  },
  "storage_options": {
    "enable_compression": true,
    "chunk_size": 5000,
    "tier": "warm"
  }
}
```

**Response:**
```json
{
  "context_id": "ctx_abc123",
  "storage_statistics": {
    "total_size_mb": 52.3,
    "compressed_size_mb": 12.8,
    "compression_ratio": 0.245,
    "files_stored": 750,
    "chunks_created": 45,
    "deduplication_savings_mb": 8.2
  }
}
```

#### retrieve_codebase_context

Retrieve relevant codebase context with smart filtering and semantic search.

**Parameters:**
- `repository_id` (required): Repository identifier
- `query` (required): Search query or description of needed context
- `filters` (optional): Filters to narrow down results
  - `file_patterns`: File path patterns (glob syntax)
  - `languages`: Programming languages to include
  - `complexity_range`: Filter by complexity score range (min, max)
  - `has_dependencies`: Only include files with dependencies
  - `modified_after`: Only include files modified after this date
- `max_results` (optional): Maximum number of results (default: 50, max: 500)
- `include_dependencies` (optional): Include dependency information (default: true)
- `include_related` (optional): Include related code snippets (default: true)
- `min_relevance` (optional): Minimum relevance score (default: 0.6)

**Example:**
```json
{
  "repository_id": "my-large-repo",
  "query": "authentication middleware implementation",
  "filters": {
    "file_patterns": ["src/**/*.ts", "lib/**/*.ts"],
    "languages": ["typescript"],
    "complexity_range": {
      "min": 5,
      "max": 15
    }
  },
  "max_results": 20,
  "include_dependencies": true,
  "min_relevance": 0.7
}
```

**Response:**
```json
{
  "results": [
    {
      "file_path": "src/middleware/auth.ts",
      "relevance_score": 0.95,
      "content_snippet": "// authentication middleware...",
      "language": "typescript",
      "complexity": 8.2,
      "dependencies": ["jsonwebtoken", "bcrypt"],
      "related_files": ["src/models/user.ts", "src/utils/token.ts"]
    }
  ],
  "total_results": 15,
  "query_time_ms": 245
}
```

#### store_schema_context

Store database schema analysis context including tables, relationships, and query patterns.

**Parameters:**
- `schema_id` (required): Unique identifier for the schema
- `database_type` (required): Type of database - "postgresql", "mysql", "oracle", "sqlserver", "mongodb", "cassandra", or "other"
- `schema_data` (required): Complete schema information
  - `tables`: Array of table definitions with columns, indexes, row count, size
  - `relationships`: Foreign key relationships with cardinality
  - `query_patterns`: Common query patterns with frequency and performance
  - `erd_data`: Entity-Relationship Diagram data
- `metadata` (optional): Schema metadata (database name, version, description, tags, timestamp)

**Example:**
```json
{
  "schema_id": "production-db-schema",
  "database_type": "postgresql",
  "schema_data": {
    "tables": [
      {
        "name": "users",
        "schema": "public",
        "columns": [
          {
            "name": "id",
            "type": "integer",
            "nullable": false,
            "constraints": ["PRIMARY KEY"]
          },
          {
            "name": "email",
            "type": "varchar(255)",
            "nullable": false,
            "constraints": ["UNIQUE"]
          }
        ],
        "indexes": [
          {
            "name": "idx_users_email",
            "columns": ["email"],
            "unique": true,
            "type": "btree"
          }
        ],
        "row_count": 150000,
        "size_mb": 45.2
      }
    ],
    "relationships": [
      {
        "name": "fk_orders_user",
        "from_table": "orders",
        "from_column": "user_id",
        "to_table": "users",
        "to_column": "id",
        "relationship_type": "many-to-one"
      }
    ],
    "query_patterns": [
      {
        "pattern": "SELECT * FROM users WHERE email = ?",
        "frequency": 5000,
        "avg_execution_time_ms": 2.5,
        "tables_involved": ["users"]
      }
    ]
  },
  "metadata": {
    "database_name": "production",
    "version": "14.5",
    "tags": ["production", "main-db"]
  }
}
```

**Response:**
```json
{
  "context_id": "schema_xyz789",
  "storage_statistics": {
    "tables_stored": 45,
    "relationships_stored": 78,
    "query_patterns_stored": 120,
    "total_size_mb": 8.5
  }
}
```

#### retrieve_schema_context

Retrieve schema context with relationship awareness and optimization suggestions.

**Parameters:**
- `schema_id` (required): Schema identifier
- `query` (optional): Search query for tables, columns, or relationships
- `filters` (optional): Filters for schema retrieval
  - `table_names`: Specific tables to include
  - `schemas`: Database schemas to include
  - `has_relationships`: Only include tables with relationships
  - `min_row_count`: Minimum row count
  - `column_types`: Filter by column data types
- `include_relationships` (optional): Include relationship graph (default: true)
- `relationship_depth` (optional): Depth of relationship traversal (default: 2, max: 5)
- `include_query_patterns` (optional): Include common query patterns (default: true)
- `include_optimization_suggestions` (optional): Include optimization recommendations (default: true)
- `max_results` (optional): Maximum number of tables (default: 50, max: 200)

**Example:**
```json
{
  "schema_id": "production-db-schema",
  "query": "user authentication tables",
  "filters": {
    "has_relationships": true,
    "min_row_count": 1000
  },
  "include_relationships": true,
  "relationship_depth": 3,
  "include_optimization_suggestions": true
}
```

**Response:**
```json
{
  "tables": [
    {
      "name": "users",
      "columns": [...],
      "indexes": [...],
      "relationships": [
        {
          "related_table": "orders",
          "relationship_type": "one-to-many",
          "depth": 1
        }
      ]
    }
  ],
  "query_patterns": [...],
  "optimization_suggestions": [
    {
      "type": "missing_index",
      "table": "users",
      "suggestion": "Consider adding index on (email, created_at)",
      "impact": "high"
    }
  ]
}
```

#### store_legacy_context

Store legacy system analysis context including COBOL programs, copybooks, JCL jobs, and business rules.

**Parameters:**
- `system_id` (required): Unique identifier for the legacy system
- `language` (required): Primary programming language - "cobol", "fortran", "pl1", "assembler", "rpg", "natural", or "other"
- `analysis_results` (required): Legacy system analysis results
  - `programs`: Array of program analysis with business logic and data flows
  - `copybooks`: Copybook definitions with data structures
  - `jcl_jobs`: JCL job definitions with steps and schedules
  - `business_rules`: Extracted business rules with implementations
- `metadata` (optional): System metadata (name, platform, description, tags, timestamp, migration notes)

**Example:**
```json
{
  "system_id": "mainframe-billing-system",
  "language": "cobol",
  "analysis_results": {
    "programs": [
      {
        "name": "BILLCALC",
        "type": "batch",
        "source_code": "IDENTIFICATION DIVISION...",
        "business_logic": [
          {
            "description": "Calculate monthly billing with tax",
            "location": "PROCEDURE DIVISION lines 150-250",
            "complexity": "high"
          }
        ],
        "data_flows": [
          {
            "source": "CUSTOMER-FILE",
            "destination": "BILLING-FILE",
            "transformation": "Calculate total with tax rate"
          }
        ],
        "dependencies": ["CUSTCOPY", "BILLCOPY"]
      }
    ],
    "copybooks": [
      {
        "name": "CUSTCOPY",
        "content": "01 CUSTOMER-RECORD...",
        "data_structures": [
          {
            "name": "CUSTOMER-RECORD",
            "fields": [...]
          }
        ],
        "used_by": ["BILLCALC", "CUSTRPT"]
      }
    ],
    "business_rules": [
      {
        "rule_id": "BR-001",
        "description": "Apply 8% tax to all billing amounts",
        "implementation": "COMPUTE TOTAL-WITH-TAX = TOTAL * 1.08",
        "programs": ["BILLCALC"],
        "priority": "high"
      }
    ]
  },
  "metadata": {
    "system_name": "Billing System",
    "platform": "IBM z/OS",
    "tags": ["billing", "financial", "batch"],
    "migration_notes": "Critical system, requires careful migration planning"
  }
}
```

**Response:**
```json
{
  "context_id": "legacy_def456",
  "storage_statistics": {
    "programs_stored": 45,
    "copybooks_stored": 28,
    "jcl_jobs_stored": 15,
    "business_rules_stored": 67,
    "total_size_mb": 125.3
  }
}
```

#### retrieve_legacy_context

Retrieve legacy system context with business logic focus and migration recommendations.

**Parameters:**
- `system_id` (required): Legacy system identifier
- `query` (optional): Search query for programs, business logic, or data flows
- `filters` (optional): Filters for legacy context retrieval
  - `program_names`: Specific programs to include
  - `program_types`: Types of programs (batch, online, etc.)
  - `has_business_rules`: Only include programs with business rules
  - `copybook_names`: Specific copybooks to include
  - `complexity`: Filter by complexity level - "low", "medium", or "high"
- `focus_areas` (optional): Areas to focus on - "business_logic", "data_flows", "dependencies", "copybooks", "jcl_jobs"
- `include_migration_notes` (optional): Include migration recommendations (default: true)
- `include_data_lineage` (optional): Include data lineage information (default: true)
- `max_results` (optional): Maximum number of programs (default: 50, max: 200)

**Example:**
```json
{
  "system_id": "mainframe-billing-system",
  "query": "tax calculation business logic",
  "filters": {
    "program_types": ["batch"],
    "has_business_rules": true,
    "complexity": "high"
  },
  "focus_areas": ["business_logic", "data_flows"],
  "include_migration_notes": true
}
```

**Response:**
```json
{
  "programs": [
    {
      "name": "BILLCALC",
      "business_logic": [...],
      "data_flows": [...],
      "migration_recommendations": [
        {
          "type": "modernization",
          "suggestion": "Convert to microservice with REST API",
          "complexity": "medium",
          "estimated_effort_days": 15
        }
      ]
    }
  ],
  "data_lineage": {
    "sources": ["CUSTOMER-FILE", "RATE-TABLE"],
    "transformations": [...],
    "destinations": ["BILLING-FILE", "AUDIT-LOG"]
  }
}
```

#### prioritize_context

Rank context items by relevance and importance using multiple criteria.

**Parameters:**
- `context_ids` (required): Array of context IDs to prioritize
- `prioritization_criteria` (optional): Criteria for prioritization
  - `relevance_weight`: Weight for relevance score (default: 0.4)
  - `recency_weight`: Weight for recency (default: 0.3)
  - `frequency_weight`: Weight for access frequency (default: 0.2)
  - `importance_weight`: Weight for importance score (default: 0.1)
  - `query`: Query for relevance calculation
  - `time_decay_factor`: How quickly recency score decays (default: 0.5)
- `return_scores` (optional): Include detailed scores (default: true)
- `limit` (optional): Maximum number of prioritized items (default: 100, max: 1000)

**Example:**
```json
{
  "context_ids": ["ctx_abc123", "ctx_def456", "ctx_ghi789"],
  "prioritization_criteria": {
    "relevance_weight": 0.5,
    "recency_weight": 0.3,
    "frequency_weight": 0.1,
    "importance_weight": 0.1,
    "query": "authentication implementation",
    "time_decay_factor": 0.6
  },
  "return_scores": true,
  "limit": 50
}
```

**Response:**
```json
{
  "prioritized_contexts": [
    {
      "context_id": "ctx_abc123",
      "priority_score": 0.92,
      "scores": {
        "relevance": 0.95,
        "recency": 0.88,
        "frequency": 0.75,
        "importance": 0.90
      },
      "rank": 1
    }
  ]
}
```

#### merge_contexts

Merge multiple context sources intelligently with conflict resolution and deduplication.

**Parameters:**
- `context_ids` (required): Array of context IDs to merge (minimum 2)
- `merge_strategy` (required): Strategy for merging - "union", "intersection", "weighted", or "priority_based"
- `merge_options` (optional): Options for merge operation
  - `enable_deduplication`: Remove duplicate content (default: true)
  - `preserve_relationships`: Maintain relationship integrity (default: true)
  - `conflict_resolution`: How to resolve conflicts - "keep_first", "keep_last", "keep_newest", or "keep_highest_priority" (default: "keep_newest")
  - `weights`: Weights for each context (for weighted strategy)
  - `priority_order`: Priority order of context IDs (for priority_based strategy)
- `target_context_id` (optional): ID for the merged context (auto-generated if not provided)
- `metadata` (optional): Metadata for merged context (name, description, tags)

**Example:**
```json
{
  "context_ids": ["ctx_repo1", "ctx_repo2", "ctx_repo3"],
  "merge_strategy": "weighted",
  "merge_options": {
    "enable_deduplication": true,
    "preserve_relationships": true,
    "conflict_resolution": "keep_newest",
    "weights": [0.5, 0.3, 0.2]
  },
  "metadata": {
    "name": "Merged Repository Context",
    "description": "Combined context from multiple repositories",
    "tags": ["merged", "multi-repo"]
  }
}
```

**Response:**
```json
{
  "merged_context_id": "ctx_merged_abc",
  "merge_statistics": {
    "source_contexts": 3,
    "total_items_before": 1500,
    "total_items_after": 1200,
    "duplicates_removed": 300,
    "conflicts_resolved": 45,
    "relationships_preserved": 234,
    "merge_time_ms": 1250
  }
}
```

#### get_context_statistics

Get detailed statistics and metrics about stored context.

**Parameters:**
- `context_ids` (optional): Specific context IDs to analyze
- `filters` (optional): Filters for statistics query
  - `context_types`: Types of context - "codebase", "schema", "legacy", "memory", or "all"
  - `date_range`: Filter by creation date range (start, end)
  - `tags`: Filter by tags
  - `storage_tier`: Filter by storage tier - "hot", "warm", or "cold"
- `include_metrics` (optional): Metrics to include - "storage_size", "item_count", "access_patterns", "compression_ratios", "retrieval_performance", "memory_usage", "cache_hit_rate" (default: ["storage_size", "item_count", "access_patterns"])
- `time_granularity` (optional): Time granularity for time-series metrics - "hour", "day", "week", or "month" (default: "day")
- `include_recommendations` (optional): Include optimization recommendations (default: true)

**Example:**
```json
{
  "filters": {
    "context_types": ["codebase", "schema"],
    "date_range": {
      "start": "2026-01-01T00:00:00Z",
      "end": "2026-04-28T23:59:59Z"
    },
    "storage_tier": "warm"
  },
  "include_metrics": [
    "storage_size",
    "item_count",
    "access_patterns",
    "compression_ratios",
    "retrieval_performance"
  ],
  "time_granularity": "week",
  "include_recommendations": true
}
```

**Response:**
```json
{
  "statistics": {
    "storage_size": {
      "total_mb": 5234.5,
      "by_type": {
        "codebase": 3500.2,
        "schema": 1734.3
      },
      "by_tier": {
        "hot": 500.0,
        "warm": 4234.5,
        "cold": 500.0
      }
    },
    "item_count": {
      "total": 15234,
      "by_type": {
        "codebase": 10500,
        "schema": 4734
      }
    },
    "access_patterns": {
      "total_accesses": 45678,
      "unique_contexts_accessed": 1234,
      "avg_accesses_per_context": 37,
      "most_accessed": [
        {
          "context_id": "ctx_abc123",
          "access_count": 567
        }
      ]
    },
    "compression_ratios": {
      "average": 0.35,
      "best": 0.15,
      "worst": 0.65
    },
    "retrieval_performance": {
      "avg_query_time_ms": 245,
      "p50_ms": 180,
      "p95_ms": 450,
      "p99_ms": 780
    }
  },
  "recommendations": [
    {
      "type": "storage_optimization",
      "suggestion": "Move 15 rarely accessed contexts to cold storage",
      "potential_savings_mb": 234.5
    },
    {
      "type": "performance",
      "suggestion": "Increase cache size for frequently accessed contexts",
      "expected_improvement": "20% faster retrieval"
    }
  ]
}
```

## Use Cases

### Large-Scale Codebase Analysis

Store and retrieve context from massive repositories:

```json
// Store 50GB+ repository
{
  "tool": "store_large_codebase_context",
  "repository_id": "enterprise-monorepo",
  "analysis_results": { /* 700+ files */ }
}

// Retrieve relevant code
{
  "tool": "retrieve_codebase_context",
  "repository_id": "enterprise-monorepo",
  "query": "payment processing logic",
  "filters": {
    "languages": ["java", "kotlin"],
    "complexity_range": { "min": 5, "max": 20 }
  }
}
```

### Database Schema Management

Store and query complex database schemas:

```json
// Store production schema
{
  "tool": "store_schema_context",
  "schema_id": "prod-db",
  "database_type": "postgresql",
  "schema_data": { /* tables, relationships */ }
}

// Retrieve with relationships
{
  "tool": "retrieve_schema_context",
  "schema_id": "prod-db",
  "query": "user authentication tables",
  "include_relationships": true,
  "relationship_depth": 3
}
```

### Legacy System Modernization

Manage legacy system analysis and migration:

```json
// Store COBOL system analysis
{
  "tool": "store_legacy_context",
  "system_id": "mainframe-billing",
  "language": "cobol",
  "analysis_results": { /* programs, business rules */ }
}

// Retrieve for migration
{
  "tool": "retrieve_legacy_context",
  "system_id": "mainframe-billing",
  "focus_areas": ["business_logic", "data_flows"],
  "include_migration_notes": true
}
```

### Context Optimization

Prioritize and merge contexts for efficient retrieval:

```json
// Prioritize contexts
{
  "tool": "prioritize_context",
  "context_ids": ["ctx1", "ctx2", "ctx3"],
  "prioritization_criteria": {
    "query": "authentication",
    "relevance_weight": 0.6
  }
}

// Merge related contexts
{
  "tool": "merge_contexts",
  "context_ids": ["ctx_repo1", "ctx_repo2"],
  "merge_strategy": "weighted",
  "merge_options": {
    "weights": [0.6, 0.4]
  }
}
```

## Best Practices

### Context Storage

1. **Use appropriate storage tiers**: Hot for frequently accessed, warm for regular use, cold for archival
2. **Enable compression**: Reduces storage costs by 60-80% with minimal performance impact
3. **Chunk large files**: Use 5000-10000 line chunks for optimal performance
4. **Add meaningful metadata**: Tags and descriptions improve searchability

### Context Retrieval

1. **Use specific queries**: More specific queries return more relevant results
2. **Apply filters**: Narrow down results with file patterns, languages, complexity ranges
3. **Set appropriate relevance thresholds**: Higher thresholds (0.7+) for precise results
4. **Include relationships**: For schema and legacy contexts, relationships provide valuable context

### Performance Optimization

1. **Prioritize contexts**: Rank by relevance before retrieval to reduce query time
2. **Merge related contexts**: Combine similar contexts to reduce redundancy
3. **Monitor statistics**: Use `get_context_statistics` to identify optimization opportunities
4. **Cache frequently accessed contexts**: Improves retrieval performance by 50-70%

### Large-Scale Operations

1. **Batch operations**: Store multiple contexts in parallel when possible
2. **Use incremental updates**: Update only changed portions of large contexts
3. **Implement cleanup policies**: Remove old or unused contexts regularly
4. **Monitor memory usage**: Keep active context under 2GB for optimal performance

## Performance Targets

- **Store 50GB context**: <5 minutes
- **Retrieve relevant context**: <500ms (p95)
- **Compress large context**: <2 minutes for 10GB
- **Merge multiple contexts**: <1 minute for 1GB each
- **Memory usage**: <2GB for active operations
- **Query performance**: <200ms (p50), <500ms (p95)

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "sytra-memory": {
      "command": "node",
      "args": ["/path/to/mcp-servers/memory-management/dist/index.js"],
      "env": {
        "MEMORY_API_URL": "http://localhost:8003"
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

The server communicates with these Memory Management API endpoints:

### Core Memory Endpoints
- `POST /api/v1/memory/store` - Store memory
- `POST /api/v1/memory/retrieve` - Retrieve memories
- `POST /api/v1/memory/search` - Search memories
- `POST /api/v1/memory/compress` - Compress context
- `POST /api/v1/memory/session/history` - Get session history

### Large-Scale Context Endpoints
- `POST /api/v1/context/codebase/store` - Store codebase context
- `POST /api/v1/context/codebase/retrieve` - Retrieve codebase context
- `POST /api/v1/context/schema/store` - Store schema context
- `POST /api/v1/context/schema/retrieve` - Retrieve schema context
- `POST /api/v1/context/legacy/store` - Store legacy context
- `POST /api/v1/context/legacy/retrieve` - Retrieve legacy context
- `POST /api/v1/context/prioritize` - Prioritize contexts
- `POST /api/v1/context/merge` - Merge contexts
- `POST /api/v1/context/statistics` - Get context statistics

## License

MIT