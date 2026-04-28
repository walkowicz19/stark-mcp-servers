/**
 * Schema Intelligence Service Client
 * Provides access to schema intelligence service for database analysis
 */

import { BaseClient } from './base.js';

export interface SchemaExtractionResult {
  schema_id: string;
  database_type: string;
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
      default?: any;
    }>;
    constraints: Array<{
      type: string;
      columns: string[];
      reference?: {
        table: string;
        columns: string[];
      };
    }>;
    indexes: Array<{
      name: string;
      columns: string[];
      type: string;
      unique: boolean;
    }>;
  }>;
  views?: any[];
  procedures?: any[];
  extraction_time: string;
  job_id: string;
}

export interface RelationshipDetectionResult {
  relationships: Array<{
    source_table: string;
    source_column: string;
    target_table: string;
    target_column: string;
    type: string;
    confidence: number;
    detection_method: string;
  }>;
  junction_tables: string[];
  total_relationships: number;
}

export interface SchemaComparisonResult {
  differences: {
    added_tables: string[];
    removed_tables: string[];
    modified_tables: Array<{
      table: string;
      changes: string[];
    }>;
    added_columns: Array<{
      table: string;
      column: string;
    }>;
    removed_columns: Array<{
      table: string;
      column: string;
    }>;
    modified_columns: Array<{
      table: string;
      column: string;
      changes: string[];
    }>;
  };
  summary: {
    total_differences: number;
    compatibility_score: number;
  };
}

export interface QueryAnalysisResult {
  patterns: {
    n_plus_one: Array<{
      query_pattern: string;
      frequency: number;
      affected_tables: string[];
      recommendation: string;
    }>;
    hot_tables: Array<{
      table: string;
      access_count: number;
      percentage: number;
    }>;
    slow_queries: Array<{
      query: string;
      avg_duration_ms: number;
      frequency: number;
      recommendation: string;
    }>;
  };
  statistics: {
    total_queries: number;
    unique_queries: number;
    avg_duration_ms: number;
    time_range: {
      start: string;
      end: string;
    };
  };
}

export interface IndexSuggestion {
  table: string;
  columns: string[];
  index_type: string;
  impact_score: number;
  estimated_improvement: string;
  reasoning: string;
  sql: string;
}

export interface DataProfileResult {
  table: string;
  columns: Array<{
    name: string;
    cardinality: number;
    null_percentage: number;
    unique_percentage: number;
    data_type: string;
    patterns?: string[];
    distribution?: {
      min?: any;
      max?: any;
      mean?: number;
      median?: number;
      std_dev?: number;
    };
    quality_issues?: string[];
  }>;
  row_count: number;
  profiling_time: string;
}

export interface ERDResult {
  format: string;
  diagram: string;
  metadata: {
    table_count: number;
    relationship_count: number;
    generated_at: string;
  };
}

export interface DocumentationResult {
  format: string;
  content: string;
  sections: string[];
  metadata: {
    schema_id: string;
    generated_at: string;
    table_count: number;
  };
}

export interface MigrationResult {
  migration_type: string;
  up_script: string;
  down_script?: string;
  warnings: string[];
  estimated_duration: string;
  metadata: {
    source_schema_id: string;
    target_schema_id?: string;
    generated_at: string;
  };
}

export interface SchemaStatus {
  job_id: string;
  status: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  estimated_time_remaining?: string;
  errors?: string[];
  started_at: string;
  completed_at?: string;
}

export interface SchemaListItem {
  schema_id: string;
  database_type: string;
  table_count: number;
  extraction_date: string;
  has_relationships: boolean;
  has_analysis: boolean;
  size_estimate?: string;
}

export class SchemaClient extends BaseClient {
  constructor(baseURL: string) {
    super('schema', { baseURL });
  }

  /**
   * Extract complete schema from a database
   */
  async extractSchema(
    connection: {
      type: string;
      host: string;
      port?: number;
      database: string;
      username?: string;
      password?: string;
      ssl?: boolean;
      additional_params?: Record<string, any>;
    },
    options?: {
      include_views?: boolean;
      include_procedures?: boolean;
      include_triggers?: boolean;
      include_indexes?: boolean;
      batch_size?: number;
      timeout_seconds?: number;
    }
  ): Promise<SchemaExtractionResult> {
    return this.post<SchemaExtractionResult>('/schema/extract', {
      connection,
      options,
    });
  }

  /**
   * Detect relationships between tables
   */
  async detectRelationships(
    schema_id: string,
    detection_methods?: string[],
    naming_patterns?: {
      foreign_key_suffix?: string;
      junction_table_pattern?: string;
    },
    min_confidence?: number,
    analyze_data_sample?: boolean,
    sample_size?: number
  ): Promise<RelationshipDetectionResult> {
    return this.post<RelationshipDetectionResult>('/relationships/detect', {
      schema_id,
      detection_methods,
      naming_patterns,
      min_confidence,
      analyze_data_sample,
      sample_size,
    });
  }

