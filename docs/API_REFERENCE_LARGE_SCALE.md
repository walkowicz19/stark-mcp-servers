# API Reference: Large-Scale Capabilities

**Complete reference for all 41 new/enhanced tools**

Version: 1.0  
Last Updated: 2026-04-28

---

## Overview

This document provides comprehensive API documentation for all large-scale capability tools across the Stark MCP ecosystem:

- **Intelligence Amplification**: 6 code intelligence tools
- **Schema Intelligence**: 12 database analysis tools
- **Legacy Support**: 10 advanced legacy tools
- **Memory Management**: 9 large-scale context tools
- **Orchestrator**: 4 unified high-level tools

**Total**: 41 new/enhanced tools for enterprise-scale operations

---

## Intelligence Amplification (6 Code Intelligence Tools)

### 1. index_repository

Index large repositories (50GB+) with incremental updates.

**Endpoint**: `POST /api/v1/repositories/index`

**Parameters**:
- `repo_url` (string, required): Git repository URL (https or ssh)
- `branch` (string, optional): Branch to index (default: "main")
- `incremental` (boolean, optional): Use incremental indexing (default: true)
- `options` (object, optional):
  - `languages` (array): Languages to index
  - `exclude_patterns` (array): Glob patterns to exclude
  - `max_file_size_mb` (number): Max file size in MB (default: 10)

**Response**:
```json
{
  "repo_id": "uuid",
  "status": "indexing|completed|failed",
  "estimated_completion": "12 minutes",
  "files_to_index": 850
}
```

**Performance**: <15 minutes for 50GB, <5 minutes for 700 files incremental

---

### 2. semantic_code_search

Search code using natural language with hybrid ranking.

**Endpoint**: `POST /api/v1/search/semantic`

**Parameters**:
- `query` (string, required): Natural language search query
- `repo_id` (string, required): Repository identifier
- `filters` (object, optional):
  - `language` (string): Programming language filter
  - `path_pattern` (string): File path pattern (glob)
  - `min_score` (number): Minimum relevance 0-1 (default: 0.7)
- `limit` (number, optional): Max results (default: 20, max: 100)
- `include_context` (boolean, optional): Include surrounding code (default: true)

**Response**:
```json
{
  "results": [
    {
      "file_path": "src/auth.py",
      "relevance_score": 0.95,
      "content_snippet": "...",
      "language": "python",
      "complexity": 6.5,
      "line_range": [15, 45]
    }
  ],
  "total_results": 15,
  "query_time_ms": 85
}
```

**Performance**: <100ms (p95)

---

### 3. analyze_dependencies

Analyze file dependencies and calculate impact radius.

**Endpoint**: `POST /api/v1/dependencies/analyze`

**Parameters**:
- `file_path` (string, required): File path relative to repository root
- `repo_id` (string, required): Repository identifier
- `depth` (number, optional): Traversal depth (default: 3, max: 10)
- `direction` (string, optional): "incoming", "outgoing", "both" (default: "both")
- `include_transitive` (boolean, optional): Include transitive deps (default: true)

**Response**:
```json
{
  "file": "src/payments/processor.py",
  "incoming_dependencies": ["src/api/checkout.py", "..."],
  "outgoing_dependencies": ["src/payments/gateway.py", "..."],
  "transitive_dependencies": 23,
  "impact_radius": {
    "direct_files": 9,
    "indirect_files": 23,
    "total_affected_files": 32,
    "risk_level": "high"
  }
}
```

---

### 4. get_index_status

Get repository indexing status.

**Endpoint**: `POST /api/v1/repositories/status`

**Parameters**:
- `repo_id` (string, required): Repository identifier
- `job_id` (string, optional): Specific job ID

**Response**:
```json
{
  "status": "completed",
  "files_indexed": 850,
  "total_lines": 450000,
  "languages": {"python": 180000, "javascript": 120000},
  "indexing_time_seconds": 720
}
```

---

### 5. find_symbol_references

Find all references to code symbols.

**Endpoint**: `POST /api/v1/symbols/references`

**Parameters**:
- `symbol` (string, required): Symbol name
- `repo_id` (string, required): Repository identifier
- `symbol_type` (string, optional): "function", "class", "variable", "method", "any" (default: "any")
- `include_definitions` (boolean, optional): Include definitions (default: true)

