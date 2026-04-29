# Sytra Schema Intelligence MCP Server

MCP server for the Sytra Schema Intelligence service, providing comprehensive database schema analysis, automatic relationship detection, query pattern analysis, and documentation generation for multiple database types.

## Features

### Multi-Database Support
- **PostgreSQL**: Full schema extraction with advanced features
- **MySQL**: Complete schema analysis and optimization
- **Oracle**: Enterprise database schema intelligence
- **MongoDB**: NoSQL schema analysis and patterns
- **Cassandra**: Wide-column store schema analysis
- **DynamoDB**: AWS NoSQL database intelligence
- **Neo4j**: Graph database schema and relationship analysis

### Schema Extraction
- Extract complete database schemas (tables, columns, types, constraints)
- Support for views, stored procedures, triggers, and indexes
- Batch processing for large schemas (1000+ tables)
- Incremental extraction for changed schemas only
- Connection pooling for optimal performance

### Relationship Detection
- **Explicit Relationships**: Foreign key constraints
- **Naming Conventions**: Infer relationships from column names (e.g., `user_id` → `users.id`)
- **Data Overlap Analysis**: Detect relationships through data correlation
- **Junction Tables**: Automatically identify many-to-many relationships
- **Confidence Scoring**: Calculate confidence scores for inferred relationships

### Query Pattern Analysis
- Parse and analyze query logs from all supported databases
- **N+1 Detection**: Identify N+1 query anti-patterns
- **Hot Tables**: Find frequently accessed tables and columns
- **Slow Queries**: Analyze performance bottlenecks
- **Query Patterns**: Detect common query patterns and inefficiencies

### Index Optimization
- Analyze existing indexes for redundancy
- Suggest optimal indexes based on query patterns
- Consider composite indexes for multi-column queries
- Calculate impact scores for index suggestions
- Support for various index types (B-tree, Hash, GIN, GiST, etc.)

### Data Profiling
- Calculate column cardinality and uniqueness
- Analyze data distributions and patterns
- Detect data quality issues (nulls, duplicates, outliers)
- Identify data types and patterns (emails, phones, dates)
- Statistical analysis (mean, median, standard deviation)

### Documentation Generation
- **ERD Diagrams**: Generate Mermaid, PlantUML, or Graphviz diagrams
- **Markdown Documentation**: Comprehensive schema documentation
- **HTML/PDF Export**: Professional documentation formats
- **Relationship Visualization**: Show cardinality and constraints
- **Query Examples**: Include SQL query examples

### Migration Support
- Generate migration scripts for schema changes
- Support for CREATE, ALTER, DROP operations
- Safe migrations with rollback scripts
- Data migration support with batching
- Cross-database migration (e.g., MySQL to PostgreSQL)

## Installation

```bash
cd mcp-servers/schema-intelligence
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `SCHEMA_API_URL`: URL of the Schema Intelligence service (default: `http://localhost:8011`)

## Available Tools

### extract_schema

Extract complete schema from a database including tables, columns, constraints, indexes, and more.

**Parameters:**
- `connection` (required): Database connection details
  - `type`: Database type - "postgresql", "mysql", "oracle", "mongodb", "cassandra", "dynamodb", "neo4j"
  - `host`: Database host
  - `port`: Database port
  - `database`: Database name
  - `username`: Database username
  - `password`: Database password
  - `ssl`: Use SSL connection (default: false)
  - `additional_params`: Additional database-specific parameters
- `options` (optional): Extraction options
  - `include_views`: Include database views (default: true)
  - `include_procedures`: Include stored procedures (default: true)
  - `include_triggers`: Include triggers (default: true)
  - `include_indexes`: Include index information (default: true)
  - `batch_size`: Batch size for large schemas (default: 100)
  - `timeout_seconds`: Extraction timeout (default: 300)

**Example:**
```json
{
  "connection": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "myapp",
    "username": "postgres",
    "password": "secret",
    "ssl": true
  },
  "options": {
    "include_views": true,
    "include_procedures": true,
    "batch_size": 100
  }
}
```

### detect_relationships

Automatically detect relationships between tables using multiple detection methods.

**Parameters:**
- `schema_id` (required): Schema identifier from extract_schema
- `detection_methods` (optional): Array of methods - "foreign_keys", "naming_conventions", "data_overlap", "junction_tables"
- `naming_patterns` (optional): Custom naming patterns
  - `foreign_key_suffix`: Foreign key column suffix (default: "_id")
  - `junction_table_pattern`: Junction table naming pattern (regex)
