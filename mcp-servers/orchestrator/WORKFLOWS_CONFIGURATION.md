# Workflows Directory Configuration

## Problem

When the Sytra Orchestrator MCP server starts in different IDEs (like Antigravity, Claude Desktop, Cursor, etc.), it attempts to load workflow definitions from a `workflows` directory. By default, it was using `process.cwd()` which resolves to the IDE's installation directory, not the actual project workflows directory.

This caused errors like:
```
[WARN] Workflows directory not found {"dir":"C:\\Users\\...\\AppData\\Local\\Programs\\Antigravity\\workflows"}
```

And could lead to JSON parsing errors if the IDE tried to initialize with invalid paths.

## Solution

The orchestrator now supports configuring the workflows directory via the `WORKFLOWS_DIR` environment variable. The resolution order is:

1. **Constructor parameter** (for programmatic use)
2. **`WORKFLOWS_DIR` environment variable** (recommended for IDE configurations)
3. **Default relative path** (`__dirname/../../workflows` - relative to the build directory)

## Configuration

### For All IDEs

Add the `WORKFLOWS_DIR` environment variable to your MCP server configuration:

```json
{
  "sytra-orchestrator": {
    "command": "node",
    "args": [
      "/absolute/path/to/sytra-mcp/mcp-servers/orchestrator/build/index.js"
    ],
    "env": {
      "WORKFLOWS_DIR": "/absolute/path/to/sytra-mcp/mcp-servers/orchestrator/workflows",
      "SECURITY_API_URL": "http://localhost:8001",
      ...
    }
  }
}
```

### Path Format

- **Windows**: Use forward slashes or escaped backslashes
  - ✅ `C:/Users/YourName/sytra-mcp/mcp-servers/orchestrator/workflows`
  - ✅ `C:\\Users\\YourName\\sytra-mcp\\mcp-servers\\orchestrator\\workflows`
  - ❌ `C:\Users\YourName\sytra-mcp\mcp-servers\orchestrator\workflows` (unescaped)

- **Linux/macOS**: Use standard Unix paths
  - ✅ `/home/username/sytra-mcp/mcp-servers/orchestrator/workflows`
  - ✅ `~/sytra-mcp/mcp-servers/orchestrator/workflows`

### IDE-Specific Configuration Files

All configuration files in the `configs/` directory have been updated with the `WORKFLOWS_DIR` variable:

- `configs/antigravity.json`
- `configs/claude-desktop.json`
- `configs/cursor.json`
- `configs/windsurf.json`
- `configs/zed.json`
- `configs/vscode-continue.json`
- `configs/ibm-bob.json`
- `configs/kiro.json`

**Important**: Replace `/absolute/path/to/sytra-mcp` with your actual project path.

## Verification

After configuring, the orchestrator should log:

```
[INFO] Workflow definitions loaded {"count": 7}
```

If you see:
```
[WARN] Workflows directory not found
```

Check that:
1. The `WORKFLOWS_DIR` path is correct and absolute
2. The path uses proper format for your OS
3. The workflows directory exists and contains `.json` files
4. You've rebuilt the orchestrator after making code changes

## Available Workflows

The orchestrator includes these pre-defined workflows:

1. **database-modernization.json** - Database schema modernization
2. **full-sdlc-cycle.json** - Complete software development lifecycle
3. **large-codebase-analysis.json** - Analyze large codebases
4. **legacy-modernization.json** - Legacy code translation and modernization
5. **legacy-system-assessment.json** - Assess legacy systems
6. **performance-optimization.json** - Performance analysis and optimization
7. **secure-code-generation.json** - Generate secure code with validation

## Troubleshooting

### Workflows not loading

1. Check the logs for the exact path being used
2. Verify the path exists: `ls /your/path/to/workflows`
3. Ensure workflow JSON files are valid
4. Restart the IDE after configuration changes

### JSON parsing errors

If you see errors like "invalid character '-' after array element":
- This typically means a workflow JSON file has syntax errors
- Validate each `.json` file in the workflows directory
- Check for trailing commas, missing brackets, or invalid JSON syntax

### Permission errors

Ensure the Node.js process has read permissions for:
- The workflows directory
- All `.json` files within it

## Custom Workflows

You can add custom workflow definitions by:

1. Creating a new `.json` file in the workflows directory
2. Following the workflow schema (see existing workflows for examples)
3. Restarting the orchestrator (it loads workflows on startup)

Or programmatically:
```typescript
import { workflowDefinitions } from './workflow/definitions.js';

workflowDefinitions.registerWorkflow(myCustomWorkflow);
```

## Development

When developing locally, the default relative path should work:
```
mcp-servers/orchestrator/build/index.js
  -> looks for: mcp-servers/orchestrator/workflows/
```

For production or IDE deployments, always use the `WORKFLOWS_DIR` environment variable.