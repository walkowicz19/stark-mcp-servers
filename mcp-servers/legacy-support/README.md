# Sytra Legacy Support MCP Server

MCP server for the Sytra Legacy Support service, providing advanced tools for parsing, analyzing, translating, and migrating legacy code from COBOL, Fortran, and other mainframe languages. Designed to handle large-scale legacy systems with 700+ files.

## Features

### Core Capabilities
- **COBOL Parsing**: Parse and analyze COBOL code structure
- **Fortran Parsing**: Parse Fortran code (F77, F90, F95+)
- **Code Translation**: Translate COBOL to Python or Java
- **Dependency Analysis**: Analyze code dependencies and relationships
- **Migration Planning**: Generate comprehensive migration plans

### Advanced Analysis (New)
- **Deep Codebase Analysis**: Comprehensive analysis of 700+ file codebases
- **Business Logic Extraction**: Extract business rules, validations, and calculations
- **Data Flow Visualization**: Generate cross-file data flow diagrams
- **Legacy Pattern Detection**: Identify anti-patterns and code smells
- **Mainframe Integration Analysis**: Analyze JCL, CICS, and DB2 integration
- **Modernization Recommendations**: AI-powered migration strategy suggestions
- **Copybook Management**: Parse and document COBOL copybooks
- **Batch Job Analysis**: Analyze job dependencies and scheduling
- **Database Mapping**: Map legacy database structures (VSAM, IMS, DB2)
- **Migration Reporting**: Generate comprehensive assessment reports

## Installation

```bash
cd mcp-servers/legacy-support
npm install
npm run build
```

## Configuration

Set the following environment variable:

- `LEGACY_API_URL`: URL of the Legacy Support service (default: `http://localhost:8003`)

## Available Tools

### parse_cobol

Parse COBOL code to extract structure, data definitions, and program logic.

**Parameters:**
- `code` (required): The COBOL code to parse
- `include_ast` (optional): Include abstract syntax tree (default: true)
- `extract_data_division` (optional): Extract data division details (default: true)
- `extract_procedure_division` (optional): Extract procedure division details (default: true)
- `identify_copybooks` (optional): Identify COPY statements (default: true)

**Example:**
```json
{
  "code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. SAMPLE.\n...",
  "include_ast": true,
  "extract_data_division": true,
  "identify_copybooks": true
}
```

### parse_fortran

Parse Fortran code to extract structure, subroutines, and data types.

**Parameters:**
- `code` (required): The Fortran code to parse
- `fortran_version` (optional): Version - "f77", "f90", "f95", "f2003", "f2008" (default: "f90")
- `include_ast` (optional): Include abstract syntax tree (default: true)
- `extract_modules` (optional): Extract module definitions (default: true)
- `extract_subroutines` (optional): Extract subroutine definitions (default: true)

**Example:**
```json
{
  "code": "PROGRAM example\n  IMPLICIT NONE\n  ...",
  "fortran_version": "f90",
  "include_ast": true,
  "extract_modules": true
}
```

### translate_cobol_to_python

Translate COBOL code to Python, preserving business logic.

**Parameters:**
- `cobol_code` (required): The COBOL code to translate
- `target_python_version` (optional): Target Python version (default: "3.11")
- `preserve_comments` (optional): Preserve original comments (default: true)
- `use_type_hints` (optional): Add Python type hints (default: true)
- `modernize_patterns` (optional): Use modern Python patterns (default: true)
- `include_tests` (optional): Generate unit tests (default: false)

**Example:**
```json
{
  "cobol_code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. CALC.\n...",
  "target_python_version": "3.11",
  "use_type_hints": true,
  "modernize_patterns": true,
  "include_tests": true
}
```

### translate_cobol_to_java

Translate COBOL code to Java, maintaining business logic.