- `min_confidence` (optional): Minimum confidence score 0-1 (default: 0.7)
- `analyze_data_sample` (optional): Analyze data samples (default: true)
- `sample_size` (optional): Number of rows to sample (default: 1000)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "detection_methods": ["foreign_keys", "naming_conventions", "data_overlap"],
  "naming_patterns": {
    "foreign_key_suffix": "_id"
  },
  "min_confidence": 0.8,
  "analyze_data_sample": true,
  "sample_size": 5000
}
```

### analyze_query_patterns

Analyze query logs to detect patterns, bottlenecks, and optimization opportunities.

**Parameters:**
- `schema_id` (required): Schema identifier
- `query_log` (required): Query log source
  - `source_type`: "file", "database", or "url"
  - `source_path`: Path to query log
  - `format`: "postgresql", "mysql", "oracle", "mongodb", or "generic"
  - `time_range`: Optional time range with start and end (ISO 8601)
- `analysis_options` (optional): Analysis options
  - `detect_n_plus_one`: Detect N+1 patterns (default: true)
  - `identify_hot_tables`: Find hot tables (default: true)
  - `analyze_slow_queries`: Analyze slow queries (default: true)
  - `slow_query_threshold_ms`: Slow query threshold (default: 1000)
  - `min_query_count`: Minimum query count for patterns (default: 10)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "query_log": {
    "source_type": "file",
    "source_path": "/var/log/postgresql/queries.log",
    "format": "postgresql",
    "time_range": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    }
  },
  "analysis_options": {
    "detect_n_plus_one": true,
    "identify_hot_tables": true,
    "slow_query_threshold_ms": 500
  }
}
```

### suggest_indexes

Analyze schema and query patterns to suggest optimal indexes.

**Parameters:**
- `schema_id` (required): Schema identifier
- `query_analysis_id` (optional): Query analysis ID for query-based suggestions
- `options` (optional): Index suggestion options
  - `consider_existing`: Consider existing indexes (default: true)
  - `max_suggestions`: Maximum suggestions (default: 20)
  - `min_impact_score`: Minimum impact score 0-1 (default: 0.5)
  - `index_types`: Array of index types to consider
  - `consider_composite`: Consider composite indexes (default: true)
  - `max_columns_per_index`: Max columns in composite indexes (default: 3)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "query_analysis_id": "uuid-from-analysis",
  "options": {
    "consider_existing": true,
    "max_suggestions": 15,
    "min_impact_score": 0.6,
    "index_types": ["btree", "gin", "covering"],
    "consider_composite": true,
    "max_columns_per_index": 4
  }
}
```

### profile_data

Profile data in tables to understand characteristics and quality.

**Parameters:**
- `schema_id` (required): Schema identifier
- `tables` (optional): Specific tables to profile (empty for all)
- `profiling_options` (optional): Profiling options
  - `calculate_cardinality`: Calculate column cardinality (default: true)
  - `detect_patterns`: Detect data patterns (default: true)
  - `analyze_distributions`: Analyze value distributions (default: true)
  - `check_data_quality`: Check data quality (default: true)
  - `sample_size`: Sample size for analysis (default: 10000)
  - `include_statistics`: Include statistical measures (default: true)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "tables": ["users", "orders", "products"],
  "profiling_options": {
    "calculate_cardinality": true,
    "detect_patterns": true,
    "analyze_distributions": true,
    "check_data_quality": true,
    "sample_size": 20000,
    "include_statistics": true
  }
}
```

### generate_erd

Generate Entity-Relationship Diagram in various formats.

**Parameters:**
- `schema_id` (required): Schema identifier
- `options` (optional): ERD generation options
  - `format`: "mermaid", "plantuml", or "graphviz" (default: "mermaid")
  - `include_columns`: Include column details (default: true)
  - `include_data_types`: Include data types (default: true)
  - `include_constraints`: Include constraints (default: true)
  - `show_cardinality`: Show relationship cardinality (default: true)
  - `tables`: Specific tables to include (empty for all)
  - `max_columns_per_table`: Max columns to show (default: 10)
  - `group_by_schema`: Group tables by schema (default: false)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "options": {
    "format": "mermaid",
    "include_columns": true,
    "include_data_types": true,
    "include_constraints": true,
    "show_cardinality": true,
    "max_columns_per_table": 15
  }
}
```

### generate_documentation

Generate comprehensive Markdown documentation for the database schema.

**Parameters:**
- `schema_id` (required): Schema identifier
- `options` (optional): Documentation options
  - `include_erd`: Include ERD diagram (default: true)
  - `include_statistics`: Include data statistics (default: true)
  - `include_relationships`: Include relationship details (default: true)
  - `include_indexes`: Include index information (default: true)
  - `include_examples`: Include SQL query examples (default: true)
  - `group_by_category`: Group tables by category (default: false)
  - `output_format`: "markdown", "html", or "pdf" (default: "markdown")
  - `template`: Custom documentation template name

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "options": {
    "include_erd": true,
    "include_statistics": true,
    "include_relationships": true,
    "include_indexes": true,
    "include_examples": true,
    "output_format": "markdown"
  }
}
```

### generate_migration

Generate migration scripts for schema changes.

**Parameters:**
- `source_schema_id` (required): Source schema identifier
- `target_schema_id` (optional): Target schema identifier
- `migration_type` (required): "create", "alter", "drop", or "full_sync"
- `options` (optional): Migration options
  - `database_type`: Target database type
  - `include_data`: Include data migration (default: false)
  - `safe_mode`: Generate safe migrations with rollback (default: true)
  - `add_comments`: Add explanatory comments (default: true)
  - `batch_size`: Batch size for data migrations (default: 1000)
  - `generate_rollback`: Generate rollback script (default: true)

