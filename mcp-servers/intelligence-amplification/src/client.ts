import { StarkApiClient } from "@stark/shared-mcp";

const API_URL = process.env.INTELLIGENCE_API_URL || "http://localhost:8004";

export const intelligenceClient = new StarkApiClient(API_URL);

export const toolEndpoints: Record<string, string> = {
  // Intelligence Amplification endpoints
  optimize_prompt: "/api/v1/intelligence/optimize-prompt",
  rag_query: "/api/v1/intelligence/rag-query",
  chain_of_thought: "/api/v1/intelligence/chain-of-thought",
  self_reflect: "/api/v1/intelligence/self-reflect",
  decompose_task: "/api/v1/intelligence/decompose-task",
  route_to_model: "/api/v1/intelligence/route-to-model",
  
  // Code Intelligence endpoints
  index_repository: "/api/v1/repositories/index",
  semantic_code_search: "/api/v1/search/semantic",
  analyze_dependencies: "/api/v1/dependencies/analyze",
  get_index_status: "/api/v1/repositories/status",
  find_symbol_references: "/api/v1/symbols/references",
  analyze_code_complexity: "/api/v1/analysis/complexity"
};

// Made with Bob