**Response**:
```json
{
  "symbol": "authenticate_user",
  "references": [
    {
      "file": "src/api/auth.py",
      "line": 45,
      "type": "definition",
      "context": "..."
    },
    {
      "file": "src/api/login.py",
      "line": 23,
      "type": "reference",
      "context": "..."
    }
  ],
  "total_references": 15
}
```

---

### 6. analyze_code_complexity

Analyze code complexity metrics.

**Endpoint**: `POST /api/v1/analysis/complexity`

**Parameters**:
- `path` (string, required): File or directory path
- `repo_id` (string, required): Repository identifier
- `metrics` (array, optional): ["cyclomatic", "cognitive", "maintainability", "halstead", "loc"]
- `recursive` (boolean, optional): Analyze recursively (default: true)

**Response**:
```json
{
  "summary": {
    "total_files": 850,
    "average_cyclomatic": 7.2,
    "average_cognitive": 12.5,
    "average_maintainability": 68.3
  },
  "hotspots": [
    {
      "file": "src/legacy/processor.py",
      "cyclomatic_complexity": 45,
      "cognitive_complexity": 78,
      "maintainability_index": 22,
      "risk_level": "critical"
    }
  ]
}
```

---

## Schema Intelligence (12 Database Tools)

### 1. extract_schema

Extract complete database schema.

**Endpoint**: `POST /api/v1/schema/extract`

**Parameters**:
- `connection` (object, required):
  - `type` (string): "postgresql", "mysql", "oracle", "mongodb", "cassandra", "dynamodb", "neo4j"
  - `host` (string): Database host
  - `port` (number): Database port
  - `database` (string): Database name
  - `username` (string): Username
  - `password` (string): Password
  - `ssl` (boolean): Use SSL (default: false)
- `options` (object, optional):
  - `include_views` (boolean): Include views (default: true)
  - `include_procedures` (boolean): Include procedures (default: true)
  - `include_triggers` (boolean): Include triggers (default: true)
  - `include_indexes` (boolean): Include indexes (default: true)
  - `batch_size` (number): Batch size (default: 100)

**Response**:
```json
{
  "schema_id": "uuid",
  "extraction_time_seconds": 180,
  "statistics": {
    "total_tables": 180,
    "total_columns": 2340,
    "total_indexes": 456,
    "database_size_gb": 450
  }
}
```

---

### 2. detect_relationships

Detect relationships between tables.

**Endpoint**: `POST /api/v1/schema/relationships/detect`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `detection_methods` (array, optional): ["foreign_keys", "naming_conventions", "data_overlap", "junction_tables"]
- `naming_patterns` (object, optional):
  - `foreign_key_suffix` (string): FK suffix (default: "_id")
- `min_confidence` (number, optional): Min confidence 0-1 (default: 0.7)
- `analyze_data_sample` (boolean, optional): Analyze data (default: true)
- `sample_size` (number, optional): Sample size (default: 1000)

**Response**:
```json
{
  "relationships_found": 234,
  "explicit_foreign_keys": 156,
  "inferred_relationships": 78,
  "relationships": [
    {
      "from_table": "orders",
      "from_column": "user_id",
      "to_table": "users",
      "to_column": "id",
      "relationship_type": "many-to-one",
      "detection_method": "foreign_key",
      "confidence": 1.0
    }
  ]
}
```

---

### 3. analyze_query_patterns

Analyze query logs for patterns and bottlenecks.

**Endpoint**: `POST /api/v1/analysis/query-patterns`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `query_log` (object, required):
  - `source_type` (string): "file", "database", "url"
  - `source_path` (string): Path to query log
  - `format` (string): "postgresql", "mysql", "oracle", "mongodb", "generic"
  - `time_range` (object): {start, end} in ISO 8601
- `analysis_options` (object, optional):
  - `detect_n_plus_one` (boolean): Detect N+1 (default: true)
  - `identify_hot_tables` (boolean): Find hot tables (default: true)
  - `analyze_slow_queries` (boolean): Analyze slow queries (default: true)
  - `slow_query_threshold_ms` (number): Threshold (default: 1000)

**Response**:
```json
{
  "query_analysis_id": "uuid",
  "total_queries_analyzed": 45000000,
  "n_plus_one_patterns": [
    {
      "pattern_id": "N+1-001",
      "severity": "critical",
      "description": "Loading user for each order",
      "occurrences": 1500000,
      "total_time_hours": 6250,
      "recommendation": "Use JOIN or eager loading"
    }
  ],
  "slow_queries": [
    {
      "query_id": "SLOW-001",
      "query": "SELECT * FROM orders WHERE status = 'pending'",
      "avg_execution_time_ms": 3500,
      "executions": 50000,
      "recommendation": "Add index on (status, created_at)"
    }
  ]
}
```

