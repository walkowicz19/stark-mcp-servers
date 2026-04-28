import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "extract_schema",
    description: "Extract complete schema from a database including tables, columns, data types, constraints, indexes, views, and stored procedures. Supports PostgreSQL, MySQL, Oracle, MongoDB, Cassandra, DynamoDB, and Neo4j.",
    inputSchema: {
      type: "object",
      properties: {
        connection: {
          type: "object",
          description: "Database connection details",
          properties: {
            type: {
              type: "string",
              enum: ["postgresql", "mysql", "oracle", "mongodb", "cassandra", "dynamodb", "neo4j"],
              description: "Database type"
            },
            host: {
              type: "string",
              description: "Database host"
            },
            port: {
              type: "integer",
              description: "Database port"
            },
            database: {
              type: "string",
              description: "Database name"
            },
            username: {
              type: "string",
              description: "Database username"
            },
            password: {
              type: "string",
              description: "Database password"
            },
            ssl: {
              type: "boolean",
              description: "Use SSL connection",
              default: false
            },
            additional_params: {
              type: "object",
              description: "Additional database-specific connection parameters"
            }
          },
          required: ["type", "host", "database"]
        },
        options: {
          type: "object",
          description: "Extraction options",
          properties: {
            include_views: {
              type: "boolean",
              description: "Include database views",
              default: true
            },
            include_procedures: {
              type: "boolean",
              description: "Include stored procedures",
              default: true
            },
            include_triggers: {
              type: "boolean",
              description: "Include triggers",
              default: true
            },
            include_indexes: {
              type: "boolean",
              description: "Include index information",
              default: true
            },
            batch_size: {
              type: "integer",
              description: "Batch size for large schemas",
              default: 100,
              minimum: 10,
              maximum: 1000
            },
            timeout_seconds: {
              type: "integer",
              description: "Extraction timeout in seconds",
              default: 300,
              minimum: 30,
              maximum: 3600
            }
          }
        }
      },
      required: ["connection"]
    }
  },
  {
    name: "detect_relationships",
    description: "Automatically detect relationships between tables using foreign keys, naming conventions, and data overlap analysis. Calculates confidence scores for inferred relationships.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier from extract_schema"
        },
        detection_methods: {
          type: "array",
          items: {
            type: "string",
            enum: ["foreign_keys", "naming_conventions", "data_overlap", "junction_tables"]
          },
          description: "Methods to use for relationship detection",
          default: ["foreign_keys", "naming_conventions", "data_overlap"]
        },
        naming_patterns: {
          type: "object",
          description: "Custom naming patterns for relationship detection",
          properties: {
            foreign_key_suffix: {
              type: "string",
              description: "Foreign key column suffix (e.g., '_id')",
              default: "_id"
            },
            junction_table_pattern: {
              type: "string",
              description: "Junction table naming pattern (regex)"
            }
          }
        },
        min_confidence: {
          type: "number",
          description: "Minimum confidence score for inferred relationships (0-1)",
          default: 0.7,
          minimum: 0,
          maximum: 1
        },
        analyze_data_sample: {
          type: "boolean",
          description: "Analyze data samples for overlap detection",
          default: true
        },
        sample_size: {
          type: "integer",
          description: "Number of rows to sample for data analysis",
          default: 1000,
          minimum: 100,
          maximum: 10000
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "analyze_query_patterns",
    description: "Analyze query logs to detect N+1 patterns, identify hot tables/columns, and find performance bottlenecks. Supports query logs from all major databases.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        query_log: {
          type: "object",
          description: "Query log source",
          properties: {
            source_type: {
              type: "string",
              enum: ["file", "database", "url"],
              description: "Query log source type"
            },
            source_path: {
              type: "string",
              description: "Path to query log file or database connection"
            },
            format: {
              type: "string",
              enum: ["postgresql", "mysql", "oracle", "mongodb", "generic"],
              description: "Query log format"
            },
            time_range: {
              type: "object",
              description: "Time range for analysis",
              properties: {
                start: {
                  type: "string",
                  description: "Start time (ISO 8601)"
                },
                end: {
                  type: "string",
                  description: "End time (ISO 8601)"
                }
              }
            }
          },
          required: ["source_type", "source_path", "format"]
        },
        analysis_options: {
          type: "object",
          description: "Analysis options",
          properties: {
            detect_n_plus_one: {
              type: "boolean",
              description: "Detect N+1 query patterns",
              default: true
            },
            identify_hot_tables: {
              type: "boolean",
              description: "Identify frequently accessed tables",
              default: true
            },
            analyze_slow_queries: {
              type: "boolean",
              description: "Analyze slow queries",
              default: true
            },
            slow_query_threshold_ms: {
              type: "integer",
              description: "Threshold for slow queries in milliseconds",
              default: 1000
            },
            min_query_count: {
              type: "integer",
              description: "Minimum query count for pattern detection",
              default: 10
            }
          }
        }
      },
      required: ["schema_id", "query_log"]
    }
  },
  {
    name: "suggest_indexes",
    description: "Analyze schema and query patterns to suggest optimal indexes. Considers query frequency, selectivity, and existing indexes to avoid redundancy.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        query_analysis_id: {
          type: "string",
          description: "Optional query analysis ID for query-based suggestions"
        },
        options: {
          type: "object",
          description: "Index suggestion options",
          properties: {
            consider_existing: {
              type: "boolean",
              description: "Consider existing indexes to avoid redundancy",
              default: true
            },
            max_suggestions: {
              type: "integer",
              description: "Maximum number of index suggestions",
              default: 20,
              minimum: 1,
              maximum: 100
            },
            min_impact_score: {
              type: "number",
              description: "Minimum impact score for suggestions (0-1)",
              default: 0.5,
              minimum: 0,
              maximum: 1
            },
            index_types: {
              type: "array",
              items: {
                type: "string",
                enum: ["btree", "hash", "gin", "gist", "brin", "covering"]
              },
              description: "Index types to consider"
            },
            consider_composite: {
              type: "boolean",
              description: "Consider composite indexes",
              default: true
            },
            max_columns_per_index: {
              type: "integer",
              description: "Maximum columns in composite indexes",
              default: 3,
              minimum: 1,
              maximum: 10
            }
          }
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "profile_data",
    description: "Profile data in tables to understand cardinality, null percentages, data distributions, and data quality issues. Useful for understanding data characteristics.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        tables: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Specific tables to profile (empty for all tables)"
        },
        profiling_options: {
          type: "object",
          description: "Data profiling options",
          properties: {
            calculate_cardinality: {
              type: "boolean",
              description: "Calculate column cardinality",
              default: true
            },
            detect_patterns: {
              type: "boolean",
              description: "Detect data patterns (emails, phones, etc.)",
              default: true
            },
            analyze_distributions: {
              type: "boolean",
              description: "Analyze value distributions",
              default: true
            },
            check_data_quality: {
              type: "boolean",
              description: "Check for data quality issues",
              default: true
            },
            sample_size: {
              type: "integer",
              description: "Sample size for analysis",
              default: 10000,
              minimum: 100,
              maximum: 100000
            },
            include_statistics: {
              type: "boolean",
              description: "Include statistical measures (mean, median, std dev)",
              default: true
            }
          }
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "generate_erd",
    description: "Generate Entity-Relationship Diagram (ERD) in Mermaid format. Visualizes tables, columns, relationships, and cardinality with customizable styling.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        options: {
          type: "object",
          description: "ERD generation options",
          properties: {
            format: {
              type: "string",
              enum: ["mermaid", "plantuml", "graphviz"],
              description: "Diagram format",
              default: "mermaid"
            },
            include_columns: {
              type: "boolean",
              description: "Include column details in diagram",
              default: true
            },
            include_data_types: {
              type: "boolean",
              description: "Include data types",
              default: true
            },
            include_constraints: {
              type: "boolean",
              description: "Include constraints (PK, FK, unique)",
              default: true
            },
            show_cardinality: {
              type: "boolean",
              description: "Show relationship cardinality",
              default: true
            },
            tables: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Specific tables to include (empty for all)"
            },
            max_columns_per_table: {
              type: "integer",
              description: "Maximum columns to show per table",
              default: 10,
              minimum: 1,
              maximum: 50
            },
            group_by_schema: {
              type: "boolean",
              description: "Group tables by schema/namespace",
              default: false
            }
          }
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "generate_documentation",
    description: "Generate comprehensive Markdown documentation for the database schema. Includes table descriptions, column details, relationships, indexes, and data statistics.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        options: {
          type: "object",
          description: "Documentation generation options",
          properties: {
            include_erd: {
              type: "boolean",
              description: "Include ERD diagram",
              default: true
            },
            include_statistics: {
              type: "boolean",
              description: "Include data statistics",
              default: true
            },
            include_relationships: {
              type: "boolean",
              description: "Include relationship details",
              default: true
            },
            include_indexes: {
              type: "boolean",
              description: "Include index information",
              default: true
            },
            include_examples: {
              type: "boolean",
              description: "Include SQL query examples",
              default: true
            },
            group_by_category: {
              type: "boolean",
              description: "Group tables by category/domain",
              default: false
            },
            output_format: {
              type: "string",
              enum: ["markdown", "html", "pdf"],
              description: "Output format",
              default: "markdown"
            },
            template: {
              type: "string",
              description: "Custom documentation template name"
            }
          }
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "generate_migration",
    description: "Generate migration scripts for schema changes. Supports creating new tables, altering existing ones, and managing relationships safely.",
    inputSchema: {
      type: "object",
      properties: {
        source_schema_id: {
          type: "string",
          description: "Source schema identifier"
        },
        target_schema_id: {
          type: "string",
          description: "Target schema identifier (optional for new schema)"
        },
        migration_type: {
          type: "string",
          enum: ["create", "alter", "drop", "full_sync"],
          description: "Type of migration to generate"
        },
        options: {
          type: "object",
          description: "Migration generation options",
          properties: {
            database_type: {
              type: "string",
              enum: ["postgresql", "mysql", "oracle", "mongodb"],
              description: "Target database type for migration script"
            },
            include_data: {
              type: "boolean",
              description: "Include data migration",
              default: false
            },
            safe_mode: {
              type: "boolean",
              description: "Generate safe migrations with rollback",
              default: true
            },
            add_comments: {
              type: "boolean",
              description: "Add explanatory comments to migration",
              default: true
            },
            batch_size: {
              type: "integer",
              description: "Batch size for data migrations",
              default: 1000
            },
            generate_rollback: {
              type: "boolean",
              description: "Generate rollback script",
              default: true
            }
          }
        }
      },
      required: ["source_schema_id", "migration_type"]
    }
  },
  {
    name: "compare_schemas",
    description: "Compare two database schemas to identify differences in tables, columns, indexes, and relationships. Useful for schema drift detection and migration planning.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id_1: {
          type: "string",
          description: "First schema identifier"
        },
        schema_id_2: {
          type: "string",
          description: "Second schema identifier"
        },
        comparison_options: {
          type: "object",
          description: "Comparison options",
          properties: {
            compare_tables: {
              type: "boolean",
              description: "Compare table structures",
              default: true
            },
            compare_columns: {
              type: "boolean",
              description: "Compare column definitions",
              default: true
            },
            compare_indexes: {
              type: "boolean",
              description: "Compare indexes",
              default: true
            },
            compare_constraints: {
              type: "boolean",
              description: "Compare constraints",
              default: true
            },
            compare_relationships: {
              type: "boolean",
              description: "Compare relationships",
              default: true
            },
            ignore_case: {
              type: "boolean",
              description: "Ignore case in comparisons",
              default: false
            },
            show_only_differences: {
              type: "boolean",
              description: "Show only differences (not matches)",
              default: true
            }
          }
        }
      },
      required: ["schema_id_1", "schema_id_2"]
    }
  },
  {
    name: "get_schema_status",
    description: "Get the current status of a schema extraction or analysis job. Shows progress, estimated time remaining, and any errors.",
    inputSchema: {
      type: "object",
      properties: {
        job_id: {
          type: "string",
          description: "Job identifier from extraction or analysis operation"
        },
        include_details: {
          type: "boolean",
          description: "Include detailed progress information",
          default: true
        }
      },
      required: ["job_id"]
    }
  },
  {
    name: "list_schemas",
    description: "List all extracted schemas with metadata including database type, extraction date, table count, and analysis status.",
    inputSchema: {
      type: "object",
      properties: {
        filters: {
          type: "object",
          description: "Filters for schema list",
          properties: {
            database_type: {
              type: "string",
              enum: ["postgresql", "mysql", "oracle", "mongodb", "cassandra", "dynamodb", "neo4j"],
              description: "Filter by database type"
            },
            min_table_count: {
              type: "integer",
              description: "Minimum number of tables"
            },
            max_table_count: {
              type: "integer",
              description: "Maximum number of tables"
            },
            has_relationships: {
              type: "boolean",
              description: "Filter schemas with detected relationships"
            },
            has_analysis: {
              type: "boolean",
              description: "Filter schemas with query analysis"
            }
          }
        },
        sort_by: {
          type: "string",
          enum: ["name", "date", "table_count", "size"],
          description: "Sort order",
          default: "date"
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 50,
          minimum: 1,
          maximum: 500
        }
      }
    }
  },
  {
    name: "delete_schema",
    description: "Delete an extracted schema and all associated analysis data. This operation cannot be undone.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier to delete"
        },
        confirm: {
          type: "boolean",
          description: "Confirmation flag (must be true)",
          default: false
        }
      },
      required: ["schema_id", "confirm"]
    }
  }
];

// Made with Bob