  /**
   * Compare two schemas
   */
  async compareSchemas(
    schema_id_1: string,
    schema_id_2: string,
    comparison_options?: {
      compare_tables?: boolean;
      compare_columns?: boolean;
      compare_indexes?: boolean;
      compare_constraints?: boolean;
      compare_relationships?: boolean;
      ignore_case?: boolean;
      show_only_differences?: boolean;
    }
  ): Promise<SchemaComparisonResult> {
    return this.post<SchemaComparisonResult>('/schema/compare', {
      schema_id_1,
      schema_id_2,
      comparison_options,
    });
  }

  /**
   * List all extracted schemas
   */
  async listSchemas(
    filters?: {
      database_type?: string;
      min_table_count?: number;
      max_table_count?: number;
      has_relationships?: boolean;
      has_analysis?: boolean;
    },
    sort_by?: string,
    limit?: number
  ): Promise<SchemaListItem[]> {
    return this.get<SchemaListItem[]>('/schemas', {
      filters: filters ? JSON.stringify(filters) : undefined,
      sort_by,
      limit,
    });
  }

  /**
   * Delete a schema
   */
  async deleteSchema(schema_id: string, confirm: boolean): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>('/schema/delete', {
      schema_id,
      confirm,
    });
  }

  /**
   * Analyze query patterns
   */
  async analyzeQueryPatterns(
    schema_id: string,
    query_log: {
      source_type: string;
      source_path: string;
      format: string;
      time_range?: {
        start: string;
        end: string;
      };
    },
    analysis_options?: {
      detect_n_plus_one?: boolean;
      identify_hot_tables?: boolean;
      analyze_slow_queries?: boolean;
      slow_query_threshold_ms?: number;
      min_query_count?: number;
    }
  ): Promise<QueryAnalysisResult> {
    return this.post<QueryAnalysisResult>('/query/analyze', {
      schema_id,
      query_log,
      analysis_options,
    });
  }

  /**
   * Suggest indexes
   */
  async suggestIndexes(
    schema_id: string,
    query_analysis_id?: string,
    options?: {
      consider_existing?: boolean;
      max_suggestions?: number;
      min_impact_score?: number;
      index_types?: string[];
      consider_composite?: boolean;
      max_columns_per_index?: number;
    }
  ): Promise<IndexSuggestion[]> {
    return this.post<IndexSuggestion[]>('/indexes/suggest', {
      schema_id,
      query_analysis_id,
      options,
    });
  }

  /**
   * Profile data in tables
   */
  async profileData(
    schema_id: string,
    tables?: string[],
    profiling_options?: {
      calculate_cardinality?: boolean;
      detect_patterns?: boolean;
      analyze_distributions?: boolean;
      check_data_quality?: boolean;
      sample_size?: number;
      include_statistics?: boolean;
    }
  ): Promise<DataProfileResult[]> {
    return this.post<DataProfileResult[]>('/data/profile', {
      schema_id,
      tables,
      profiling_options,
    });
  }

  /**
   * Generate ERD diagram
   */
  async generateERD(
    schema_id: string,
    options?: {
      format?: string;
      include_columns?: boolean;
      include_data_types?: boolean;
      include_constraints?: boolean;
      show_cardinality?: boolean;
      tables?: string[];
      max_columns_per_table?: number;
      group_by_schema?: boolean;
    }
  ): Promise<ERDResult> {
    return this.post<ERDResult>('/erd/generate', {
      schema_id,
      options,
    });
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(
    schema_id: string,
    options?: {
      include_erd?: boolean;
      include_statistics?: boolean;
      include_relationships?: boolean;
      include_indexes?: boolean;
      include_examples?: boolean;
      group_by_category?: boolean;
      output_format?: string;
      template?: string;
    }
  ): Promise<DocumentationResult> {
    return this.post<DocumentationResult>('/documentation/generate', {
      schema_id,
      options,
    });
  }

  /**
   * Generate migration script
   */
  async generateMigration(
    source_schema_id: string,
    migration_type: string,
    target_schema_id?: string,
    options?: {
      database_type?: string;
      include_data?: boolean;
      safe_mode?: boolean;
      add_comments?: boolean;
      batch_size?: number;
      generate_rollback?: boolean;
    }
  ): Promise<MigrationResult> {
    return this.post<MigrationResult>('/migration/generate', {
      source_schema_id,
      target_schema_id,
      migration_type,
      options,
    });
  }

  /**
   * Get schema status
   */
  async getSchemaStatus(job_id: string, include_details?: boolean): Promise<SchemaStatus> {
    return this.post<SchemaStatus>('/schema/status', {
      job_id,
      include_details,
    });
  }
}

// Made with Bob