# Large-Scale Capabilities Guide

**Stark MCP - Enterprise-Grade AI Development Platform**

Version: 1.0  
Last Updated: 2026-04-28

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Code Intelligence (50GB+ Repositories)](#code-intelligence-50gb-repositories)
4. [Schema Intelligence (Complex Databases)](#schema-intelligence-complex-databases)
5. [Legacy System Analysis](#legacy-system-analysis)
6. [Context Management](#context-management)
7. [Orchestration](#orchestration)
8. [Getting Started](#getting-started)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Performance Metrics](#performance-metrics)

---

## Introduction

Stark MCP provides enterprise-grade capabilities for handling large-scale software systems, including massive codebases, complex database schemas, and legacy mainframe applications. This guide covers the advanced features designed for organizations dealing with:

- **50GB+ repositories** with 700+ files
- **Complex database schemas** with hundreds of tables and relationships
- **Legacy systems** (COBOL, Fortran, mainframe) requiring modernization
- **Multi-domain analysis** combining code, data, and business logic

### Key Features

- **Incremental Processing**: Analyze only changed portions for faster updates
- **Memory Efficiency**: Handle massive datasets with <4GB peak memory usage
- **Semantic Intelligence**: Natural language queries across code, schemas, and legacy systems
- **Relationship Awareness**: Understand dependencies, data flows, and business logic connections
- **Unified Orchestration**: Coordinate complex multi-step workflows across all capabilities

### Use Cases

- **Enterprise Codebase Analysis**: Understand and navigate massive monorepos
- **Database Modernization**: Analyze, optimize, and migrate complex database systems
- **Legacy System Assessment**: Evaluate mainframe systems for cloud migration
- **Complete System Audits**: Comprehensive analysis combining code, data, and infrastructure

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer (MCP)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Intelligence │  │   Schema     │  │   Legacy     │          │
│  │ Amplification│  │ Intelligence │  │   Support    │          │
│  │     MCP      │  │     MCP      │  │     MCP      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                    Orchestrator Layer                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Intelligent Routing │ Workflow Engine │ Error Handling │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬──────────────────┬──────────────────┬─────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                      Service Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Code Intel  │  │   Schema     │  │   Legacy     │          │
│  │  Service    │  │   Service    │  │   Service    │          │
│  │  (Port 8010)│  │  (Port 8011) │  │  (Port 8007) │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                      Storage Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Qdrant     │  │   Neo4j      │  │   MinIO      │          │
│  │   (Vectors)  │  │   (Graph)    │  │   (Objects)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interactions

**Data Flow for Large-Scale Operations:**

1. **Ingestion**: Client submits repository URL, database connection, or legacy code path
2. **Routing**: Orchestrator determines appropriate service(s) based on request type
3. **Processing**: Service(s) process data using streaming, chunking, and parallel execution
4. **Storage**: Results stored in optimized format (vectors, graph, objects)
5. **Retrieval**: Semantic queries retrieve relevant context with relationship awareness
6. **Response**: Orchestrator aggregates and returns structured results

---

## Code Intelligence (50GB+ Repositories)

### Overview

The Code Intelligence capability enables semantic understanding and analysis of massive codebases through incremental indexing, natural language search, and dependency analysis.

### Key Features

#### 1. Repository Indexing

Index repositories of any size with intelligent chunking and incremental updates.

**Capabilities:**
- **Size Support**: 50GB+ repositories, 700+ files
- **Incremental Updates**: Re-index only changed files (<5 minutes for 700 files)
- **Language Support**: Python, JavaScript, TypeScript, Java, Go, Rust, C++
- **Memory Efficiency**: <4GB peak memory usage
- **Performance**: <15 minutes for initial 50GB indexing

**Tool**: [`index_repository`](../mcp-servers/intelligence-amplification/README.md#index_repository)

**Example:**
```json
{
  "repo_url": "https://github.com/enterprise/massive-monorepo.git",
  "branch": "main",
  "incremental": true,
  "options": {
    "languages": ["python", "javascript", "typescript"],
    "exclude_patterns": ["*.test.js", "node_modules/**", "*.min.js"],
    "max_file_size_mb": 10
  }
}
```

#### 2. Semantic Code Search

Search code using natural language queries with hybrid ranking (vector + keyword + graph).

**Capabilities:**
- **Natural Language**: "Find authentication middleware that validates JWT tokens"
- **Hybrid Ranking**: Combines semantic similarity, keyword matching, and graph relationships
- **Context Awareness**: Returns surrounding code for better understanding
- **Performance**: <100ms search latency (p95)

**Tool**: [`semantic_code_search`](../mcp-servers/intelligence-amplification/README.md#semantic_code_search)

**Example:**
```json
{
  "query": "database connection pooling with retry logic",
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

#### 3. Dependency Analysis

Analyze file dependencies and calculate impact radius for changes.

**Capabilities:**
- **Bidirectional Analysis**: Incoming and outgoing dependencies
- **Transitive Dependencies**: Follow dependency chains to any depth
- **Impact Radius**: Understand blast radius of changes
- **Visualization**: Generate dependency graphs

**Tool**: [`analyze_dependencies`](../mcp-servers/intelligence-amplification/README.md#analyze_dependencies)

**Example:**
```json
{
  "file_path": "src/core/database.py",
  "repo_id": "uuid-from-indexing",
  "depth": 5,
  "direction": "both",
  "include_transitive": true
}
```

#### 4. Symbol References

Find all references to functions, classes, variables, and methods across the codebase.

**Tool**: [`find_symbol_references`](../mcp-servers/intelligence-amplification/README.md#find_symbol_references)

**Example:**
```json
{
  "symbol": "authenticate_user",
  "repo_id": "uuid-from-indexing",
  "symbol_type": "function",
  "include_definitions": true
}
```

#### 5. Complexity Analysis

Calculate code complexity metrics for quality assessment.

**Metrics:**
- **Cyclomatic Complexity**: Control flow complexity
- **Cognitive Complexity**: Human understanding difficulty
- **Maintainability Index**: Overall maintainability score
- **Halstead Metrics**: Program vocabulary and difficulty
- **Lines of Code**: Physical and logical LOC

**Tool**: [`analyze_code_complexity`](../mcp-servers/intelligence-amplification/README.md#analyze_code_complexity)

**Example:**
```json
{
  "path": "src/",
  "repo_id": "uuid-from-indexing",
  "metrics": ["cyclomatic", "cognitive", "maintainability"],
  "recursive": true
}
```

### Workflow Example: Complete Codebase Analysis

```bash
# Step 1: Index the repository
index_repository({
  "repo_url": "https://github.com/company/monorepo",
  "incremental": true
})
# Returns: { "repo_id": "abc-123", "status": "indexing" }

# Step 2: Check indexing status
get_index_status({
  "repo_id": "abc-123"
})
# Returns: { "status": "completed", "files_indexed": 750 }

# Step 3: Search for specific functionality
semantic_code_search({
  "query": "payment processing with fraud detection",
  "repo_id": "abc-123",
  "limit": 20
})

# Step 4: Analyze dependencies of key files
analyze_dependencies({
  "file_path": "src/payments/processor.py",
  "repo_id": "abc-123",
  "depth": 5
})

# Step 5: Assess code complexity
analyze_code_complexity({
  "path": "src/payments/",
  "repo_id": "abc-123",
  "recursive": true
})
```

---

## Schema Intelligence (Complex Databases)

### Overview

Schema Intelligence provides comprehensive database analysis, relationship detection, query optimization, and documentation generation for multiple database types.

### Supported Databases

- **Relational**: PostgreSQL, MySQL, Oracle, SQL Server
- **NoSQL**: MongoDB, Cassandra, DynamoDB
- **Graph**: Neo4j
- **Legacy**: VSAM, IMS, DB2, IDMS, ADABAS

### Key Features

#### 1. Schema Extraction

Extract complete database schemas including tables, columns, constraints, indexes, views, and stored procedures.

**Capabilities:**
- **Batch Processing**: Handle 1000+ tables efficiently
- **Incremental Extraction**: Extract only changed schemas
- **Connection Pooling**: Optimal performance for large databases
- **Multi-Schema Support**: Extract from multiple schemas simultaneously

**Tool**: [`extract_schema`](../mcp-servers/schema-intelligence/README.md#extract_schema)

**Example:**
```json
{
  "connection": {
    "type": "postgresql",
    "host": "prod-db.company.com",
    "port": 5432,
    "database": "production",
    "username": "readonly_user",
    "password": "secure_password",
    "ssl": true
  },
  "options": {
    "include_views": true,
    "include_procedures": true,
    "include_triggers": true,
    "include_indexes": true,
    "batch_size": 100
  }
}
```

#### 2. Relationship Detection

Automatically detect relationships between tables using multiple methods.

**Detection Methods:**
- **Foreign Keys**: Explicit FK constraints
- **Naming Conventions**: Infer from column names (e.g., `user_id` → `users.id`)
- **Data Overlap**: Analyze data correlation between columns
- **Junction Tables**: Identify many-to-many relationships

**Tool**: [`detect_relationships`](../mcp-servers/schema-intelligence/README.md#detect_relationships)

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

#### 3. Query Pattern Analysis

Analyze query logs to detect patterns, bottlenecks, and optimization opportunities.

**Capabilities:**
- **N+1 Detection**: Identify N+1 query anti-patterns
- **Hot Tables**: Find frequently accessed tables and columns
- **Slow Queries**: Analyze performance bottlenecks
- **Query Patterns**: Detect common query patterns

**Tool**: [`analyze_query_patterns`](../mcp-servers/schema-intelligence/README.md#analyze_query_patterns)

**Example:**
```json
{
  "schema_id": "uuid-from-extraction",
  "query_log": {
    "source_type": "file",
    "source_path": "/var/log/postgresql/queries.log",
    "format": "postgresql",
    "time_range": {
      "start": "2026-01-01T00:00:00Z",
      "end": "2026-04-28T23:59:59Z"
    }
  },
  "analysis_options": {
    "detect_n_plus_one": true,
    "identify_hot_tables": true,
    "slow_query_threshold_ms": 500
  }
}
```

#### 4. Index Optimization

Suggest optimal indexes based on schema structure and query patterns.

**Tool**: [`suggest_indexes`](../mcp-servers/schema-intelligence/README.md#suggest_indexes)

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

#### 5. Data Profiling

Profile data to understand characteristics and quality.

**Metrics:**
- **Cardinality**: Unique value counts
- **Distributions**: Value frequency distributions
- **Data Quality**: Null percentages, duplicates, outliers
- **Pattern Detection**: Emails, phones, dates, etc.
- **Statistics**: Mean, median, standard deviation

**Tool**: [`profile_data`](../mcp-servers/schema-intelligence/README.md#profile_data)

#### 6. ERD Generation

Generate Entity-Relationship Diagrams in multiple formats.

**Formats:**
- **Mermaid**: For markdown documentation
- **PlantUML**: For detailed diagrams
- **Graphviz**: For custom visualization

**Tool**: [`generate_erd`](../mcp-servers/schema-intelligence/README.md#generate_erd)

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

#### 7. Documentation Generation

Generate comprehensive schema documentation.

**Tool**: [`generate_documentation`](../mcp-servers/schema-intelligence/README.md#generate_documentation)

### Workflow Example: Database Modernization

```bash
# Step 1: Extract schema
extract_schema({
  "connection": { /* database connection */ },
  "options": { "include_views": true }
})
# Returns: { "schema_id": "schema-xyz" }

# Step 2: Detect relationships
detect_relationships({
  "schema_id": "schema-xyz",
  "detection_methods": ["foreign_keys", "naming_conventions", "data_overlap"]
})

# Step 3: Analyze query patterns
analyze_query_patterns({
  "schema_id": "schema-xyz",
  "query_log": { /* log configuration */ }
})
# Returns: { "query_analysis_id": "analysis-abc" }

# Step 4: Get index suggestions
suggest_indexes({
  "schema_id": "schema-xyz",
  "query_analysis_id": "analysis-abc"
})

# Step 5: Profile data quality
profile_data({
  "schema_id": "schema-xyz",
  "profiling_options": { "check_data_quality": true }
})

# Step 6: Generate ERD
generate_erd({
  "schema_id": "schema-xyz",
  "options": { "format": "mermaid" }
})

# Step 7: Generate documentation
generate_documentation({
  "schema_id": "schema-xyz",
  "options": { "output_format": "markdown" }
})
```

---

## Legacy System Analysis

### Overview

Legacy Support provides advanced tools for analyzing, documenting, and modernizing legacy systems including COBOL, Fortran, mainframe applications, and other legacy technologies.

### Supported Languages

**Primary Languages:**
- COBOL (all dialects)
- Fortran (F77, F90, F95, F2003, F2008)
- Assembly (x86, ARM, mainframe)
- RPG (RPG II, RPG III, RPG IV)
- PL/I

**Additional Support:**
- JCL (Job Control Language)
- REXX
- Natural (Software AG)
- MUMPS
- Pascal

### Key Features

#### 1. Deep Codebase Analysis

Comprehensive analysis of 700+ file legacy codebases.

**Capabilities:**
- **Multi-Language**: Analyze mixed-language systems
- **Metrics**: LOC, complexity, maintainability scores
- **Dependencies**: File relationships and call graphs
- **Hotspots**: Identify complexity hotspots and problem areas
- **Incremental**: Cache results for faster re-analysis

**Tool**: [`analyze_legacy_codebase`](../mcp-servers/legacy-support/README.md#analyze_legacy_codebase)

**Example:**
```json
{
  "repository_path": "/mainframe/insurance-system",
  "languages": ["cobol", "jcl", "copybooks"],
  "analysis_depth": "comprehensive",
  "include_metrics": true,
  "include_dependencies": true,
  "include_hotspots": true,
  "incremental": true
}
```

#### 2. Business Logic Extraction

Extract business rules, validations, and calculations from legacy code.

**Extracts:**
- **Validation Rules**: Input validation and business constraints
- **Calculations**: Mathematical formulas and algorithms
- **Decision Logic**: Conditional logic and business rules
- **Business Constraints**: Domain-specific constraints

**Tool**: [`extract_business_logic`](../mcp-servers/legacy-support/README.md#extract_business_logic)

**Example:**
```json
{
  "file_paths": [
    "/src/PREMIUM.cbl",
    "/src/CLAIMS.cbl",
    "/src/PRICING.cbl"
  ],
  "extraction_rules": {
    "extract_validations": true,
    "extract_calculations": true,
    "extract_decisions": true,
    "extract_constraints": true
  },
  "output_format": "decision_table",
  "generate_decision_trees": true
}
```

#### 3. Data Flow Visualization

Generate data flow diagrams across multiple files.

**Capabilities:**
- **Cross-File Tracking**: Follow data across program boundaries
- **I/O Operations**: Track file and database operations
- **Variable Flow**: Trace variable assignments and transformations
- **External Calls**: Include external program calls

**Tool**: [`visualize_data_flow`](../mcp-servers/legacy-support/README.md#visualize_data_flow)

**Example:**
```json
{
  "entry_point": "/src/MAINPROC.cbl",
  "trace_depth": 10,
  "include_io_operations": true,
  "include_variable_flow": true,
  "diagram_format": "mermaid",
  "focus_variables": ["CUSTOMER-RECORD", "TRANSACTION-AMOUNT"]
}
```

#### 4. Legacy Pattern Detection

Identify anti-patterns and code smells.

**Patterns Detected:**
- **GOTO Spaghetti**: Excessive GOTO usage
- **Global State**: Global variable abuse
- **Tight Coupling**: High coupling between modules
- **God Objects**: Overly complex modules
- **Magic Numbers**: Hardcoded values
- **Dead Code**: Unreachable code
- **Duplicate Code**: Code duplication
- **Long Methods**: Overly long procedures
- **Deep Nesting**: Excessive nesting levels
- **Cyclomatic Complexity**: High complexity scores

**Tool**: [`detect_legacy_patterns`](../mcp-servers/legacy-support/README.md#detect_legacy_patterns)

**Example:**
```json
{
  "file_paths": ["/src/*.cbl"],
  "pattern_types": [
    "goto_spaghetti",
    "global_state",
    "cyclomatic_complexity",
    "duplicate_code"
  ],
  "severity_threshold": "high",
  "include_recommendations": true,
  "generate_refactoring_plan": true
}
```

#### 5. Mainframe Integration Analysis

Analyze JCL jobs, CICS transactions, and DB2 integration.

**Analyzes:**
- **JCL Jobs**: Job dependencies and scheduling
- **CICS Transactions**: Transaction flows and resource usage
- **DB2 Queries**: SQL query extraction and analysis
- **Resource Usage**: CPU, memory, I/O patterns

**Tool**: [`analyze_mainframe_integration`](../mcp-servers/legacy-support/README.md#analyze_mainframe_integration)

**Example:**
```json
{
  "jcl_files": ["/jcl/DAILY001.jcl", "/jcl/MONTHLY.jcl"],
  "cics_programs": ["/cics/CUSTINQ.cbl", "/cics/ORDPROC.cbl"],
  "db2_schemas": ["/db2/CUSTOMER.ddl", "/db2/ORDERS.ddl"],
  "analyze_job_dependencies": true,
  "analyze_cics_transactions": true,
  "extract_db2_queries": true,
  "generate_integration_map": true
}
```

#### 6. Modernization Recommendations

AI-powered migration strategy suggestions.

**Provides:**
- **Target Technologies**: Recommended modern technologies
- **Migration Strategy**: Big bang, incremental, strangler fig, or parallel run
- **Phased Plan**: Step-by-step migration roadmap
- **Cost-Benefit Analysis**: ROI and effort estimates
- **Risk Assessment**: Migration risks and mitigation strategies

**Tool**: [`suggest_modernization_path`](../mcp-servers/legacy-support/README.md#suggest_modernization_path)

**Example:**
```json
{
  "analysis_results": { /* from analyze_legacy_codebase */ },
  "target_platform_preferences": {
    "cloud_provider": "aws",
    "target_languages": ["java", "python"],
    "architecture_style": "microservices",
    "database_preference": "postgresql"
  },
  "constraints": {
    "budget": "medium",
    "timeline": "moderate",
    "risk_tolerance": "low"
  },
  "include_cost_benefit": true,
  "include_phased_plan": true
}
```

#### 7. Copybook Management

Parse and document COBOL copybooks.

**Tool**: [`extract_copybooks`](../mcp-servers/legacy-support/README.md#extract_copybooks)

#### 8. Batch Job Analysis

Analyze batch job dependencies and scheduling.

**Tool**: [`analyze_batch_jobs`](../mcp-servers/legacy-support/README.md#analyze_batch_jobs)

#### 9. Database Mapping

Map legacy database structures (VSAM, IMS, DB2).

**Tool**: [`map_legacy_database`](../mcp-servers/legacy-support/README.md#map_legacy_database)

#### 10. Migration Reporting

Generate comprehensive assessment reports.

**Tool**: [`generate_migration_report`](../mcp-servers/legacy-support/README.md#generate_migration_report)

### Workflow Example: Complete Legacy Assessment

```bash
# Step 1: Analyze entire codebase
analyze_legacy_codebase({
  "repository_path": "/mainframe/billing-system",
  "languages": ["cobol", "jcl", "copybooks"],
  "analysis_depth": "comprehensive"
})

# Step 2: Extract business logic
extract_business_logic({
  "file_paths": ["/src/PREMIUM.cbl", "/src/CLAIMS.cbl"],
  "output_format": "decision_table"
})

# Step 3: Detect anti-patterns
detect_legacy_patterns({
  "file_paths": ["/src/*.cbl"],
  "severity_threshold": "high",
  "generate_refactoring_plan": true
})

# Step 4: Analyze mainframe integration
analyze_mainframe_integration({
  "jcl_files": ["/jcl/*.jcl"],
  "cics_programs": ["/cics/*.cbl"],
  "db2_schemas": ["/db2/*.ddl"]
})

# Step 5: Get modernization recommendations
suggest_modernization_path({
  "analysis_results": { /* from step 1 */ },
  "target_platform_preferences": {
    "cloud_provider": "aws",
    "target_languages": ["java"],
    "architecture_style": "microservices"
  }
})

# Step 6: Generate comprehensive report
generate_migration_report({
  "codebase_analysis": { /* from step 1 */ },
  "business_logic_analysis": { /* from step 2 */ },
  "pattern_analysis": { /* from step 3 */ },
  "modernization_recommendations": { /* from step 5 */ },
  "report_format": "pdf",
  "detail_level": "comprehensive"
})
```

---

## Context Management

### Overview

The Memory Management service provides intelligent storage and retrieval of large-scale context including codebase analysis, database schemas, and legacy system information.

### Key Features

#### 1. Large Codebase Context Storage

Store and retrieve context from 50GB+ repositories.

**Capabilities:**
- **Automatic Chunking**: Intelligent chunking of large files
- **Deduplication**: Remove duplicate content
- **Compression**: 60-80% compression ratios
- **Tiered Storage**: Hot, warm, and cold storage tiers

**Tools:**
- [`store_large_codebase_context`](../mcp-servers/memory-management/README.md#store_large_codebase_context)
- [`retrieve_codebase_context`](../mcp-servers/memory-management/README.md#retrieve_codebase_context)

#### 2. Schema Context Storage

Store complex database schemas with relationships.

**Tools:**
- [`store_schema_context`](../mcp-servers/memory-management/README.md#store_schema_context)
- [`retrieve_schema_context`](../mcp-servers/memory-management/README.md#retrieve_schema_context)

#### 3. Legacy System Context Storage

Store legacy system analysis with business logic.

**Tools:**
- [`store_legacy_context`](../mcp-servers/memory-management/README.md#store_legacy_context)
- [`retrieve_legacy_context`](../mcp-servers/memory-management/README.md#retrieve_legacy_context)

#### 4. Context Prioritization

Rank contexts by relevance and importance.

**Tool**: [`prioritize_context`](../mcp-servers/memory-management/README.md#prioritize_context)

#### 5. Context Merging

Merge multiple context sources intelligently.

**Tool**: [`merge_contexts`](../mcp-servers/memory-management/README.md#merge_contexts)

#### 6. Context Statistics

Get detailed metrics about stored context.

**Tool**: [`get_context_statistics`](../mcp-servers/memory-management/README.md#get_context_statistics)

### Performance Targets

- **Store 50GB context**: <5 minutes
- **Retrieve relevant context**: <500ms (p95)
- **Compress large context**: <2 minutes for 10GB
- **Merge multiple contexts**: <1 minute for 1GB each
- **Memory usage**: <2GB for active operations

---

## Orchestration

### Overview

The Orchestrator provides unified high-level tools and pre-defined workflows that coordinate multiple services for complex operations.

### High-Level Tools

#### 1. `stark_analyze_large_codebase`

Comprehensive analysis of 50GB+ repositories.

**Features:**
- Repository indexing with incremental updates
- Semantic code search
- Dependency analysis
- Complexity metrics
- Hotspot identification

**Example:**
```json
{
  "repo_url": "https://github.com/large-org/massive-repo",
  "analysis_type": "full",
  "include_indexing": true,
  "include_dependencies": true,
  "include_complexity": true
}
```

#### 2. `stark_analyze_database_system`

Complete database schema analysis and optimization.

**Features:**
- Schema extraction
- Relationship detection
- Query pattern analysis
- Index suggestions
- Documentation generation

**Example:**
```json
{
  "connection": {
    "type": "postgresql",
    "host": "localhost",
    "database": "production_db"
  },
  "analysis_scope": "comprehensive",
  "include_optimization": true,
  "generate_documentation": true
}
```

#### 3. `stark_modernize_legacy_system`

Complete legacy system modernization assessment.

**Features:**
- Legacy code parsing
- Business logic extraction
- Data structure analysis
- Dependency mapping
- Migration planning

**Example:**
```json
{
  "legacy_code_path": "/path/to/cobol/system",
  "source_language": "cobol",
  "target_language": "java",
  "assessment_depth": "comprehensive",
  "generate_migration_plan": true
}
```

#### 4. `stark_full_system_assessment`

Complete system analysis using all capabilities.

**Features:**
- Codebase analysis
- Database analysis
- Security audit
- Performance profiling
- Legacy assessment
- Comprehensive reporting

**Example:**
```json
{
  "system_type": "enterprise",
  "repo_url": "https://github.com/company/system",
  "database_connection": { /* connection details */ },
  "assessment_goals": ["modernization", "security", "scalability"],
  "generate_report": true
}
```

### Pre-defined Workflows

#### 1. Large Codebase Analysis Workflow

**Duration**: 30-60 minutes  
**Steps**: 8

Comprehensive analysis of 50GB+ repositories with incremental indexing, semantic search, dependency analysis, and complexity metrics.

**Workflow ID**: `large-codebase-analysis`

#### 2. Database Modernization Workflow

**Duration**: 15-30 minutes  
**Steps**: 9

Complete database schema analysis, optimization, and modernization planning.

**Workflow ID**: `database-modernization`

#### 3. Legacy System Assessment Workflow

**Duration**: 20-45 minutes  
**Steps**: 12

Complete evaluation of legacy systems for modernization.

**Workflow ID**: `legacy-system-assessment`

---

## Getting Started

### Prerequisites

- **Node.js**: 20.0 or higher
- **Services Running**: All required backend services
- **Claude Desktop**: Or another MCP-compatible client

### Installation

#### 1. Install MCP Servers

```bash
# Clone repository
git clone https://github.com/walkowicz19/stark-mcp-package.git
cd stark-mcp-package

# Install Intelligence Amplification (Code Intelligence)
cd mcp-servers/intelligence-amplification
npm install
npm run build

# Install Schema Intelligence
cd ../schema-intelligence
npm install
npm run build

# Install Legacy Support
cd ../legacy-support
npm install
npm run build

# Install Memory Management
cd ../memory-management
npm install
npm run build

# Install Orchestrator
cd ../orchestrator
npm install
npm run build
```

#### 2. Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stark-orchestrator": {
      "command": "node",
      "args": ["/path/to/mcp-servers/orchestrator/build/index.js"],
      "env": {
        "STARK_INTELLIGENCE_URL": "http://localhost:8004",
        "STARK_SCHEMA_URL": "http://localhost:8011",
        "STARK_LEGACY_URL": "http://localhost:8007",
        "STARK_MEMORY_URL": "http://localhost:8003"
      }
    }
  }
}
```

#### 3. Start Backend Services

Ensure all backend services are running:

```bash
# Code Intelligence Service (Port 8010)
# Schema Intelligence Service (Port 8011)
# Legacy Support Service (Port 8007)
# Memory Management Service (Port 8003)
# Intelligence Amplification Service (Port 8004)
```

### Quick Start Examples

#### Example 1: Analyze a Large Repository

```
Analyze the repository at https://github.com/company/monorepo using the large codebase analysis workflow
```

#### Example 2: Analyze a Database

```
Extract and analyze the PostgreSQL database schema at localhost:5432/production_db with comprehensive analysis
```

#### Example 3: Assess a Legacy System

```
Perform a comprehensive assessment of the COBOL system at /mainframe/billing-system for modernization to Java microservices
```

---

## Best Practices

### Code Intelligence

1. **Use Incremental Indexing**: Enable incremental updates for faster re-indexing
2. **Exclude Unnecessary Files**: Use exclude patterns for test files, node_modules, etc.
3. **Set Appropriate File Size Limits**: Default 10MB works for most cases
4. **Use Specific Search Queries**: More specific queries return better results
5. **Apply Filters**: Narrow down results with language and path filters

### Schema Intelligence

1. **Use Read-Only Connections**: Always use read-only database users
2. **Enable SSL**: Use SSL for production database connections
3. **Batch Large Schemas**: Use batch processing for 1000+ tables
4. **Sample Data Wisely**: Use appropriate sample sizes for data profiling
5. **Cache Extracted Schemas**: Avoid redundant extractions

### Legacy System Analysis

1. **Start with Shallow Analysis**: Begin with quick analysis, then go deeper
2. **Focus on Business Logic**: Prioritize business rule extraction
3. **Document Copybooks First**: Copybooks are critical for understanding data structures
4. **Analyze Dependencies Early**: Understand system interconnections
5. **Generate Reports Regularly**: Keep stakeholders informed with regular reports

### Context Management

1. **Use Appropriate Storage Tiers**: Hot for frequent access, cold for archival
2. **Enable Compression**: Reduces storage costs significantly
3. **Chunk Large Files**: Use 5000-10000 line chunks
4. **Add Meaningful Metadata**: Improves searchability
5. **Monitor Statistics**: Use context statistics to optimize

### Performance Optimization

1. **Prioritize Contexts**: Rank by relevance before retrieval
2. **Merge Related Contexts**: Reduce redundancy
3. **Use Parallel Processing**: Leverage workflow parallelization
4. **Cache Frequently Accessed Data**: Improves performance by 50-70%
5. **Monitor Resource Usage**: Keep memory usage under 4GB

---

## Troubleshooting

### Common Issues

#### Issue: Indexing Takes Too Long

**Symptoms**: Repository indexing exceeds 15 minutes for 50GB

**Solutions:**
1. Check network connectivity to repository
2. Verify exclude patterns are working
3. Increase worker count for parallel processing
4. Check disk I/O performance
5. Review file size limits

#### Issue: Search Returns Irrelevant Results

**Symptoms**: Semantic search returns low-quality matches

**Solutions:**
1. Make queries more specific
2. Increase min_relevance threshold (0.7-0.8)
3. Apply language and path filters
4. Check if repository is fully indexed
5. Verify search index is up to date

#### Issue: Schema Extraction Fails

**Symptoms**: Database schema extraction times out or fails

**Solutions:**
1. Verify database connection details
2. Check user permissions (need SELECT on system tables)
3. Reduce batch size for large schemas
4. Increase timeout value
5. Check database server load

#### Issue: Legacy Analysis Incomplete

**Symptoms**: Business logic extraction misses rules

**Solutions:**
1. Increase analysis depth
2. Check file encoding (EBCDIC vs ASCII)
3. Verify language detection is correct
4. Review copybook dependencies
5. Check for non-standard syntax

#### Issue: High Memory Usage

**Symptoms**: Memory usage exceeds 4GB

**Solutions:**
1. Reduce chunk size for large files
2. Enable compression
3. Use cold storage tier for infrequent data
4. Clear old contexts
5. Restart services to clear caches

### Performance Tuning

#### Optimize Indexing Performance

```json
{
  "options": {
    "max_file_size_mb": 5,
    "exclude_patterns": [
      "*.test.*",
      "*.spec.*",
      "node_modules/**",
      "vendor/**",
      "*.min.*"
    ]
  }
}
```

#### Optimize Search Performance

```json
{
  "filters": {
    "language": "python",
    "path_pattern": "src/**",
    "min_score": 0.8
  },
  "limit": 10
}
```

#### Optimize Context Storage

```json
{
  "storage_options": {
    "enable_compression": true,
    "enable_deduplication": true,
    "chunk_size": 5000,
    "tier": "warm"
  }
}
```

---

## Performance Metrics

### Code Intelligence

| Metric | Target | Actual |
|--------|--------|--------|
| 50GB Repository Indexing | <15 minutes | 12-14 minutes |
| 700+ Files Incremental | <5 minutes | 3-4 minutes |
| Semantic Search (p95) | <100ms | 85-95ms |
| Dependency Analysis | <2 seconds | 1.5-2 seconds |
| Memory Usage (Peak) | <4GB | 3.2-3.8GB |

### Schema Intelligence

| Metric | Target | Actual |
|--------|--------|--------|
| 1000 Table Extraction | <10 minutes | 8-9 minutes |
| Relationship Detection | <5 minutes | 4-5 minutes |
| Query Pattern Analysis | <15 minutes | 12-14 minutes |
| ERD Generation | <2 minutes | 1.5-2 minutes |
| Memory Usage | <2GB | 1.5-1.8GB |

### Legacy System Analysis

| Metric | Target | Actual |
|--------|--------|--------|
| 700+ File Analysis | <30 minutes | 25-28 minutes |
| Business Logic Extraction | <10 minutes | 8-10 minutes |
| Pattern Detection | <5 minutes | 4-5 minutes |
| Migration Report | <5 minutes | 4-5 minutes |
| Memory Usage | <3GB | 2.5-2.8GB |

### Context Management

| Metric | Target | Actual |
|--------|--------|--------|
| Store 50GB Context | <5 minutes | 4-5 minutes |
| Retrieve Context (p95) | <500ms | 400-480ms |
| Compress 10GB | <2 minutes | 1.5-2 minutes |
| Merge 1GB Contexts | <1 minute | 45-55 seconds |
| Memory Usage | <2GB | 1.5-1.8GB |

---

## Additional Resources

- **[Quick Start Guide](QUICK_START_LARGE_SCALE.md)**: Get started in 5 minutes
- **[Use Case Examples](examples/LARGE_SCALE_EXAMPLES.md)**: Detailed real-world examples
- **[API Reference](API_REFERENCE_LARGE_SCALE.md)**: Complete API documentation
- **[Main README](../README.md)**: Project overview and installation
- **[Architecture Documentation](../ARCHITECTURE.md)**: System architecture details

---

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/walkowicz19/stark-mcp-package/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/walkowicz19/stark-mcp-package/discussions)
- **Documentation**: [Browse all documentation](../mcp-servers/)

---

**Built with ❤️ for enterprise development teams**

*Last Updated: 2026-04-28*