**Parameters:**
- `cobol_code` (required): The COBOL code to translate
- `target_java_version` (optional): Target Java version (default: "17")
- `package_name` (optional): Java package name
- `use_spring` (optional): Use Spring Framework patterns (default: false)
- `preserve_comments` (optional): Preserve original comments (default: true)
- `generate_interfaces` (optional): Generate interfaces (default: true)
- `include_tests` (optional): Generate JUnit tests (default: false)

**Example:**
```json
{
  "cobol_code": "IDENTIFICATION DIVISION.\nPROGRAM-ID. PROCESS.\n...",
  "target_java_version": "17",
  "package_name": "com.example.legacy",
  "use_spring": true,
  "include_tests": true
}
```

### analyze_dependencies

Analyze code dependencies including COPY statements and external references.

**Parameters:**
- `code` (required): The legacy code to analyze
- `language` (optional): Source language - "cobol", "fortran", "pl1", "rpg", "assembly" (default: "cobol")
- `include_external_deps` (optional): Include external dependencies (default: true)
- `include_data_deps` (optional): Include data dependencies (default: true)
- `generate_graph` (optional): Generate dependency graph (default: true)
- `depth` (optional): Analysis depth for transitive dependencies (default: 3, max: 10)

**Example:**
```json
{
  "code": "COPY CUSTOMER-RECORD.\nCALL 'VALIDATE' USING WS-DATA.\n...",
  "language": "cobol",
  "include_external_deps": true,
  "generate_graph": true,
  "depth": 5
}
```

### generate_migration_plan

Generate a comprehensive migration plan for legacy code modernization.

**Parameters:**
- `source_code` (required): The legacy source code or description
- `source_language` (required): Source language - "cobol", "fortran", "pl1", "rpg", "assembly"
- `target_language` (required): Target language - "python", "java", "csharp", "javascript", "go"
- `migration_strategy` (optional): Strategy - "big_bang", "incremental", "strangler_fig", "parallel_run" (default: "incremental")
- `include_risk_analysis` (optional): Include risk analysis (default: true)
- `include_timeline` (optional): Include estimated timeline (default: true)
- `include_resource_estimate` (optional): Include resource estimates (default: true)

## Advanced Analysis Tools

### analyze_legacy_codebase

Deep analysis of entire legacy codebases with 700+ files. Provides comprehensive metrics, complexity scores, file relationships, and dependency graphs.

**Parameters:**
- `repository_path` (required): Path to the legacy codebase repository
- `languages` (required): Array of languages to analyze - "cobol", "fortran", "assembly", "jcl", "rpg", "pl1", "rexx", "natural", "mumps", "pascal"
- `analysis_depth` (optional): Depth of analysis - "shallow", "medium", "deep", "comprehensive" (default: "medium")
- `include_metrics` (optional): Include code metrics (LOC, complexity, maintainability) (default: true)
- `include_dependencies` (optional): Include dependency graph analysis (default: true)
- `include_hotspots` (optional): Identify complexity hotspots and problem areas (default: true)
- `max_files` (optional): Maximum number of files to analyze, 0 = unlimited (default: 0)
- `incremental` (optional): Use incremental analysis with caching (default: true)

**Example:**
```json
{
  "repository_path": "/mainframe/legacy-system",
  "languages": ["cobol", "jcl", "copybooks"],
  "analysis_depth": "comprehensive",
  "include_metrics": true,
  "include_dependencies": true,
  "include_hotspots": true,
  "incremental": true
}
```

**Use Case:** Analyze a large COBOL mainframe system with 800+ programs to understand overall complexity, identify refactoring priorities, and map dependencies.

---

### extract_business_logic

Extract business rules, validations, and calculations from legacy code. Identifies decision logic, validation rules, calculation formulas, and business constraints.

**Parameters:**
- `file_paths` (required): Array of file paths containing business logic
- `extraction_rules` (optional): Object specifying what to extract:
  - `extract_validations` (optional): Extract validation rules (default: true)
  - `extract_calculations` (optional): Extract calculation formulas (default: true)
  - `extract_decisions` (optional): Extract decision logic and conditions (default: true)
  - `extract_constraints` (optional): Extract business constraints (default: true)