---

### 4. suggest_indexes

Suggest optimal indexes.

**Endpoint**: `POST /api/v1/analysis/suggest-indexes`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `query_analysis_id` (string, optional): Query analysis ID
- `options` (object, optional):
  - `consider_existing` (boolean): Consider existing (default: true)
  - `max_suggestions` (number): Max suggestions (default: 20)
  - `min_impact_score` (number): Min impact 0-1 (default: 0.5)
  - `index_types` (array): Index types to consider
  - `consider_composite` (boolean): Consider composite (default: true)
  - `max_columns_per_index` (number): Max columns (default: 3)

**Response**:
```json
{
  "index_suggestions": [
    {
      "suggestion_id": "IDX-001",
      "table": "orders",
      "columns": ["status", "created_at"],
      "index_type": "btree",
      "impact_score": 0.95,
      "estimated_improvement": "85% faster",
      "estimated_size_mb": 450,
      "sql": "CREATE INDEX idx_orders_status_created ON orders(status, created_at);"
    }
  ]
}
```

---

### 5. profile_data

Profile data characteristics and quality.

**Endpoint**: `POST /api/v1/analysis/profile-data`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `tables` (array, optional): Specific tables (empty for all)
- `profiling_options` (object, optional):
  - `calculate_cardinality` (boolean): Calculate cardinality (default: true)
  - `detect_patterns` (boolean): Detect patterns (default: true)
  - `analyze_distributions` (boolean): Analyze distributions (default: true)
  - `check_data_quality` (boolean): Check quality (default: true)
  - `sample_size` (number): Sample size (default: 10000)

**Response**:
```json
{
  "profiling_results": [
    {
      "table": "users",
      "row_count": 5000000,
      "data_quality_score": 85,
      "issues": [
        {
          "column": "email",
          "issue": "Duplicate emails",
          "count": 1250,
          "severity": "high"
        }
      ]
    }
  ]
}
```

---

### 6. generate_erd

Generate Entity-Relationship Diagram.

**Endpoint**: `POST /api/v1/generate/erd`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `options` (object, optional):
  - `format` (string): "mermaid", "plantuml", "graphviz" (default: "mermaid")
  - `include_columns` (boolean): Include columns (default: true)
  - `include_data_types` (boolean): Include types (default: true)
  - `include_constraints` (boolean): Include constraints (default: true)
  - `show_cardinality` (boolean): Show cardinality (default: true)
  - `max_columns_per_table` (number): Max columns (default: 10)

**Response**:
```json
{
  "erd_diagram": "erDiagram\n  USERS ||--o{ ORDERS : places\n  ...",
  "format": "mermaid",
  "tables_included": 45
}
```

---

### 7. generate_documentation

Generate comprehensive schema documentation.

**Endpoint**: `POST /api/v1/generate/documentation`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `options` (object, optional):
  - `include_erd` (boolean): Include ERD (default: true)
  - `include_statistics` (boolean): Include stats (default: true)
  - `include_relationships` (boolean): Include relationships (default: true)
  - `include_indexes` (boolean): Include indexes (default: true)
  - `include_examples` (boolean): Include examples (default: true)
  - `output_format` (string): "markdown", "html", "pdf" (default: "markdown")

**Response**:
```json
{
  "documentation_url": "/docs/schema-abc.md",
  "pages": 85,
  "format": "markdown"
}
```

---

### 8. generate_migration

Generate migration scripts.

**Endpoint**: `POST /api/v1/generate/migration`

**Parameters**:
- `source_schema_id` (string, required): Source schema
- `target_schema_id` (string, optional): Target schema
- `migration_type` (string, required): "create", "alter", "drop", "full_sync"
- `options` (object, optional):
  - `database_type` (string): Target database type
  - `include_data` (boolean): Include data migration (default: false)
  - `safe_mode` (boolean): Safe migrations (default: true)
  - `generate_rollback` (boolean): Generate rollback (default: true)

**Response**:
```json
{
  "migration_script": "ALTER TABLE users ADD COLUMN...",
  "rollback_script": "ALTER TABLE users DROP COLUMN...",
  "estimated_duration_minutes": 15
}
```

