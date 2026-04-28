import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.MEMORY_API_URL || "http://localhost:8003";

export const memoryClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  // Original memory management endpoints
  store_memory: "/api/v1/memory/store",
  retrieve_memory: "/api/v1/memory/retrieve",
  search_memory: "/api/v1/memory/search",
  compress_context: "/api/v1/memory/compress",
  get_session_history: "/api/v1/memory/session/history",
  
  // Large-scale context handling endpoints
  store_large_codebase_context: "/api/v1/context/codebase/store",
  retrieve_codebase_context: "/api/v1/context/codebase/retrieve",
  store_schema_context: "/api/v1/context/schema/store",
  retrieve_schema_context: "/api/v1/context/schema/retrieve",
  store_legacy_context: "/api/v1/context/legacy/store",
  retrieve_legacy_context: "/api/v1/context/legacy/retrieve",
  prioritize_context: "/api/v1/context/prioritize",
  merge_contexts: "/api/v1/context/merge",
  get_context_statistics: "/api/v1/context/statistics"
};

// Made with Bob