- `output_format` (optional): Output format - "json", "yaml", "markdown", "decision_table" (default: "json")
- `include_context` (optional): Include surrounding code context (default: true)
- `generate_decision_trees` (optional): Generate decision tree visualizations (default: false)

**Example:**
```json
{
  "file_paths": [
    "/src/CALCPREM.cbl",
    "/src/VALIDATE.cbl",
    "/src/PRICING.cbl"
  ],
  "extraction_rules": {
    "extract_validations": true,
    "extract_calculations": true,
    "extract_decisions": true,
    "extract_constraints": true
  },
  "output_format": "decision_table",
  "include_context": true,
  "generate_decision_trees": true
}
```

**Use Case:** Extract insurance premium calculation logic from legacy COBOL programs to document business rules before migration.

---

### visualize_data_flow

Generate data flow diagrams across multiple files. Tracks variable flow, I/O operations, database access, and file system interactions.

**Parameters:**
- `entry_point` (required): Entry point file or function to start tracing
- `trace_depth` (optional): Maximum depth to trace data flow (default: 5, max: 20)
- `include_io_operations` (optional): Include file I/O and database operations (default: true)
- `include_variable_flow` (optional): Track variable assignments and transformations (default: true)
- `include_external_calls` (optional): Include external program calls (default: true)
- `diagram_format` (optional): Output format - "mermaid", "plantuml", "graphviz", "d3" (default: "mermaid")
- `focus_variables` (optional): Array of specific variables to focus on
- `simplify_output` (optional): Simplify diagram by removing trivial flows (default: false)

**Example:**
```json
{
  "entry_point": "/src/MAINPROC.cbl",
  "trace_depth": 10,
  "include_io_operations": true,
  "include_variable_flow": true,
  "include_external_calls": true,
  "diagram_format": "mermaid",
  "focus_variables": ["CUSTOMER-RECORD", "TRANSACTION-AMOUNT"],
  "simplify_output": true
}
```

**Use Case:** Visualize how customer data flows through a batch processing system from input file to database updates.

---

### detect_legacy_patterns

Identify common legacy anti-patterns and code smells. Detects GOTO spaghetti, global state abuse, tight coupling, and other maintainability issues.

**Parameters:**
- `file_paths` (required): Array of files to analyze for anti-patterns
- `pattern_types` (optional): Array of pattern types to detect - "goto_spaghetti", "global_state", "tight_coupling", "god_object", "magic_numbers", "dead_code", "duplicate_code", "long_methods", "deep_nesting", "cyclomatic_complexity" (default: ["goto_spaghetti", "global_state", "tight_coupling", "cyclomatic_complexity"])
- `severity_threshold` (optional): Minimum severity to report - "low", "medium", "high", "critical" (default: "medium")
- `include_recommendations` (optional): Include refactoring recommendations (default: true)
- `include_examples` (optional): Include code examples of detected patterns (default: true)
- `generate_refactoring_plan` (optional): Generate prioritized refactoring plan (default: false)

**Example:**
```json
{
  "file_paths": [
    "/src/LEGACY01.cbl",
    "/src/LEGACY02.cbl",
    "/src/OLDPROC.cbl"
  ],
  "pattern_types": [
    "goto_spaghetti",
    "global_state",
    "cyclomatic_complexity",
    "duplicate_code"
  ],
  "severity_threshold": "high",
  "include_recommendations": true,
  "include_examples": true,
  "generate_refactoring_plan": true
}
```

**Use Case:** Identify high-severity anti-patterns in legacy code to prioritize refactoring efforts before migration.

---

### analyze_mainframe_integration

Analyze JCL jobs, CICS transactions, and DB2 integration. Maps transaction flows, job dependencies, and database access patterns.

