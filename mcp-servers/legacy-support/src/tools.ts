import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "parse_cobol",
    description: "Parse COBOL code to extract structure, data definitions, and program logic. Provides detailed AST and analysis.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The COBOL code to parse"
        },
        include_ast: {
          type: "boolean",
          description: "Include abstract syntax tree in output",
          default: true
        },
        extract_data_division: {
          type: "boolean",
          description: "Extract data division details",
          default: true
        },
        extract_procedure_division: {
          type: "boolean",
          description: "Extract procedure division details",
          default: true
        },
        identify_copybooks: {
          type: "boolean",
          description: "Identify COPY statements and dependencies",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "parse_fortran",
    description: "Parse Fortran code (F77, F90, F95) to extract structure, subroutines, and data types.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The Fortran code to parse"
        },
        fortran_version: {
          type: "string",
          enum: ["f77", "f90", "f95", "f2003", "f2008"],
          description: "Fortran version",
          default: "f90"
        },
        include_ast: {
          type: "boolean",
          description: "Include abstract syntax tree",
          default: true
        },
        extract_modules: {
          type: "boolean",
          description: "Extract module definitions",
          default: true
        },
        extract_subroutines: {
          type: "boolean",
          description: "Extract subroutine definitions",
          default: true
        }
      },
      required: ["code"]
    }
  },
  {
    name: "translate_cobol_to_python",
    description: "Translate COBOL code to Python, preserving business logic and data structures.",
    inputSchema: {
      type: "object",
      properties: {
        cobol_code: {
          type: "string",
          description: "The COBOL code to translate"
        },
        target_python_version: {
          type: "string",
          description: "Target Python version (e.g., '3.9', '3.10', '3.11')",
          default: "3.11"
        },
        preserve_comments: {
          type: "boolean",
          description: "Preserve original comments",
          default: true
        },
        use_type_hints: {
          type: "boolean",
          description: "Add Python type hints",
          default: true
        },
        modernize_patterns: {
          type: "boolean",
          description: "Use modern Python patterns",
          default: true
        },
        include_tests: {
          type: "boolean",
          description: "Generate unit tests",
          default: false
        }
      },
      required: ["cobol_code"]
    }
  },
  {
    name: "translate_cobol_to_java",
    description: "Translate COBOL code to Java, maintaining business logic and creating appropriate class structures.",
    inputSchema: {
      type: "object",
      properties: {
        cobol_code: {
          type: "string",
          description: "The COBOL code to translate"
        },
        target_java_version: {
          type: "string",
          description: "Target Java version (e.g., '11', '17', '21')",
          default: "17"
        },
        package_name: {
          type: "string",
          description: "Java package name for generated classes"
        },
        use_spring: {
          type: "boolean",
          description: "Use Spring Framework patterns",
          default: false
        },
        preserve_comments: {
          type: "boolean",
          description: "Preserve original comments",
          default: true
        },
        generate_interfaces: {
          type: "boolean",
          description: "Generate interfaces for main components",
          default: true
        },
        include_tests: {
          type: "boolean",
          description: "Generate JUnit tests",
          default: false
        }
      },
      required: ["cobol_code"]
    }
  },
  {
    name: "analyze_dependencies",
    description: "Analyze code dependencies including COPY statements, CALL statements, and external references.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The legacy code to analyze"
        },
        language: {
          type: "string",
          enum: ["cobol", "fortran", "pl1", "rpg", "assembly"],
          description: "Source language",
          default: "cobol"
        },
        include_external_deps: {
          type: "boolean",
          description: "Include external dependencies",
          default: true
        },
        include_data_deps: {
          type: "boolean",
          description: "Include data dependencies",
          default: true
        },
        generate_graph: {
          type: "boolean",
          description: "Generate dependency graph",
          default: true
        },
        depth: {
          type: "integer",
          description: "Analysis depth for transitive dependencies",
          default: 3,
          minimum: 1,
          maximum: 10
        }
      },
      required: ["code"]
    }
  },
  {
    name: "generate_migration_plan",
    description: "Generate a comprehensive migration plan for legacy code modernization.",
    inputSchema: {
      type: "object",
      properties: {
        source_code: {
          type: "string",
          description: "The legacy source code or description"
        },
        source_language: {
          type: "string",
          enum: ["cobol", "fortran", "pl1", "rpg", "assembly"],
          description: "Source language"
        },
        target_language: {
          type: "string",
          enum: ["python", "java", "csharp", "javascript", "go"],
          description: "Target language"
        },
        migration_strategy: {
          type: "string",
          enum: ["big_bang", "incremental", "strangler_fig", "parallel_run"],
          description: "Migration strategy",
          default: "incremental"
        },
        include_risk_analysis: {
          type: "boolean",
          description: "Include risk analysis",
          default: true
        },
        include_timeline: {
          type: "boolean",
          description: "Include estimated timeline",
          default: true
        },
        include_resource_estimate: {
          type: "boolean",
          description: "Include resource estimates",
          default: true
        },
        complexity_threshold: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Complexity threshold for detailed analysis",
          default: "medium"
        }
      },
      required: ["source_code", "source_language", "target_language"]
    }
  },
  {
    name: "analyze_legacy_codebase",
    description: "Deep analysis of entire legacy codebases (700+ files). Provides comprehensive metrics, complexity scores, file relationships, and dependency graphs across multiple legacy languages.",
    inputSchema: {
      type: "object",
      properties: {
        repository_path: {
          type: "string",
          description: "Path to the legacy codebase repository"
        },
        languages: {
          type: "array",
          items: {
            type: "string",
            enum: ["cobol", "fortran", "assembly", "jcl", "rpg", "pl1", "rexx", "natural", "mumps", "pascal"]
          },
          description: "Languages to analyze in the codebase"
        },
        analysis_depth: {
          type: "string",
          enum: ["shallow", "medium", "deep", "comprehensive"],
          description: "Depth of analysis to perform",
          default: "medium"
        },
        include_metrics: {
          type: "boolean",
          description: "Include code metrics (LOC, complexity, maintainability)",
          default: true
        },
        include_dependencies: {
          type: "boolean",
          description: "Include dependency graph analysis",
          default: true
        },
        include_hotspots: {
          type: "boolean",
          description: "Identify complexity hotspots and problem areas",
          default: true
        },
        max_files: {
          type: "integer",
          description: "Maximum number of files to analyze (0 = unlimited)",
          default: 0,
          minimum: 0
        },
        incremental: {
          type: "boolean",
          description: "Use incremental analysis with caching",
          default: true
        }
      },
      required: ["repository_path", "languages"]
    }
  },
  {
    name: "extract_business_logic",
    description: "Extract business rules, validations, and calculations from legacy code. Identifies decision logic, validation rules, calculation formulas, and business constraints in structured format.",
    inputSchema: {
      type: "object",
      properties: {
        file_paths: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Paths to files containing business logic"
        },
        extraction_rules: {
          type: "object",
          properties: {
            extract_validations: {
              type: "boolean",
              description: "Extract validation rules",
              default: true
            },
            extract_calculations: {
              type: "boolean",
              description: "Extract calculation formulas",
              default: true
            },
            extract_decisions: {
              type: "boolean",
              description: "Extract decision logic and conditions",
              default: true
            },
            extract_constraints: {
              type: "boolean",
              description: "Extract business constraints",
              default: true
            }
          }
        },
        output_format: {
          type: "string",
          enum: ["json", "yaml", "markdown", "decision_table"],
          description: "Output format for extracted rules",
          default: "json"
        },
        include_context: {
          type: "boolean",
          description: "Include surrounding code context",
          default: true
        },
        generate_decision_trees: {
          type: "boolean",
          description: "Generate decision tree visualizations",
          default: false
        }
      },
      required: ["file_paths"]
    }
  },
  {
    name: "visualize_data_flow",
    description: "Generate data flow diagrams across multiple files. Tracks variable flow, I/O operations, database access, and file system interactions with Mermaid/PlantUML output.",
    inputSchema: {
      type: "object",
      properties: {
        entry_point: {
          type: "string",
          description: "Entry point file or function to start tracing"
        },
        trace_depth: {
          type: "integer",
          description: "Maximum depth to trace data flow",
          default: 5,
          minimum: 1,
          maximum: 20
        },
        include_io_operations: {
          type: "boolean",
          description: "Include file I/O and database operations",
          default: true
        },
        include_variable_flow: {
          type: "boolean",
          description: "Track variable assignments and transformations",
          default: true
        },
        include_external_calls: {
          type: "boolean",
          description: "Include external program calls",
          default: true
        },
        diagram_format: {
          type: "string",
          enum: ["mermaid", "plantuml", "graphviz", "d3"],
          description: "Output diagram format",
          default: "mermaid"
        },
        focus_variables: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Specific variables to focus on (optional)"
        },
        simplify_output: {
          type: "boolean",
          description: "Simplify diagram by removing trivial flows",
          default: false
        }
      },
      required: ["entry_point"]
    }
  },
  {
    name: "detect_legacy_patterns",
    description: "Identify common legacy anti-patterns and code smells. Detects GOTO spaghetti, global state abuse, tight coupling, and other maintainability issues with severity ratings.",
    inputSchema: {
      type: "object",
      properties: {
        file_paths: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Files to analyze for anti-patterns"
        },
        pattern_types: {
          type: "array",
          items: {
            type: "string",
            enum: ["goto_spaghetti", "global_state", "tight_coupling", "god_object", "magic_numbers", "dead_code", "duplicate_code", "long_methods", "deep_nesting", "cyclomatic_complexity"]
          },
          description: "Types of patterns to detect",
          default: ["goto_spaghetti", "global_state", "tight_coupling", "cyclomatic_complexity"]
        },
        severity_threshold: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Minimum severity to report",
          default: "medium"
        },
        include_recommendations: {
          type: "boolean",
          description: "Include refactoring recommendations",
          default: true
        },
        include_examples: {
          type: "boolean",
          description: "Include code examples of detected patterns",
          default: true
        },
        generate_refactoring_plan: {
          type: "boolean",
          description: "Generate prioritized refactoring plan",
          default: false
        }
      },
      required: ["file_paths"]
    }
  },
  {
    name: "analyze_mainframe_integration",
    description: "Analyze JCL jobs, CICS transactions, and DB2 integration. Maps transaction flows, job dependencies, and database access patterns in mainframe environments.",
    inputSchema: {
      type: "object",
      properties: {
        jcl_files: {
          type: "array",
          items: {
            type: "string"
          },
          description: "JCL job files to analyze"
        },
        cics_programs: {
          type: "array",
          items: {
            type: "string"
          },
          description: "CICS program files to analyze"
        },
        db2_schemas: {
          type: "array",
          items: {
            type: "string"
          },
          description: "DB2 schema files or DDL"
        },
        analyze_job_dependencies: {
          type: "boolean",
          description: "Analyze JCL job dependencies and scheduling",
          default: true
        },
        analyze_cics_transactions: {
          type: "boolean",
          description: "Map CICS transaction flows",
          default: true
        },
        extract_db2_queries: {
          type: "boolean",
          description: "Extract and analyze DB2 SQL queries",
          default: true
        },
        include_resource_usage: {
          type: "boolean",
          description: "Include resource usage analysis",
          default: true
        },
        generate_integration_map: {
          type: "boolean",
          description: "Generate visual integration map",
          default: true
        }
      },
      required: []
    }
  },
  {
    name: "suggest_modernization_path",
    description: "Recommend migration strategies and target technologies based on codebase analysis. Provides phased migration plans, effort estimates, and risk assessments.",
    inputSchema: {
      type: "object",
      properties: {
        analysis_results: {
          type: "object",
          description: "Results from analyze_legacy_codebase tool"
        },
        target_platform_preferences: {
          type: "object",
          properties: {
            cloud_provider: {
              type: "string",
              enum: ["aws", "azure", "gcp", "on_premise", "hybrid"],
              description: "Preferred cloud provider"
            },
            target_languages: {
              type: "array",
              items: {
                type: "string",
                enum: ["java", "python", "csharp", "javascript", "go", "kotlin"]
              },
              description: "Preferred target languages"
            },
            architecture_style: {
              type: "string",
              enum: ["microservices", "monolith", "serverless", "hybrid"],
              description: "Target architecture style"
            },
            database_preference: {
              type: "string",
              enum: ["postgresql", "mysql", "mongodb", "dynamodb", "cosmos_db", "oracle"],
              description: "Target database technology"
            }
          }
        },
        constraints: {
          type: "object",
          properties: {
            budget: {
              type: "string",
              enum: ["low", "medium", "high", "unlimited"],
              description: "Budget constraint"
            },
            timeline: {
              type: "string",
              enum: ["aggressive", "moderate", "conservative"],
              description: "Timeline constraint"
            },
            risk_tolerance: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Risk tolerance level"
            }
          }
        },
        include_cost_benefit: {
          type: "boolean",
          description: "Include cost-benefit analysis",
          default: true
        },
        include_phased_plan: {
          type: "boolean",
          description: "Generate phased migration plan",
          default: true
        },
        include_technology_comparison: {
          type: "boolean",
          description: "Compare technology options",
          default: true
        }
      },
      required: ["analysis_results"]
    }
  },
  {
    name: "extract_copybooks",
    description: "Parse and document COBOL copybooks and their usage across the codebase. Provides structured data definitions, field-level documentation, and impact analysis.",
    inputSchema: {
      type: "object",
      properties: {
        copybook_files: {
          type: "array",
          items: {
            type: "string"
          },
          description: "COBOL copybook files to parse"
        },
        analyze_usage: {
          type: "boolean",
          description: "Analyze copybook usage across codebase",
          default: true
        },
        extract_nested_structures: {
          type: "boolean",
          description: "Parse nested data structures",
          default: true
        },
        generate_documentation: {
          type: "boolean",
          description: "Generate field-level documentation",
          default: true
        },
        output_format: {
          type: "string",
          enum: ["json", "yaml", "markdown", "xml", "json_schema"],
          description: "Output format for copybook definitions",
          default: "json"
        },
        include_impact_analysis: {
          type: "boolean",
          description: "Include impact analysis for changes",
          default: true
        },
        map_to_modern_types: {
          type: "boolean",
          description: "Map COBOL types to modern equivalents",
          default: false
        }
      },
      required: ["copybook_files"]
    }
  },
  {
    name: "analyze_batch_jobs",
    description: "Analyze batch job dependencies, scheduling requirements, and resource usage. Identifies critical paths and parallel execution opportunities.",
    inputSchema: {
      type: "object",
      properties: {
        jcl_job_streams: {
          type: "array",
          items: {
            type: "string"
          },
          description: "JCL job stream files to analyze"
        },
        include_dependencies: {
          type: "boolean",
          description: "Analyze job dependencies",
          default: true
        },
        include_scheduling: {
          type: "boolean",
          description: "Extract scheduling requirements",
          default: true
        },
        include_resource_usage: {
          type: "boolean",
          description: "Analyze resource usage patterns",
          default: true
        },
        identify_critical_path: {
          type: "boolean",
          description: "Identify critical path in job streams",
          default: true
        },
        suggest_parallelization: {
          type: "boolean",
          description: "Suggest parallel execution opportunities",
          default: true
        },
        generate_dependency_graph: {
          type: "boolean",
          description: "Generate job dependency graph",
          default: true
        },
        output_format: {
          type: "string",
          enum: ["json", "yaml", "mermaid", "graphviz"],
          description: "Output format",
          default: "json"
        }
      },
      required: ["jcl_job_streams"]
    }
  },
  {
    name: "map_legacy_database",
    description: "Map legacy database structures (VSAM, IMS, DB2) including schemas, relationships, and access patterns. Supports multi-database environments.",
    inputSchema: {
      type: "object",
      properties: {
        database_type: {
          type: "string",
          enum: ["vsam", "ims", "db2", "idms", "adabas", "mixed"],
          description: "Type of legacy database"
        },
        connection_details: {
          type: "object",
          properties: {
            host: {
              type: "string",
              description: "Database host"
            },
            port: {
              type: "integer",
              description: "Database port"
            },
            database_name: {
              type: "string",
              description: "Database name"
            },
            schema_files: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Schema definition files (DDL, copybooks)"
            }
          }
        },
        analyze_relationships: {
          type: "boolean",
          description: "Infer relationships between tables/files",
          default: true
        },
        analyze_access_patterns: {
          type: "boolean",
          description: "Analyze data access patterns from code",
          default: true
        },
        include_data_profiling: {
          type: "boolean",
          description: "Include data profiling and statistics",
          default: false
        },
        generate_erd: {
          type: "boolean",
          description: "Generate Entity-Relationship Diagram",
          default: true
        },
        output_format: {
          type: "string",
          enum: ["json", "yaml", "markdown", "mermaid", "dbml"],
          description: "Output format for schema documentation",
          default: "json"
        }
      },
      required: ["database_type"]
    }
  },
  {
    name: "generate_migration_report",
    description: "Generate comprehensive migration assessment report combining all analysis results. Includes executive summary, technical details, risk matrix, and timeline estimates.",
    inputSchema: {
      type: "object",
      properties: {
        codebase_analysis: {
          type: "object",
          description: "Results from analyze_legacy_codebase"
        },
        business_logic_analysis: {
          type: "object",
          description: "Results from extract_business_logic"
        },
        pattern_analysis: {
          type: "object",
          description: "Results from detect_legacy_patterns"
        },
        modernization_recommendations: {
          type: "object",
          description: "Results from suggest_modernization_path"
        },
        report_format: {
          type: "string",
          enum: ["pdf", "html", "markdown", "docx"],
          description: "Output format for report",
          default: "html"
        },
        include_executive_summary: {
          type: "boolean",
          description: "Include executive summary",
          default: true
        },
        include_technical_details: {
          type: "boolean",
          description: "Include detailed technical analysis",
          default: true
        },
        include_risk_matrix: {
          type: "boolean",
          description: "Include risk assessment matrix",
          default: true
        },
        include_timeline: {
          type: "boolean",
          description: "Include estimated timeline and milestones",
          default: true
        },
        include_cost_estimates: {
          type: "boolean",
          description: "Include cost estimates",
          default: true
        },
        include_recommendations: {
          type: "boolean",
          description: "Include actionable recommendations",
          default: true
        },
        detail_level: {
          type: "string",
          enum: ["executive", "technical", "comprehensive"],
          description: "Level of detail in report",
          default: "comprehensive"
        }
      },
      required: []
    }
  }
];

// Made with Bob