---

### 9. compare_schemas

Compare two schemas.

**Endpoint**: `POST /api/v1/schema/compare`

**Parameters**:
- `schema_id_1` (string, required): First schema
- `schema_id_2` (string, required): Second schema
- `comparison_options` (object, optional):
  - `compare_tables` (boolean): Compare tables (default: true)
  - `compare_columns` (boolean): Compare columns (default: true)
  - `compare_indexes` (boolean): Compare indexes (default: true)
  - `show_only_differences` (boolean): Only differences (default: true)

**Response**:
```json
{
  "differences": [
    {
      "type": "missing_table",
      "table": "new_feature",
      "in_schema": "schema_2"
    },
    {
      "type": "column_type_change",
      "table": "users",
      "column": "age",
      "old_type": "integer",
      "new_type": "bigint"
    }
  ]
}
```

---

### 10. get_schema_status

Get schema extraction status.

**Endpoint**: `POST /api/v1/schema/status`

**Parameters**:
- `job_id` (string, required): Job identifier
- `include_details` (boolean, optional): Include details (default: true)

---

### 11. list_schemas

List all extracted schemas.

**Endpoint**: `POST /api/v1/schema/list`

**Parameters**:
- `filters` (object, optional):
  - `database_type` (string): Filter by type
  - `min_table_count` (number): Min tables
  - `has_relationships` (boolean): Has relationships
- `sort_by` (string, optional): "name", "date", "table_count", "size"
- `limit` (number, optional): Max results (default: 50, max: 500)

---

### 12. delete_schema

Delete extracted schema.

**Endpoint**: `POST /api/v1/schema/delete`

**Parameters**:
- `schema_id` (string, required): Schema to delete
- `confirm` (boolean, required): Confirmation (must be true)

---

## Legacy Support (10 Advanced Tools)

### 1. analyze_legacy_codebase

Deep analysis of 700+ file legacy codebases.

**Endpoint**: `POST /api/v1/legacy/analyze/codebase`

**Parameters**:
- `repository_path` (string, required): Path to codebase
- `languages` (array, required): ["cobol", "fortran", "assembly", "jcl", "rpg", "pl1", "rexx", "natural", "mumps", "pascal"]
- `analysis_depth` (string, optional): "shallow", "medium", "deep", "comprehensive" (default: "medium")
- `include_metrics` (boolean, optional): Include metrics (default: true)
- `include_dependencies` (boolean, optional): Include dependencies (default: true)
- `include_hotspots` (boolean, optional): Include hotspots (default: true)
- `incremental` (boolean, optional): Incremental analysis (default: true)

**Response**:
```json
{
  "analysis_id": "uuid",
  "summary": {
    "total_files": 650,
    "total_lines": 850000,
    "programs": 450,
    "copybooks": 150,
    "jcl_jobs": 50,
    "complexity_score": 8.7
  },
  "hotspots": [
    {
      "program": "ACCPROC",
      "lines": 15000,
      "complexity": 95,
      "risk": "critical"
    }
  ]
}
```

---

### 2. extract_business_logic

Extract business rules and calculations.

**Endpoint**: `POST /api/v1/legacy/extract/business-logic`

**Parameters**:
- `file_paths` (array, required): Files to analyze
- `extraction_rules` (object, optional):
  - `extract_validations` (boolean): Extract validations (default: true)
  - `extract_calculations` (boolean): Extract calculations (default: true)
  - `extract_decisions` (boolean): Extract decisions (default: true)
  - `extract_constraints` (boolean): Extract constraints (default: true)
- `output_format` (string, optional): "json", "yaml", "markdown", "decision_table"
- `generate_decision_trees` (boolean, optional): Generate trees (default: false)

**Response**:
```json
{
  "business_rules": [
    {
      "rule_id": "BR-001",
      "program": "ACCPROC",
      "description": "Account balance validation",
      "logic": "IF ACCT-BALANCE < TRANS-AMOUNT THEN REJECT",
      "priority": "critical"
    }
  ],
  "validations": [...],
  "calculations": [...]
}
```

---

### 3. visualize_data_flow

Generate data flow diagrams.

**Endpoint**: `POST /api/v1/legacy/visualize/data-flow`