**Parameters:**
- `jcl_files` (optional): Array of JCL job files to analyze
- `cics_programs` (optional): Array of CICS program files to analyze
- `db2_schemas` (optional): Array of DB2 schema files or DDL
- `analyze_job_dependencies` (optional): Analyze JCL job dependencies and scheduling (default: true)
- `analyze_cics_transactions` (optional): Map CICS transaction flows (default: true)
- `extract_db2_queries` (optional): Extract and analyze DB2 SQL queries (default: true)
- `include_resource_usage` (optional): Include resource usage analysis (default: true)
- `generate_integration_map` (optional): Generate visual integration map (default: true)

**Example:**
```json
{
  "jcl_files": [
    "/jcl/DAILY001.jcl",
    "/jcl/MONTHLY.jcl"
  ],
  "cics_programs": [
    "/cics/CUSTINQ.cbl",
    "/cics/ORDPROC.cbl"
  ],
  "db2_schemas": [
    "/db2/CUSTOMER.ddl",
    "/db2/ORDERS.ddl"
  ],
  "analyze_job_dependencies": true,
  "analyze_cics_transactions": true,
  "extract_db2_queries": true,
  "generate_integration_map": true
}
```

**Use Case:** Map the complete mainframe integration landscape including batch jobs, online transactions, and database access.

---

### suggest_modernization_path

Recommend migration strategies and target technologies based on codebase analysis. Provides phased migration plans, effort estimates, and risk assessments.

**Parameters:**
- `analysis_results` (required): Results from analyze_legacy_codebase tool
- `target_platform_preferences` (optional): Object with preferences:
  - `cloud_provider` (optional): "aws", "azure", "gcp", "on_premise", "hybrid"
  - `target_languages` (optional): Array of preferred languages - "java", "python", "csharp", "javascript", "go", "kotlin"
  - `architecture_style` (optional): "microservices", "monolith", "serverless", "hybrid"
  - `database_preference` (optional): "postgresql", "mysql", "mongodb", "dynamodb", "cosmos_db", "oracle"
- `constraints` (optional): Object with constraints:
  - `budget` (optional): "low", "medium", "high", "unlimited"
  - `timeline` (optional): "aggressive", "moderate", "conservative"
  - `risk_tolerance` (optional): "low", "medium", "high"
- `include_cost_benefit` (optional): Include cost-benefit analysis (default: true)
- `include_phased_plan` (optional): Generate phased migration plan (default: true)
- `include_technology_comparison` (optional): Compare technology options (default: true)

**Example:**
```json
{
  "analysis_results": {
    "total_files": 850,
    "total_loc": 450000,
    "complexity_score": 8.5,
    "languages": ["cobol", "jcl"]
  },
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
  "include_phased_plan": true,
  "include_technology_comparison": true
}
```

**Use Case:** Get AI-powered recommendations for migrating a large COBOL system to modern cloud-native architecture.

---

### extract_copybooks

Parse and document COBOL copybooks and their usage across the codebase. Provides structured data definitions and impact analysis.

**Parameters:**
- `copybook_files` (required): Array of COBOL copybook files to parse
- `analyze_usage` (optional): Analyze copybook usage across codebase (default: true)
- `extract_nested_structures` (optional): Parse nested data structures (default: true)
- `generate_documentation` (optional): Generate field-level documentation (default: true)
- `output_format` (optional): Output format - "json", "yaml", "markdown", "xml", "json_schema" (default: "json")
- `include_impact_analysis` (optional): Include impact analysis for changes (default: true)
- `map_to_modern_types` (optional): Map COBOL types to modern equivalents (default: false)

**Example:**
```json
{
  "copybook_files": [
    "/copy/CUSTOMER.cpy",
    "/copy/ACCOUNT.cpy",
    "/copy/TRANSACTION.cpy"
  ],
  "analyze_usage": true,
  "extract_nested_structures": true,
  "generate_documentation": true,
  "output_format": "json_schema",
  "include_impact_analysis": true,
  "map_to_modern_types": true
}
```

