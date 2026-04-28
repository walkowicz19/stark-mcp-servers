import { createApiClient } from "@stark/shared-mcp";

const SCHEMA_API_URL = process.env.SCHEMA_API_URL || "http://localhost:8011";

export const schemaClient = createApiClient(SCHEMA_API_URL);

export const toolEndpoints: Record<string, string> = {
  extract_schema: "/api/v1/schema/extract",
  detect_relationships: "/api/v1/schema/relationships/detect",
  analyze_query_patterns: "/api/v1/analysis/query-patterns",
  suggest_indexes: "/api/v1/analysis/suggest-indexes",
  profile_data: "/api/v1/analysis/profile-data",
  generate_erd: "/api/v1/generate/erd",
  generate_documentation: "/api/v1/generate/documentation",
  generate_migration: "/api/v1/generate/migration",
  compare_schemas: "/api/v1/schema/compare",
  get_schema_status: "/api/v1/schema/status",
  list_schemas: "/api/v1/schema/list",
  delete_schema: "/api/v1/schema/delete",
};

// Made with Bob