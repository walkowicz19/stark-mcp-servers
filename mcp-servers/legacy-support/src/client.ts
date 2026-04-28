import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.LEGACY_API_URL || "http://localhost:8003";

export const legacyClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  // Original tools
  parse_cobol: "/api/v1/legacy/parse/cobol",
  parse_fortran: "/api/v1/legacy/parse/fortran",
  translate_cobol_to_python: "/api/v1/legacy/translate/cobol-to-python",
  translate_cobol_to_java: "/api/v1/legacy/translate/cobol-to-java",
  analyze_dependencies: "/api/v1/legacy/analyze/dependencies",
  generate_migration_plan: "/api/v1/legacy/migration/plan",
  
  // Advanced analysis tools
  analyze_legacy_codebase: "/api/v1/legacy/analyze/codebase",
  extract_business_logic: "/api/v1/legacy/extract/business-logic",
  visualize_data_flow: "/api/v1/legacy/visualize/data-flow",
  detect_legacy_patterns: "/api/v1/legacy/detect/patterns",
  analyze_mainframe_integration: "/api/v1/legacy/analyze/mainframe",
  suggest_modernization_path: "/api/v1/legacy/suggest/modernization",
  extract_copybooks: "/api/v1/legacy/extract/copybooks",
  analyze_batch_jobs: "/api/v1/legacy/analyze/batch-jobs",
  map_legacy_database: "/api/v1/legacy/map/database",
  generate_migration_report: "/api/v1/legacy/generate/migration-report"
};

// Made with Bob
