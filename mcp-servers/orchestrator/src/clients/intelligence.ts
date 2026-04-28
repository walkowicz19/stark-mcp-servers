/**
 * Intelligence Amplification Service Client
 * Provides access to intelligence amplification service
 */

import { BaseClient } from './base.js';

export interface PromptOptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  estimatedQualityScore: number;
}

export interface TaskDecompositionResult {
  subtasks: Array<{
    id: string;
    description: string;
    dependencies: string[];
    estimatedComplexity: number;
  }>;
  executionPlan: string;
}

export interface ReasoningChainResult {
  steps: Array<{
    step: number;
    reasoning: string;
    conclusion: string;
  }>;
  finalAnswer: string;
  confidence: number;
}

export interface RAGResult {
  answer: string;
  sources: Array<{
    content: string;
    relevance: number;
    metadata?: Record<string, any>;
  }>;
  confidence: number;
}

export interface ModelRoutingResult {
  selectedModel: string;
  reasoning: string;
  estimatedCost: number;
  estimatedQuality: number;
}

export interface IndexRepositoryResult {
  repo_id: string;
  status: string;
  progress: {
    total_files: number;
    indexed_files: number;
    estimated_time_seconds: number;
  };
  job_id: string;
}

export interface SemanticSearchResult {
  results: Array<{
    file_path: string;
    chunk_id: string;
    content: string;
    score: number;
    start_line: number;
    end_line: number;
    metadata: Record<string, any>;
  }>;
  total: number;
  query_time_ms: number;
}

export interface DependencyAnalysisResult {
  file_path: string;
  incoming_dependencies: string[];
  outgoing_dependencies: string[];
  impact_radius: number;
  dependency_graph: Record<string, string[]>;
}

export interface SymbolReferencesResult {
  symbol: string;
  references: Array<{
    file_path: string;
    line: number;
    context: string;
    type: string;
  }>;
  total_references: number;
}

export interface ComplexityAnalysisResult {
  path: string;
  metrics: {
    cyclomatic_complexity?: number;
    cognitive_complexity?: number;
    maintainability_index?: number;
    lines_of_code?: number;
  };
  files?: Array<{
    path: string;
    metrics: Record<string, number>;
  }>;
}

export class IntelligenceClient extends BaseClient {
  constructor(baseURL: string) {
    super('intelligence', { baseURL });
  }

  // Intelligence Amplification methods
  async optimizePrompt(prompt: string, task: string): Promise<PromptOptimizationResult> {
    return this.post<PromptOptimizationResult>('/prompt/optimize', { prompt, task });
  }

  async decomposeTask(task: string, context?: string): Promise<TaskDecompositionResult> {
    return this.post<TaskDecompositionResult>('/task/decompose', { task, context });
  }

  async reasoningChain(question: string, context?: string): Promise<ReasoningChainResult> {
    return this.post<ReasoningChainResult>('/reasoning/chain', { question, context });
  }

  async ragQuery(query: string, documents: string[]): Promise<RAGResult> {
    return this.post<RAGResult>('/rag/query', { query, documents });
  }

  async routeToModel(task: string, requirements?: Record<string, any>): Promise<ModelRoutingResult> {
    return this.post<ModelRoutingResult>('/model/route', { task, requirements });
  }

  async selfReflect(output: string, criteria: string[]): Promise<{
    score: number;
    feedback: string[];
    improvements: string[];
  }> {
    return this.post('/reflect', { output, criteria });
  }

  async multiAgentCollaboration(task: string, agents: string[]): Promise<{
    result: string;
    contributions: Record<string, string>;
  }> {
    return this.post('/multi-agent/collaborate', { task, agents });
  }

  // Code Intelligence methods
  async indexRepository(
    repo_url: string,
    branch?: string,
    incremental?: boolean,
    options?: Record<string, any>
  ): Promise<IndexRepositoryResult> {
    return this.post<IndexRepositoryResult>('/repositories/index', {
      repo_url,
      branch,
      incremental,
      options,
    });
  }

  async semanticCodeSearch(
    query: string,
    repo_id: string,
    filters?: Record<string, any>,
    limit?: number,
    include_context?: boolean
  ): Promise<SemanticSearchResult> {
    return this.post<SemanticSearchResult>('/search/semantic', {
      query,
      repo_id,
      filters,
      limit,
      include_context,
    });
  }

  async analyzeDependencies(
    file_path: string,
    repo_id: string,
    depth?: number,
    direction?: string,
    include_transitive?: boolean
  ): Promise<DependencyAnalysisResult> {
    return this.post<DependencyAnalysisResult>('/dependencies/analyze', {
      file_path,
      repo_id,
      depth,
      direction,
      include_transitive,
    });
  }

  async getIndexStatus(repo_id: string, job_id?: string): Promise<{
    repo_id: string;
    status: string;
    progress: Record<string, any>;
  }> {
    return this.post('/repositories/status', { repo_id, job_id });
  }

  async findSymbolReferences(
    symbol: string,
    repo_id: string,
    symbol_type?: string,
    include_definitions?: boolean
  ): Promise<SymbolReferencesResult> {
    return this.post<SymbolReferencesResult>('/symbols/references', {
      symbol,
      repo_id,
      symbol_type,
      include_definitions,
    });
  }

  async analyzeCodeComplexity(
    path: string,
    repo_id: string,
    metrics?: string[],
    recursive?: boolean
  ): Promise<ComplexityAnalysisResult> {
    return this.post<ComplexityAnalysisResult>('/analysis/complexity', {
      path,
      repo_id,
      metrics,
      recursive,
    });
  }
}

// Made with Bob