**Parameters**:
- `entry_point` (string, required): Entry point file
- `trace_depth` (number, optional): Max depth (default: 5, max: 20)
- `include_io_operations` (boolean, optional): Include I/O (default: true)
- `include_variable_flow` (boolean, optional): Track variables (default: true)
- `diagram_format` (string, optional): "mermaid", "plantuml", "graphviz", "d3"
- `focus_variables` (array, optional): Specific variables to focus on

**Response**:
```json
{
  "data_flow_diagram": "flowchart TD\n  A[MAINPROC] --> B[CUSTOMER-RECORD]\n  ...",
  "format": "mermaid",
  "variables_tracked": 45
}
```

---

### 4. detect_legacy_patterns

Identify anti-patterns and code smells.

**Endpoint**: `POST /api/v1/legacy/detect/patterns`

**Parameters**:
- `file_paths` (array, required): Files to analyze
- `pattern_types` (array, optional): ["goto_spaghetti", "global_state", "tight_coupling", "god_object", "magic_numbers", "dead_code", "duplicate_code", "long_methods", "deep_nesting", "cyclomatic_complexity"]
- `severity_threshold` (string, optional): "low", "medium", "high", "critical"
- `include_recommendations` (boolean, optional): Include recommendations (default: true)
- `generate_refactoring_plan` (boolean, optional): Generate plan (default: false)

**Response**:
```json
{
  "anti_patterns": [
    {
      "pattern": "goto_spaghetti",
      "severity": "critical",
      "file": "ACCPROC.cbl",
      "occurrences": 45,
      "recommendation": "Refactor to use PERFORM statements"
    }
  ],
  "refactoring_plan": {...}
}
```

---

### 5. analyze_mainframe_integration

Analyze JCL, CICS, and DB2 integration.

**Endpoint**: `POST /api/v1/legacy/analyze/mainframe`

**Parameters**:
- `jcl_files` (array, optional): JCL job files
- `cics_programs` (array, optional): CICS program files
- `db2_schemas` (array, optional): DB2 schema files
- `analyze_job_dependencies` (boolean, optional): Analyze jobs (default: true)
- `analyze_cics_transactions` (boolean, optional): Analyze CICS (default: true)
- `extract_db2_queries` (boolean, optional): Extract queries (default: true)
- `generate_integration_map` (boolean, optional): Generate map (default: true)

**Response**:
```json
{
  "jcl_analysis": {
    "total_jobs": 50,
    "job_dependencies": [...],
    "parallelization_opportunities": [...]
  },
  "cics_analysis": {
    "total_transactions": 85,
    "high_volume_transactions": [...]
  },
  "db2_analysis": {
    "tables_accessed": 45,
    "optimization_opportunities": [...]
  }
}
```

---

### 6. suggest_modernization_path

AI-powered migration recommendations.

**Endpoint**: `POST /api/v1/legacy/suggest/modernization`

**Parameters**:
- `analysis_results` (object, required): From analyze_legacy_codebase
- `target_platform_preferences` (object, optional):
  - `cloud_provider` (string): "aws", "azure", "gcp", "on_premise", "hybrid"
  - `target_languages` (array): Preferred languages
  - `architecture_style` (string): "microservices", "monolith", "serverless", "hybrid"
  - `database_preference` (string): Preferred database
- `constraints` (object, optional):
  - `budget` (string): "low", "medium", "high", "unlimited"
  - `timeline` (string): "aggressive", "moderate", "conservative"
  - `risk_tolerance` (string): "low", "medium", "high"
- `include_cost_benefit` (boolean, optional): Include cost-benefit (default: true)
- `include_phased_plan` (boolean, optional): Include phased plan (default: true)

**Response**:
```json
{
  "recommended_approach": "strangler_fig",
  "target_architecture": {...},
  "phased_plan": {
    "phase_1": {
      "duration_months": 6,
      "deliverables": [...],
      "estimated_cost": "$450,000"
    }
  },
  "cost_benefit_analysis": {
    "total_migration_cost": "$1,850,000",
    "annual_savings": "$450,000",
    "roi_months": 49
  }
}
```

---

### 7. extract_copybooks

Parse and document COBOL copybooks.

**Endpoint**: `POST /api/v1/legacy/extract/copybooks`

**Parameters**:
- `copybook_files` (array, required): Copybook files
- `analyze_usage` (boolean, optional): Analyze usage (default: true)
- `extract_nested_structures` (boolean, optional): Parse nested (default: true)
- `output_format` (string, optional): "json", "yaml", "markdown", "xml", "json_schema"
- `map_to_modern_types` (boolean, optional): Map types (default: false)

