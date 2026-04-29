# IDE Configuration Files

This directory contains ready-to-use configuration files for integrating Sytra MCP servers with various IDEs and AI-powered development tools.

## ⚠️ Important Security Note

**Admin passwords should NEVER be stored in MCP configuration files.** All password configuration is done exclusively through the Sytra Dashboard's Security section. MCP config files only contain server paths and environment variables for API endpoints.

## Available Configurations

| File | IDE/Tool | Description |
|------|----------|-------------|
| [`claude-desktop.json`](claude-desktop.json) | Claude Desktop | Native MCP integration for Claude Desktop app |
| [`vscode-continue.json`](vscode-continue.json) | VSCode + Continue | Configuration for Continue extension in VSCode |
| [`cursor.json`](cursor.json) | Cursor IDE | Native MCP support in Cursor |
| [`windsurf.json`](windsurf.json) | Windsurf IDE | Windsurf-specific MCP configuration |
| [`zed.json`](zed.json) | Zed Editor | Zed's built-in MCP support |
| [`ibm-bob.json`](ibm-bob.json) | IBM Bob | Configuration for IBM Bob AI assistant |
| [`antigravity.json`](antigravity.json) | Antigravity | Configuration for Antigravity AI tool |
| [`kiro.json`](kiro.json) | Kiro | Configuration for Kiro AI assistant |

## Quick Start

1. **Choose your IDE** - Select the configuration file for your IDE
2. **Copy the configuration** - Copy the entire contents of the file
3. **Update paths** - Replace `/absolute/path/to/sytra-mcp/` with your actual installation path
4. **Apply configuration** - Paste into your IDE's MCP configuration file
5. **Restart IDE** - Restart your IDE to load the MCP servers

## Path Configuration

All configuration files use placeholder paths that **must be updated**:

```json
"/absolute/path/to/sytra-mcp/mcp-servers/orchestrator/build/index.js"
```

### Windows Example
```json
"C:/Users/YourName/Documents/sytra-mcp/mcp-servers/orchestrator/build/index.js"
```

### macOS/Linux Example
```json
"/Users/yourname/projects/sytra-mcp/mcp-servers/orchestrator/build/index.js"
```

**Important:** Use forward slashes (`/`) even on Windows for better compatibility.

## Configuration Structure

Each configuration includes all 10 Sytra MCP servers:

1. **sytra-orchestrator** - Intelligent routing and workflow orchestration
2. **sytra-intelligence** - Prompt optimization and code intelligence
3. **sytra-schema** - Database schema analysis and optimization
4. **sytra-security** - Security scanning and compliance
5. **sytra-codegen** - Code generation and validation
6. **sytra-memory** - Context management and storage
7. **sytra-tokens** - Token optimization and compression
8. **sytra-sdlc** - SDLC integration and documentation
9. **sytra-legacy** - Legacy code modernization
10. **sytra-performance** - Performance profiling and optimization

## Environment Variables

All servers require backend API URLs. Default configuration uses:

- Security: `http://localhost:8001`
- Code Generation: `http://localhost:8002`
- Memory: `http://localhost:8003`
- Intelligence: `http://localhost:8004`
- Tokens: `http://localhost:8005`
- SDLC: `http://localhost:8006`
- Legacy: `http://localhost:8007`
- Schema: `http://localhost:8008`
- Performance: `http://localhost:8009`

### Orchestrator-Specific Configuration

The **sytra-orchestrator** server requires an additional environment variable:

- **`WORKFLOWS_DIR`**: Absolute path to the workflows directory
  - Example: `/absolute/path/to/sytra-mcp/mcp-servers/orchestrator/workflows`
  - **Required** for proper workflow loading in all IDEs
  - See [Workflows Configuration Guide](../mcp-servers/orchestrator/WORKFLOWS_CONFIGURATION.md) for details

If your backend services run on different ports, update the `env` section in each server configuration.

### Security Configuration

**Important:** Do NOT add passwords or sensitive credentials to these configuration files.

- **Admin passwords**: Configure via Dashboard → Security section
- **API keys**: Store in environment variables or use the Dashboard's Credential Manager
- **Sensitive data**: Never commit to version control

See [`SECURITY_IMPLEMENTATION.md`](../SECURITY_IMPLEMENTATION.md) for security best practices.

## IDE-Specific Notes

### Claude Desktop
- Configuration location varies by OS (see [IDE_CONFIGURATIONS.md](../IDE_CONFIGURATIONS.md))
- Requires restart after configuration changes
- Check logs in the same directory as config file

### VSCode (Continue)
- Place in `~/.continue/config.json` or workspace `.continue/config.json`
- Includes model and embeddings configuration
- Reload window after changes: `Ctrl+Shift+P` → "Developer: Reload Window"

### Cursor
- Configuration in Cursor's settings directory
- Access via Settings → Features → MCP Servers
- May cache connections; restart if tools don't appear

### Windsurf
- Uses `mcp.servers` structure (note the difference from other IDEs)
- Configuration in Windsurf's application data directory
- Ensure backend services are running before starting Windsurf

### Zed
- Requires `assistant.version` set to `"2"`
- Configuration in `~/.config/zed/settings.json`
- Automatically reconnects on configuration changes

## Verification

After configuration:

1. **Check server builds exist:**
   ```bash
   ls mcp-servers/*/build/index.js
   ```

2. **Verify backend services:**
   ```bash
   curl http://localhost:8001/health
   ```

3. **Test in IDE:**
   - Open your IDE's AI assistant
   - Look for Sytra MCP tools in the available tools list
   - Try a simple query using a Sytra tool

## Troubleshooting

### Tools Not Appearing
- Verify file paths are absolute and correct
- Ensure all servers are built: `npm run build` in each server directory
- Restart IDE completely
- Check IDE logs for error messages

### Connection Errors
- Verify backend services are running
- Check that ports match in environment variables
- Ensure no firewall blocking localhost connections

### Path Issues
- Use absolute paths, not relative
- Use forward slashes even on Windows
- Verify build directories exist

## Additional Resources

- **[IDE Configuration Guide](IDE_CONFIGURATIONS.md)** - Detailed setup instructions for each IDE
- **[Installation Guide](../mcp-servers/INSTALLATION.md)** - Complete server installation
- **[Testing Guide](../mcp-servers/TESTING.md)** - Verification procedures
- **[Troubleshooting Guide](../mcp-servers/TROUBLESHOOTING.md)** - Detailed problem solving

## Need Help?

If you encounter issues:

1. Review the [IDE Configuration Guide](IDE_CONFIGURATIONS.md) for your specific IDE
2. Check the [Troubleshooting Guide](../mcp-servers/TROUBLESHOOTING.md)
3. Verify backend services are running and accessible
4. Check IDE logs for specific error messages
5. Ensure Node.js 18+ is installed: `node --version`