/**
 * Common types shared across all Sytra MCP servers
 */

export interface SytraApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

// Made with Bob