---

### 8. analyze_batch_jobs

Analyze batch job dependencies.

**Endpoint**: `POST /api/v1/legacy/analyze/batch-jobs`

**Parameters**:
- `jcl_job_streams` (array, required): JCL job files
- `include_dependencies` (boolean, optional): Analyze dependencies (default: true)
- `identify_critical_path` (boolean, optional): Identify critical path (default: true)
- `suggest_parallelization` (boolean, optional): Suggest parallel (default: true)
- `output_format` (string, optional): "json", "yaml", "mermaid", "graphviz"

---

### 9. map_legacy_database

Map legacy database structures.

**Endpoint**: `POST /api/v1/legacy/map/database`

**Parameters**:
- `database_type` (string, required): "vsam", "ims", "db2", "idms", "adabas", "mixed"
- `connection_details` (object, optional): Connection information
- `analyze_relationships` (boolean, optional): Infer relationships (default: true)
- `generate_erd` (boolean, optional): Generate ERD (default: true)
- `output_format` (string, optional): "json", "yaml", "markdown", "mermaid", "dbml"

---

### 10. generate_migration_report

Generate comprehensive assessment report.

**Endpoint**: `POST /api/v1/legacy/generate/migration-report`

**Parameters**:
- `codebase_analysis` (object, optional): From analyze_legacy_codebase
- `business_logic_analysis` (object, optional): From extract_business_logic
- `pattern_analysis` (object, optional): From detect_legacy_patterns
- `modernization_recommendations` (object, optional): From suggest_modernization_path
- `report_format` (string, optional): "pdf", "html", "markdown", "docx"
- `include_executive_summary` (boolean, optional): Include summary (default: true)
- `detail_level` (string, optional): "executive", "technical", "comprehensive"

**Response**:
```json
{
  "report_id": "uuid",
  "report_url": "/reports/migration-report.pdf",
  "pages": 87,
  "sections": [...]
}
```

---

## Memory Management (9 Large-Scale Context Tools)

### 1. store_large_codebase_context

Store 50GB+ repository context.

**Endpoint**: `POST /api/v1/context/codebase/store`

**Parameters**:
- `repository_id` (string, required): Repository identifier
- `analysis_results` (object, required):
  - `files` (array): File analysis results
  - `dependencies` (object): Dependency graph
  - `metrics` (object): Codebase metrics
- `metadata` (object, optional): Repository metadata
- `storage_options` (object, optional):
  - `enable_compression` (boolean): Enable compression (default: true)
  - `enable_deduplication` (boolean): Enable dedup (default: true)
  - `chunk_size` (number): Chunk size in lines (default: 10000)
  - `tier` (string): "hot", "warm", "cold" (default: "warm")

**Response**:
```json
{
  "context_id": "uuid",
  "storage_statistics": {
    "total_size_mb": 52.3,
    "compressed_size_mb": 12.8,
    "compression_ratio": 0.245,
    "files_stored": 750
  }
}
```

---

### 2. retrieve_codebase_context

Retrieve relevant codebase context.

**Endpoint**: `POST /api/v1/context/codebase/retrieve`

**Parameters**:
- `repository_id` (string, required): Repository identifier
- `query` (string, required): Search query
- `filters` (object, optional):
  - `file_patterns` (array): File patterns (glob)
  - `languages` (array): Programming languages
  - `complexity_range` (object): {min, max}
- `max_results` (number, optional): Max results (default: 50, max: 500)
- `min_relevance` (number, optional): Min relevance (default: 0.6)

**Response**:
```json
{
  "results": [
    {
      "file_path": "src/middleware/auth.ts",
      "relevance_score": 0.95,
      "content_snippet": "...",
      "complexity": 8.2,
      "dependencies": [...]
    }
  ],
  "query_time_ms": 245
}
```

---

### 3. store_schema_context

Store database schema context.

**Endpoint**: `POST /api/v1/context/schema/store`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `database_type` (string, required): Database type
- `schema_data` (object, required):
  - `tables` (array): Table definitions
  - `relationships` (array): Relationships
  - `query_patterns` (array): Query patterns
- `metadata` (object, optional): Schema metadata

**Response**:
```json
{
  "context_id": "uuid",
  "storage_statistics": {
    "tables_stored": 45,
    "relationships_stored": 78,
    "total_size_mb": 8.5
  }
}
```