**Use Case:** Document all copybook structures and identify which programs would be affected by changing a copybook field.

---

### analyze_batch_jobs

Analyze batch job dependencies, scheduling requirements, and resource usage. Identifies critical paths and parallel execution opportunities.

**Parameters:**
- `jcl_job_streams` (required): Array of JCL job stream files to analyze
- `include_dependencies` (optional): Analyze job dependencies (default: true)
- `include_scheduling` (optional): Extract scheduling requirements (default: true)
- `include_resource_usage` (optional): Analyze resource usage patterns (default: true)
- `identify_critical_path` (optional): Identify critical path in job streams (default: true)
- `suggest_parallelization` (optional): Suggest parallel execution opportunities (default: true)
- `generate_dependency_graph` (optional): Generate job dependency graph (default: true)
- `output_format` (optional): Output format - "json", "yaml", "mermaid", "graphviz" (default: "json")

**Example:**
```json
{
  "jcl_job_streams": [
    "/jcl/NIGHTLY.jcl",
    "/jcl/WEEKLY.jcl",
    "/jcl/MONTHLY.jcl"
  ],
  "include_dependencies": true,
  "include_scheduling": true,
  "identify_critical_path": true,
  "suggest_parallelization": true,
  "generate_dependency_graph": true,
  "output_format": "mermaid"
}
```

**Use Case:** Optimize batch processing windows by identifying parallelization opportunities and critical path bottlenecks.

---

### map_legacy_database

Map legacy database structures (VSAM, IMS, DB2) including schemas, relationships, and access patterns.

**Parameters:**
- `database_type` (required): Type of legacy database - "vsam", "ims", "db2", "idms", "adabas", "mixed"
- `connection_details` (optional): Object with connection information:
  - `host` (optional): Database host
  - `port` (optional): Database port
  - `database_name` (optional): Database name
  - `schema_files` (optional): Array of schema definition files (DDL, copybooks)
- `analyze_relationships` (optional): Infer relationships between tables/files (default: true)
- `analyze_access_patterns` (optional): Analyze data access patterns from code (default: true)
- `include_data_profiling` (optional): Include data profiling and statistics (default: false)
- `generate_erd` (optional): Generate Entity-Relationship Diagram (default: true)
- `output_format` (optional): Output format - "json", "yaml", "markdown", "mermaid", "dbml" (default: "json")

**Example:**
```json
{
  "database_type": "db2",
  "connection_details": {
    "schema_files": [
      "/db2/CUSTOMER.ddl",
      "/db2/ORDERS.ddl",
      "/db2/PRODUCTS.ddl"
    ]
  },
  "analyze_relationships": true,
  "analyze_access_patterns": true,
  "include_data_profiling": true,
  "generate_erd": true,
  "output_format": "mermaid"
}
```

**Use Case:** Document legacy database schema and relationships to design modern database architecture.

---

### generate_migration_report

Generate comprehensive migration assessment report combining all analysis results. Includes executive summary, technical details, risk matrix, and timeline estimates.

**Parameters:**
- `codebase_analysis` (optional): Results from analyze_legacy_codebase
- `business_logic_analysis` (optional): Results from extract_business_logic
- `pattern_analysis` (optional): Results from detect_legacy_patterns
- `modernization_recommendations` (optional): Results from suggest_modernization_path
- `report_format` (optional): Output format - "pdf", "html", "markdown", "docx" (default: "html")
- `include_executive_summary` (optional): Include executive summary (default: true)
- `include_technical_details` (optional): Include detailed technical analysis (default: true)
- `include_risk_matrix` (optional): Include risk assessment matrix (default: true)
- `include_timeline` (optional): Include estimated timeline and milestones (default: true)
- `include_cost_estimates` (optional): Include cost estimates (default: true)
- `include_recommendations` (optional): Include actionable recommendations (default: true)
- `detail_level` (optional): Level of detail - "executive", "technical", "comprehensive" (default: "comprehensive")