**Example:**
```json
{
  "source_schema_id": "uuid-from-extraction",
  "target_schema_id": "uuid-target-schema",
  "migration_type": "alter",
  "options": {
    "database_type": "postgresql",
    "include_data": false,
    "safe_mode": true,
    "add_comments": true,
    "generate_rollback": true
  }
}
```

### compare_schemas

Compare two database schemas to identify differences.

**Parameters:**
- `schema_id_1` (required): First schema identifier
- `schema_id_2` (required): Second schema identifier
- `comparison_options` (optional): Comparison options
  - `compare_tables`: Compare table structures (default: true)
  - `compare_columns`: Compare column definitions (default: true)
  - `compare_indexes`: Compare indexes (default: true)
  - `compare_constraints`: Compare constraints (default: true)
  - `compare_relationships`: Compare relationships (default: true)
  - `ignore_case`: Ignore case in comparisons (default: false)
  - `show_only_differences`: Show only differences (default: true)

**Example:**
```json
{
  "schema_id_1": "uuid-production-schema",
  "schema_id_2": "uuid-staging-schema",
  "comparison_options": {
    "compare_tables": true,
    "compare_columns": true,
    "compare_indexes": true,
    "compare_constraints": true,
    "show_only_differences": true
  }
}
```

### get_schema_status

Get the current status of a schema extraction or analysis job.

**Parameters:**
- `job_id` (required): Job identifier
- `include_details` (optional): Include detailed progress (default: true)

**Example:**
```json
{
  "job_id": "uuid-job-id",
  "include_details": true
}
```

### list_schemas

List all extracted schemas with metadata.

**Parameters:**
- `filters` (optional): Filters for schema list
  - `database_type`: Filter by database type
  - `min_table_count`: Minimum number of tables
  - `max_table_count`: Maximum number of tables
  - `has_relationships`: Filter schemas with relationships
  - `has_analysis`: Filter schemas with query analysis
- `sort_by` (optional): "name", "date", "table_count", or "size" (default: "date")
- `limit` (optional): Maximum results (default: 50, max: 500)

**Example:**
```json
{
  "filters": {
    "database_type": "postgresql",
    "min_table_count": 10,
    "has_relationships": true
  },
  "sort_by": "table_count",
  "limit": 20
}
```

### delete_schema

Delete an extracted schema and all associated data.

**Parameters:**
- `schema_id` (required): Schema identifier to delete
- `confirm` (required): Confirmation flag (must be true)

**Example:**
```json
{
  "schema_id": "uuid-to-delete",
  "confirm": true
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "sytra-schema-intelligence": {
      "command": "node",
      "args": ["/path/to/mcp-servers/schema-intelligence/dist/index.js"],
      "env": {
        "SCHEMA_API_URL": "http://localhost:8011"
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

The server communicates with these Schema Intelligence Service endpoints (Port 8011):

- `POST /api/v1/schema/extract` - Extract database schema
- `POST /api/v1/schema/relationships/detect` - Detect relationships
- `POST /api/v1/analysis/query-patterns` - Analyze query patterns
- `POST /api/v1/analysis/suggest-indexes` - Suggest indexes
- `POST /api/v1/analysis/profile-data` - Profile data
- `POST /api/v1/generate/erd` - Generate ERD diagram
- `POST /api/v1/generate/documentation` - Generate documentation
- `POST /api/v1/generate/migration` - Generate migration scripts
- `POST /api/v1/schema/compare` - Compare schemas
- `POST /api/v1/schema/status` - Get schema status
- `POST /api/v1/schema/list` - List schemas
- `POST /api/v1/schema/delete` - Delete schema

## Use Cases

### 1. Database Documentation
Extract schema and generate comprehensive documentation with ERD diagrams for onboarding new developers.

### 2. Schema Migration
Compare production and staging schemas to generate safe migration scripts.

### 3. Performance Optimization
Analyze query logs to detect N+1 patterns and suggest optimal indexes.

### 4. Data Quality Assessment
Profile data to identify quality issues, null percentages, and data distributions.

### 5. Relationship Discovery
Automatically detect implicit relationships in legacy databases without foreign keys.

### 6. Cross-Database Migration
Extract schema from MySQL and generate PostgreSQL migration scripts.

## Performance Considerations

- **Connection Pooling**: Efficient connection management for all database types
- **Batch Processing**: Handle large schemas (1000+ tables) with configurable batch sizes
- **Incremental Extraction**: Re-extract only changed tables for faster updates
- **Async Operations**: Non-blocking operations for better performance
- **Caching**: Cache extracted schemas to avoid redundant extractions
- **Sampling**: Use data sampling for large tables to speed up analysis

## Security

- Credentials are never logged or stored permanently
- SSL/TLS support for secure database connections
- Connection timeout protection
- Safe migration mode with rollback scripts
- Confirmation required for destructive operations

## License

MIT

---

Made with Bob