---

### 4. retrieve_schema_context

Retrieve schema context.

**Endpoint**: `POST /api/v1/context/schema/retrieve`

**Parameters**:
- `schema_id` (string, required): Schema identifier
- `query` (string, optional): Search query
- `filters` (object, optional): Filters
- `include_relationships` (boolean, optional): Include relationships (default: true)
- `relationship_depth` (number, optional): Depth (default: 2, max: 5)
- `include_optimization_suggestions` (boolean, optional): Include suggestions (default: true)

---

### 5. store_legacy_context

Store legacy system context.

**Endpoint**: `POST /api/v1/context/legacy/store`

**Parameters**:
- `system_id` (string, required): System identifier
- `language` (string, required): Primary language
- `analysis_results` (object, required):
  - `programs` (array): Program analysis
  - `copybooks` (array): Copybook definitions
  - `business_rules` (array): Business rules
- `metadata` (object, optional): System metadata

---

### 6. retrieve_legacy_context

Retrieve legacy system context.

**Endpoint**: `POST /api/v1/context/legacy/retrieve`

**Parameters**:
- `system_id` (string, required): System identifier
- `query` (string, optional): Search query
- `filters` (object, optional): Filters
- `focus_areas` (array, optional): ["business_logic", "data_flows", "dependencies", "copybooks"]
- `include_migration_notes` (boolean, optional): Include notes (default: true)

---

### 7. prioritize_context

Rank contexts by relevance.

**Endpoint**: `POST /api/v1/context/prioritize`

**Parameters**:
- `context_ids` (array, required): Context IDs to prioritize
- `prioritization_criteria` (object, optional):
  - `relevance_weight` (number): Weight (default: 0.4)
  - `recency_weight` (number): Weight (default: 0.3)
  - `frequency_weight` (number): Weight (default: 0.2)
  - `importance_weight` (number): Weight (default: 0.1)
  - `query` (string): Query for relevance
- `return_scores` (boolean, optional): Include scores (default: true)