**Example:**
```json
{
  "codebase_analysis": {
    "total_files": 850,
    "complexity_score": 8.5
  },
  "business_logic_analysis": {
    "rules_extracted": 245
  },
  "pattern_analysis": {
    "critical_issues": 12
  },
  "modernization_recommendations": {
    "recommended_approach": "strangler_fig"
  },
  "report_format": "pdf",
  "include_executive_summary": true,
  "include_technical_details": true,
  "include_risk_matrix": true,
  "include_timeline": true,
  "include_cost_estimates": true,
  "detail_level": "comprehensive"
}
```

**Use Case:** Generate a comprehensive migration assessment report for executive decision-making and project planning.

---

## Migration Workflow Examples

### Complete Legacy System Analysis

```bash
# Step 1: Analyze the entire codebase
analyze_legacy_codebase({
  "repository_path": "/mainframe/insurance-system",
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
  "analysis_results": {...},
  "target_platform_preferences": {
    "cloud_provider": "aws",
    "target_languages": ["java"],
    "architecture_style": "microservices"
  }
})

# Step 6: Generate comprehensive report
generate_migration_report({
  "codebase_analysis": {...},
  "report_format": "pdf",
  "detail_level": "comprehensive"
})
```

### Copybook Documentation and Impact Analysis

```bash
# Extract and document all copybooks
extract_copybooks({
  "copybook_files": ["/copy/*.cpy"],
  "analyze_usage": true,
  "output_format": "json_schema",
  "map_to_modern_types": true
})
```

### Batch Job Optimization

```bash
# Analyze batch jobs for optimization
analyze_batch_jobs({
  "jcl_job_streams": ["/jcl/NIGHTLY.jcl"],
  "identify_critical_path": true,
  "suggest_parallelization": true,
  "output_format": "mermaid"
})
```

- `complexity_threshold` (optional): Complexity threshold - "low", "medium", "high" (default: "medium")

**Example:**
```json
{
  "source_code": "Large COBOL batch processing system with 50+ programs",
  "source_language": "cobol",
  "target_language": "python",
  "migration_strategy": "strangler_fig",
  "include_risk_analysis": true,
  "include_timeline": true,
  "complexity_threshold": "high"
}
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "sytra-legacy": {
      "command": "node",
      "args": ["/path/to/mcp-servers/legacy-support/dist/index.js"],
      "env": {
        "LEGACY_API_URL": "http://localhost:8007"
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

The server communicates with these Legacy Support API endpoints:

### Core Tools
- `POST /api/v1/legacy/parse/cobol` - Parse COBOL code
- `POST /api/v1/legacy/parse/fortran` - Parse Fortran code
- `POST /api/v1/legacy/translate/cobol-to-python` - Translate COBOL to Python
- `POST /api/v1/legacy/translate/cobol-to-java` - Translate COBOL to Java
- `POST /api/v1/legacy/analyze/dependencies` - Analyze dependencies
- `POST /api/v1/legacy/migration/plan` - Generate migration plan

### Advanced Analysis Tools
- `POST /api/v1/legacy/analyze/codebase` - Deep codebase analysis
- `POST /api/v1/legacy/extract/business-logic` - Extract business logic
- `POST /api/v1/legacy/visualize/data-flow` - Visualize data flow
- `POST /api/v1/legacy/detect/patterns` - Detect legacy patterns
- `POST /api/v1/legacy/analyze/mainframe` - Analyze mainframe integration
- `POST /api/v1/legacy/suggest/modernization` - Suggest modernization path
- `POST /api/v1/legacy/extract/copybooks` - Extract copybooks
- `POST /api/v1/legacy/analyze/batch-jobs` - Analyze batch jobs
- `POST /api/v1/legacy/map/database` - Map legacy database
- `POST /api/v1/legacy/generate/migration-report` - Generate migration report

## License

MIT