import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "store_memory",
    description: "Store information in memory for later retrieval. Supports different memory types (short-term, long-term, episodic) and automatic embedding generation for semantic search.",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The content to store in memory"
        },
        memory_type: {
          type: "string",
          enum: ["short_term", "long_term", "episodic"],
          description: "Type of memory to store",
          default: "short_term"
        },
        metadata: {
          type: "object",
          description: "Additional metadata to associate with the memory",
          properties: {
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Tags for categorization"
            },
            importance: {
              type: "number",
              description: "Importance score (0-1)",
              minimum: 0,
              maximum: 1
            },
            context: {
              type: "string",
              description: "Contextual information"
            }
          }
        },
        session_id: {
          type: "string",
          description: "Session identifier for grouping related memories"
        }
      },
      required: ["content"]
    }
  },
  {
    name: "retrieve_memory",
    description: "Retrieve relevant memories based on a query. Uses semantic search to find the most relevant stored information.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The query to search for in memory"
        },
        memory_type: {
          type: "string",
          enum: ["short_term", "long_term", "episodic", "all"],
          description: "Type of memory to search",
          default: "all"
        },
        limit: {
          type: "integer",
          description: "Maximum number of memories to retrieve",
          default: 5,
          minimum: 1,
          maximum: 50
        },
        min_relevance: {
          type: "number",
          description: "Minimum relevance score (0-1)",
          default: 0.5,
          minimum: 0,
          maximum: 1
        },
        session_id: {
          type: "string",
          description: "Filter by session identifier"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "search_memory",
    description: "Perform semantic search across all stored memories. Returns memories ranked by relevance with similarity scores.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query"
        },
        filters: {
          type: "object",
          description: "Filters to apply to the search",
          properties: {
            memory_type: {
              type: "array",
              items: {
                type: "string",
                enum: ["short_term", "long_term", "episodic"]
              },
              description: "Filter by memory types"
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter by tags"
            },
            date_range: {
              type: "object",
              properties: {
                start: { type: "string", format: "date-time" },
                end: { type: "string", format: "date-time" }
              },
              description: "Filter by date range"
            },
            min_importance: {
              type: "number",
              description: "Minimum importance score",
              minimum: 0,
              maximum: 1
            }
          }
        },
        limit: {
          type: "integer",
          description: "Maximum number of results",
          default: 10,
          minimum: 1,
          maximum: 100
        }
      },
      required: ["query"]
    }
  },
  {
    name: "compress_context",
    description: "Compress context for efficiency while preserving key information. Uses intelligent summarization to reduce token count.",
    inputSchema: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "The context to compress"
        },
        target_ratio: {
          type: "number",
          description: "Target compression ratio (0-1, where 0.5 means 50% of original size)",
          default: 0.5,
          minimum: 0.1,
          maximum: 0.9
        },
        preserve_entities: {
          type: "boolean",
          description: "Whether to preserve named entities",
          default: true
        },
        preserve_numbers: {
          type: "boolean",
          description: "Whether to preserve numerical data",
          default: true
        },
        strategy: {
          type: "string",
          enum: ["extractive", "abstractive", "hybrid"],
          description: "Compression strategy to use",
          default: "hybrid"
        }
      },
      required: ["context"]
    }
  },
  {
    name: "get_session_history",
    description: "Get the history of a session including all stored memories and interactions.",
    inputSchema: {
      type: "object",
      properties: {
        session_id: {
          type: "string",
          description: "The session identifier"
        },
        include_metadata: {
          type: "boolean",
          description: "Whether to include metadata in the response",
          default: true
        },
        limit: {
          type: "integer",
          description: "Maximum number of history items to retrieve",
          default: 50,
          minimum: 1,
          maximum: 500
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order by timestamp",
          default: "desc"
        }
      },
      required: ["session_id"]
    }
  },
  // NEW LARGE-SCALE CONTEXT HANDLING TOOLS
  {
    name: "store_large_codebase_context",
    description: "Store context from large repository analysis (50GB+, 700+ files). Automatically chunks, deduplicates, and compresses codebase data including file contents, dependencies, complexity metrics, and search indexes.",
    inputSchema: {
      type: "object",
      properties: {
        repository_id: {
          type: "string",
          description: "Unique identifier for the repository"
        },
        analysis_results: {
          type: "object",
          description: "Repository analysis results",
          properties: {
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  content: { type: "string" },
                  language: { type: "string" },
                  size: { type: "integer" },
                  complexity: { type: "number" },
                  dependencies: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              description: "Array of file analysis results"
            },
            dependencies: {
              type: "object",
              description: "Dependency graph and relationships"
            },
            metrics: {
              type: "object",
              description: "Overall codebase metrics",
              properties: {
                total_files: { type: "integer" },
                total_lines: { type: "integer" },
                languages: {
                  type: "object",
                  additionalProperties: { type: "integer" }
                },
                complexity_score: { type: "number" }
              }
            },
            search_index: {
              type: "object",
              description: "Pre-built search index for fast retrieval"
            }
          }
        },
        metadata: {
          type: "object",
          description: "Repository metadata",
          properties: {
            name: { type: "string" },
            version: { type: "string" },
            description: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            analysis_timestamp: { type: "string", format: "date-time" }
          }
        },
        storage_options: {
          type: "object",
          description: "Storage optimization options",
          properties: {
            enable_compression: {
              type: "boolean",
              default: true,
              description: "Enable automatic compression"
            },
            enable_deduplication: {
              type: "boolean",
              default: true,
              description: "Enable content deduplication"
            },
            chunk_size: {
              type: "integer",
              default: 10000,
              description: "Size of chunks for large files (in lines)"
            },
            tier: {
              type: "string",
              enum: ["hot", "warm", "cold"],
              default: "warm",
              description: "Storage tier for access optimization"
            }
          }
        }
      },
      required: ["repository_id", "analysis_results"]
    }
  },
  {
    name: "retrieve_codebase_context",
    description: "Retrieve relevant codebase context with smart filtering and semantic search. Returns file snippets, dependencies, and related code ranked by relevance.",
    inputSchema: {
      type: "object",
      properties: {
        repository_id: {
          type: "string",
          description: "Repository identifier"
        },
        query: {
          type: "string",
          description: "Search query or description of needed context"
        },
        filters: {
          type: "object",
          description: "Filters to narrow down results",
          properties: {
            file_patterns: {
              type: "array",
              items: { type: "string" },
              description: "File path patterns (glob syntax)"
            },
            languages: {
              type: "array",
              items: { type: "string" },
              description: "Programming languages to include"
            },
            complexity_range: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" }
              },
              description: "Filter by complexity score range"
            },
            has_dependencies: {
              type: "boolean",
              description: "Only include files with dependencies"
            },
            modified_after: {
              type: "string",
              format: "date-time",
              description: "Only include files modified after this date"
            }
          }
        },
        max_results: {
          type: "integer",
          default: 50,
          minimum: 1,
          maximum: 500,
          description: "Maximum number of results to return"
        },
        include_dependencies: {
          type: "boolean",
          default: true,
          description: "Include dependency information"
        },
        include_related: {
          type: "boolean",
          default: true,
          description: "Include related code snippets"
        },
        min_relevance: {
          type: "number",
          default: 0.6,
          minimum: 0,
          maximum: 1,
          description: "Minimum relevance score"
        }
      },
      required: ["repository_id", "query"]
    }
  },
  {
    name: "store_schema_context",
    description: "Store database schema analysis context including tables, columns, indexes, relationships, and query patterns. Preserves relationship graphs and ERD information.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Unique identifier for the schema"
        },
        database_type: {
          type: "string",
          enum: ["postgresql", "mysql", "oracle", "sqlserver", "mongodb", "cassandra", "other"],
          description: "Type of database system"
        },
        schema_data: {
          type: "object",
          description: "Complete schema information",
          properties: {
            tables: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  schema: { type: "string" },
                  columns: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        nullable: { type: "boolean" },
                        default_value: { type: "string" },
                        constraints: {
                          type: "array",
                          items: { type: "string" }
                        }
                      }
                    }
                  },
                  indexes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        columns: {
                          type: "array",
                          items: { type: "string" }
                        },
                        unique: { type: "boolean" },
                        type: { type: "string" }
                      }
                    }
                  },
                  row_count: { type: "integer" },
                  size_mb: { type: "number" }
                }
              },
              description: "Array of table definitions"
            },
            relationships: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  from_table: { type: "string" },
                  from_column: { type: "string" },
                  to_table: { type: "string" },
                  to_column: { type: "string" },
                  relationship_type: {
                    type: "string",
                    enum: ["one-to-one", "one-to-many", "many-to-many"]
                  }
                }
              },
              description: "Foreign key relationships"
            },
            query_patterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  frequency: { type: "integer" },
                  avg_execution_time_ms: { type: "number" },
                  tables_involved: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              description: "Common query patterns and performance"
            },
            erd_data: {
              type: "object",
              description: "Entity-Relationship Diagram data"
            }
          }
        },
        metadata: {
          type: "object",
          description: "Schema metadata",
          properties: {
            database_name: { type: "string" },
            version: { type: "string" },
            description: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            analysis_timestamp: { type: "string", format: "date-time" }
          }
        }
      },
      required: ["schema_id", "database_type", "schema_data"]
    }
  },
  {
    name: "retrieve_schema_context",
    description: "Retrieve schema context with relationship awareness. Supports relationship traversal, query pattern matching, and returns optimization suggestions.",
    inputSchema: {
      type: "object",
      properties: {
        schema_id: {
          type: "string",
          description: "Schema identifier"
        },
        query: {
          type: "string",
          description: "Search query for tables, columns, or relationships"
        },
        filters: {
          type: "object",
          description: "Filters for schema retrieval",
          properties: {
            table_names: {
              type: "array",
              items: { type: "string" },
              description: "Specific tables to include"
            },
            schemas: {
              type: "array",
              items: { type: "string" },
              description: "Database schemas to include"
            },
            has_relationships: {
              type: "boolean",
              description: "Only include tables with relationships"
            },
            min_row_count: {
              type: "integer",
              description: "Minimum row count"
            },
            column_types: {
              type: "array",
              items: { type: "string" },
              description: "Filter by column data types"
            }
          }
        },
        include_relationships: {
          type: "boolean",
          default: true,
          description: "Include relationship graph"
        },
        relationship_depth: {
          type: "integer",
          default: 2,
          minimum: 1,
          maximum: 5,
          description: "Depth of relationship traversal"
        },
        include_query_patterns: {
          type: "boolean",
          default: true,
          description: "Include common query patterns"
        },
        include_optimization_suggestions: {
          type: "boolean",
          default: true,
          description: "Include optimization recommendations"
        },
        max_results: {
          type: "integer",
          default: 50,
          minimum: 1,
          maximum: 200,
          description: "Maximum number of tables to return"
        }
      },
      required: ["schema_id"]
    }
  },
  {
    name: "store_legacy_context",
    description: "Store legacy system analysis context including COBOL programs, copybooks, JCL jobs, and business rules. Extracts and preserves business logic and data flows.",
    inputSchema: {
      type: "object",
      properties: {
        system_id: {
          type: "string",
          description: "Unique identifier for the legacy system"
        },
        language: {
          type: "string",
          enum: ["cobol", "fortran", "pl1", "assembler", "rpg", "natural", "other"],
          description: "Primary programming language"
        },
        analysis_results: {
          type: "object",
          description: "Legacy system analysis results",
          properties: {
            programs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  source_code: { type: "string" },
                  business_logic: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        location: { type: "string" },
                        complexity: { type: "string" }
                      }
                    }
                  },
                  data_flows: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        source: { type: "string" },
                        destination: { type: "string" },
                        transformation: { type: "string" }
                      }
                    }
                  },
                  dependencies: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              description: "Program analysis results"
            },
            copybooks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  content: { type: "string" },
                  data_structures: {
                    type: "array",
                    items: { type: "object" }
                  },
                  used_by: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              },
              description: "Copybook definitions"
            },
            jcl_jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  content: { type: "string" },
                  steps: {
                    type: "array",
                    items: { type: "object" }
                  },
                  schedule: { type: "string" }
                }
              },
              description: "JCL job definitions"
            },
            business_rules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  rule_id: { type: "string" },
                  description: { type: "string" },
                  implementation: { type: "string" },
                  programs: {
                    type: "array",
                    items: { type: "string" }
                  },
                  priority: { type: "string" }
                }
              },
              description: "Extracted business rules"
            }
          }
        },
        metadata: {
          type: "object",
          description: "System metadata",
          properties: {
            system_name: { type: "string" },
            platform: { type: "string" },
            description: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            analysis_timestamp: { type: "string", format: "date-time" },
            migration_notes: { type: "string" }
          }
        }
      },
      required: ["system_id", "language", "analysis_results"]
    }
  },
  {
    name: "retrieve_legacy_context",
    description: "Retrieve legacy system context with business logic focus. Supports business rule search, data flow tracking, and returns migration recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        system_id: {
          type: "string",
          description: "Legacy system identifier"
        },
        query: {
          type: "string",
          description: "Search query for programs, business logic, or data flows"
        },
        filters: {
          type: "object",
          description: "Filters for legacy context retrieval",
          properties: {
            program_names: {
              type: "array",
              items: { type: "string" },
              description: "Specific programs to include"
            },
            program_types: {
              type: "array",
              items: { type: "string" },
              description: "Types of programs (batch, online, etc.)"
            },
            has_business_rules: {
              type: "boolean",
              description: "Only include programs with business rules"
            },
            copybook_names: {
              type: "array",
              items: { type: "string" },
              description: "Specific copybooks to include"
            },
            complexity: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Filter by complexity level"
            }
          }
        },
        focus_areas: {
          type: "array",
          items: {
            type: "string",
            enum: ["business_logic", "data_flows", "dependencies", "copybooks", "jcl_jobs"]
          },
          description: "Areas to focus on in retrieval"
        },
        include_migration_notes: {
          type: "boolean",
          default: true,
          description: "Include migration recommendations"
        },
        include_data_lineage: {
          type: "boolean",
          default: true,
          description: "Include data lineage information"
        },
        max_results: {
          type: "integer",
          default: 50,
          minimum: 1,
          maximum: 200,
          description: "Maximum number of programs to return"
        }
      },
      required: ["system_id"]
    }
  },
  {
    name: "prioritize_context",
    description: "Rank context items by relevance and importance using multiple criteria. Supports relevance scoring, recency weighting, and usage tracking.",
    inputSchema: {
      type: "object",
      properties: {
        context_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of context IDs to prioritize"
        },
        prioritization_criteria: {
          type: "object",
          description: "Criteria for prioritization",
          properties: {
            relevance_weight: {
              type: "number",
              default: 0.4,
              minimum: 0,
              maximum: 1,
              description: "Weight for relevance score"
            },
            recency_weight: {
              type: "number",
              default: 0.3,
              minimum: 0,
              maximum: 1,
              description: "Weight for recency"
            },
            frequency_weight: {
              type: "number",
              default: 0.2,
              minimum: 0,
              maximum: 1,
              description: "Weight for access frequency"
            },
            importance_weight: {
              type: "number",
              default: 0.1,
              minimum: 0,
              maximum: 1,
              description: "Weight for importance score"
            },
            query: {
              type: "string",
              description: "Query for relevance calculation"
            },
            time_decay_factor: {
              type: "number",
              default: 0.5,
              minimum: 0,
              maximum: 1,
              description: "How quickly recency score decays"
            }
          }
        },
        return_scores: {
          type: "boolean",
          default: true,
          description: "Include detailed scores in response"
        },
        limit: {
          type: "integer",
          default: 100,
          minimum: 1,
          maximum: 1000,
          description: "Maximum number of prioritized items to return"
        }
      },
      required: ["context_ids"]
    }
  },
  {
    name: "merge_contexts",
    description: "Merge multiple context sources intelligently with conflict resolution and deduplication. Preserves relationships and handles different merge strategies.",
    inputSchema: {
      type: "object",
      properties: {
        context_ids: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          description: "Array of context IDs to merge (minimum 2)"
        },
        merge_strategy: {
          type: "string",
          enum: ["union", "intersection", "weighted", "priority_based"],
          default: "weighted",
          description: "Strategy for merging contexts"
        },
        merge_options: {
          type: "object",
          description: "Options for merge operation",
          properties: {
            enable_deduplication: {
              type: "boolean",
              default: true,
              description: "Remove duplicate content"
            },
            preserve_relationships: {
              type: "boolean",
              default: true,
              description: "Maintain relationship integrity"
            },
            conflict_resolution: {
              type: "string",
              enum: ["keep_first", "keep_last", "keep_newest", "keep_highest_priority"],
              default: "keep_newest",
              description: "How to resolve conflicts"
            },
            weights: {
              type: "array",
              items: { type: "number" },
              description: "Weights for each context (for weighted strategy)"
            },
            priority_order: {
              type: "array",
              items: { type: "string" },
              description: "Priority order of context IDs (for priority_based strategy)"
            }
          }
        },
        target_context_id: {
          type: "string",
          description: "ID for the merged context (auto-generated if not provided)"
        },
        metadata: {
          type: "object",
          description: "Metadata for merged context",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      required: ["context_ids", "merge_strategy"]
    }
  },
  {
    name: "get_context_statistics",
    description: "Get detailed statistics and metrics about stored context including size analysis, usage patterns, and performance metrics.",
    inputSchema: {
      type: "object",
      properties: {
        context_ids: {
          type: "array",
          items: { type: "string" },
          description: "Specific context IDs to analyze (optional)"
        },
        filters: {
          type: "object",
          description: "Filters for statistics query",
          properties: {
            context_types: {
              type: "array",
              items: {
                type: "string",
                enum: ["codebase", "schema", "legacy", "memory", "all"]
              },
              description: "Types of context to include"
            },
            date_range: {
              type: "object",
              properties: {
                start: { type: "string", format: "date-time" },
                end: { type: "string", format: "date-time" }
              },
              description: "Filter by creation date range"
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Filter by tags"
            },
            storage_tier: {
              type: "string",
              enum: ["hot", "warm", "cold"],
              description: "Filter by storage tier"
            }
          }
        },
        include_metrics: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "storage_size",
              "item_count",
              "access_patterns",
              "compression_ratios",
              "retrieval_performance",
              "memory_usage",
              "cache_hit_rate"
            ]
          },
          default: ["storage_size", "item_count", "access_patterns"],
          description: "Metrics to include in statistics"
        },
        time_granularity: {
          type: "string",
          enum: ["hour", "day", "week", "month"],
          default: "day",
          description: "Time granularity for time-series metrics"
        },
        include_recommendations: {
          type: "boolean",
          default: true,
          description: "Include optimization recommendations"
        }
      }
    }
  }
];

// Made with Bob