**Response**:
```json
{
  "prioritized_contexts": [
    {
      "context_id": "uuid",
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

---

### 8. merge_contexts

Merge multiple context sources.

**Endpoint**: `POST /api/v1/context/merge`

**Parameters**:
- `context_ids` (array, required): Context IDs to merge (min 2)
- `merge_strategy` (string, required): "union", "intersection", "weighted", "priority_based"
- `merge_options` (object, optional):
  - `enable_deduplication` (boolean): Remove duplicates (default: true)
  - `conflict_resolution` (string): "keep_first", "keep_last", "keep_newest", "keep_highest_priority"
  - `weights` (array): Weights for weighted strategy
- `metadata` (object, optional): Merged context metadata

**Response**:
```json
{
  "merged_context_id": "uuid",
  "merge_statistics": {
    "source_contexts": 3,
    "total_items_before": 1500,
    "total_items_after": 1200,
    "duplicates_removed": 300,
    "merge_time_ms": 1250
  }
}
```

---

### 9. get_context_statistics

Get context statistics and metrics.

**Endpoint**: `POST /api/v1/context/statistics`

**Parameters**:
- `context_ids` (array, optional): Specific contexts
- `filters` (object, optional):
  - `context_types` (array): ["codebase", "schema", "legacy", "memory", "all"]
  - `date_range` (object): {start, end}
  - `storage_tier` (string): "hot", "warm", "cold"
- `include_metrics` (array, optional): ["storage_size", "item_count", "access_patterns", "compression_ratios", "retrieval_performance"]
- `include_recommendations` (boolean, optional): Include recommendations (default: true)

**Response**:
```json
{
  "statistics": {
    "storage_size": {
      "total_mb": 5234.5,
      "by_type": {...}
    },
    "access_patterns": {...},
    "retrieval_performance": {
      "avg_query_time_ms": 245,
      "p95_ms": 450
    }
  },
  "recommendations": [...]
}
```

---

## Orchestrator (4 Unified High-Level Tools)

### 1. stark_analyze_large_codebase

Comprehensive 50GB+ repository analysis.

**Parameters**:
- `repo_url` (string): Repository URL
- `repo_id` (string): Existing repository ID
- `analysis_type` (string): "full", "incremental", "targeted"
- `include_indexing` (boolean): Index before analysis (default: true)
- `include_dependencies` (boolean): Analyze dependencies (default: true)
- `include_complexity` (boolean): Analyze complexity (default: true)
- `target_paths` (array): Specific paths for targeted analysis

---

### 2. stark_analyze_database_system

Complete database analysis and optimization.

**Parameters**:
- `connection` (object): Database connection details
- `schema_id` (string): Existing schema ID
- `analysis_scope` (string): "basic", "standard", "comprehensive"
- `include_extraction` (boolean): Extract schema (default: true)
- `include_relationships` (boolean): Detect relationships (default: true)
- `include_query_analysis` (boolean): Analyze queries (default: false)
- `query_log_path` (string): Path to query log
- `include_optimization` (boolean): Suggest optimizations (default: true)
- `generate_documentation` (boolean): Generate docs (default: true)

---

### 3. stark_modernize_legacy_system

Complete legacy system modernization assessment.

**Parameters**:
- `legacy_code_path` (string): Path to legacy code
- `source_language` (string, required): Legacy language
- `target_language` (string): Target modern language
- `assessment_depth` (string): "quick", "standard", "comprehensive"
- `include_business_logic` (boolean): Extract business logic (default: true)
- `include_data_structures` (boolean): Analyze data structures (default: true)
- `include_dependencies` (boolean): Map dependencies (default: true)
- `generate_migration_plan` (boolean): Generate plan (default: true)
- `risk_assessment` (boolean): Perform risk assessment (default: true)

---

### 4. stark_full_system_assessment

Complete system analysis using all capabilities.

**Parameters**:
- `system_type` (string, required): "web", "enterprise", "legacy", "microservices", "monolith"
- `codebase_path` (string): Path to codebase
- `repo_url` (string): Repository URL
- `database_connection` (object): Database connection
- `assessment_goals` (array): ["modernization", "optimization", "security", "scalability", "maintainability"]
- `include_codebase_analysis` (boolean): Analyze codebase (default: true)
- `include_database_analysis` (boolean): Analyze database (default: true)
- `include_security_audit` (boolean): Security audit (default: true)
- `include_performance_analysis` (boolean): Performance analysis (default: true)
- `include_legacy_assessment` (boolean): Legacy assessment (default: false)
- `generate_report` (boolean): Generate report (default: true)

---

## Error Codes

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 400 | Bad Request | Check parameter format and values |
| 401 | Unauthorized | Verify API credentials |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource ID exists |
| 408 | Timeout | Increase timeout or reduce scope |
| 429 | Rate Limit | Reduce request frequency |
| 500 | Internal Error | Contact support |
| 503 | Service Unavailable | Retry after delay |

### Tool-Specific Errors

- **IndexingError**: Repository indexing failed
- **SchemaExtractionError**: Database schema extraction failed
- **ParsingError**: Legacy code parsing failed
- **StorageError**: Context storage failed
- **RetrievalError**: Context retrieval failed

---

## Rate Limits

| Operation | Limit | Window |
|-----------|-------|--------|
| Repository Indexing | 10 | 1 hour |
| Schema Extraction | 20 | 1 hour |
| Semantic Search | 1000 | 1 minute |
| Context Storage | 100 | 1 hour |
| Context Retrieval | 1000 | 1 minute |

---

## Performance Considerations

### Optimization Tips

1. **Use Incremental Operations**: Enable incremental indexing and analysis
2. **Apply Filters**: Narrow down results with specific filters
3. **Batch Requests**: Combine related operations when possible
4. **Cache Results**: Store frequently accessed data locally
5. **Monitor Usage**: Track API usage to stay within limits

### Best Practices

1. **Repository Indexing**: Exclude test files and dependencies
2. **Schema Extraction**: Use read-only database users
3. **Legacy Analysis**: Start with shallow analysis, then go deeper
4. **Context Storage**: Enable compression and deduplication
5. **Context Retrieval**: Set appropriate relevance thresholds

---

## Additional Resources

- **[Complete Guide](LARGE_SCALE_CAPABILITIES.md)**: Comprehensive documentation
- **[Quick Start](QUICK_START_LARGE_SCALE.md)**: Get started in 5 minutes
- **[Use Case Examples](examples/LARGE_SCALE_EXAMPLES.md)**: Real-world scenarios
- **[Main README](../README.md)**: Project overview

---

**Complete API reference for enterprise-scale operations** 📚

*Last Updated: 2026-04-28*