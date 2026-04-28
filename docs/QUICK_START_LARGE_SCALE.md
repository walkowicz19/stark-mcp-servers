# Quick Start: Large-Scale Capabilities

**Get started with Stark MCP's enterprise features in 5 minutes**

---

## Prerequisites

- Node.js 20.0+
- Claude Desktop or MCP-compatible client
- Backend services running (or access to remote services)

---

## Installation (5 minutes)

### Step 1: Install MCP Servers

```bash
# Clone repository
git clone https://github.com/walkowicz19/stark-mcp-package.git
cd stark-mcp-package

# Install orchestrator (recommended - provides all capabilities)
cd mcp-servers/orchestrator
npm install && npm run build
```

### Step 2: Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stark-orchestrator": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-servers/orchestrator/build/index.js"],
      "env": {
        "STARK_INTELLIGENCE_URL": "http://localhost:8004",
        "STARK_SCHEMA_URL": "http://localhost:8011",
        "STARK_LEGACY_URL": "http://localhost:8007",
        "STARK_MEMORY_URL": "http://localhost:8003"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

Restart Claude Desktop to load the new MCP server.

---

## Essential Configuration

### Service URLs

Ensure these backend services are accessible:

| Service | Port | Purpose |
|---------|------|---------|
| Intelligence Amplification | 8004 | Code intelligence, RAG, reasoning |
| Schema Intelligence | 8011 | Database analysis |
| Legacy Support | 8007 | Legacy system analysis |
| Memory Management | 8003 | Context storage |

### Environment Variables (Optional)

```bash
# Workflow settings
export STARK_WORKFLOW_TIMEOUT=300000
export STARK_MAX_RETRIES=3
export STARK_LOG_LEVEL=info
```

---

## Quick Examples

### Example 1: Analyze a Large Repository (2 minutes)

**Natural Language:**
```
Analyze the repository at https://github.com/company/monorepo and provide insights on code complexity and dependencies
```

**What Happens:**
1. Repository is cloned and indexed (incremental if already indexed)
2. Semantic search index is built
3. Dependencies are analyzed
4. Complexity metrics are calculated
5. Results are returned with actionable insights

**Expected Output:**
- Repository statistics (files, LOC, languages)
- Complexity hotspots
- Dependency graph
- Recommendations for refactoring

---

### Example 2: Analyze a Database Schema (3 minutes)

**Natural Language:**
```
Extract and analyze the PostgreSQL database schema at localhost:5432/production_db (username: readonly, password: secret) with comprehensive analysis including relationships and optimization suggestions
```

**What Happens:**
1. Schema is extracted from database
2. Relationships are detected (FK + naming conventions)
3. Data is profiled
4. Index suggestions are generated
5. ERD diagram is created
6. Documentation is generated

**Expected Output:**
- Complete schema documentation
- Relationship diagram (Mermaid format)
- Index optimization suggestions
- Data quality insights
- Query pattern recommendations

---

### Example 3: Assess a Legacy System (5 minutes)

**Natural Language:**
```
Perform a comprehensive assessment of the COBOL system at /mainframe/billing-system for modernization to Java microservices on AWS
```

**What Happens:**
1. COBOL code is parsed and analyzed
2. Business logic is extracted
3. Dependencies are mapped
4. Anti-patterns are detected
5. Modernization strategy is recommended
6. Migration plan is generated

**Expected Output:**
- System complexity assessment
- Business rules documentation
- Dependency graph
- Anti-pattern report
- Phased migration plan
- Cost and timeline estimates

---

## Common Workflows

### Workflow 1: Large Codebase Analysis

```
Execute the large-codebase-analysis workflow for https://github.com/company/repo
```

**Duration:** 30-60 minutes  
**Includes:**
- Repository indexing
- Semantic search setup
- Dependency analysis
- Complexity assessment
- Hotspot identification
- Comprehensive report

---

### Workflow 2: Database Modernization

```
Execute the database-modernization workflow for my PostgreSQL database at localhost:5432/mydb
```

**Duration:** 15-30 minutes  
**Includes:**
- Schema extraction
- Relationship detection
- Data profiling
- Query analysis
- Index suggestions
- ERD generation
- Documentation

---

### Workflow 3: Legacy System Assessment

```
Execute the legacy-system-assessment workflow for my COBOL system at /path/to/cobol targeting Java on AWS
```

**Duration:** 20-45 minutes  
**Includes:**
- Code parsing
- Business logic extraction
- Pattern detection
- Mainframe integration analysis
- Modernization recommendations
- Migration planning
- Assessment report

---

## Using High-Level Tools

### Tool: `stark_analyze_large_codebase`

```
Use stark_analyze_large_codebase to analyze https://github.com/company/repo with full analysis including dependencies and complexity
```

**Parameters:**
- `repo_url`: Repository URL
- `analysis_type`: "full", "incremental", or "targeted"
- `include_indexing`: true
- `include_dependencies`: true
- `include_complexity`: true

---

### Tool: `stark_analyze_database_system`

```
Use stark_analyze_database_system to analyze my PostgreSQL database with comprehensive scope
```

**Parameters:**
- `connection`: Database connection details
- `analysis_scope`: "basic", "standard", or "comprehensive"
- `include_optimization`: true
- `generate_documentation`: true

---

### Tool: `stark_modernize_legacy_system`

```
Use stark_modernize_legacy_system to assess my COBOL system for Java migration
```

**Parameters:**
- `legacy_code_path`: Path to legacy code
- `source_language`: "cobol"
- `target_language`: "java"
- `assessment_depth`: "comprehensive"
- `generate_migration_plan`: true

---

## Verification

### Check Installation

After restarting Claude Desktop, verify the tools are available:

```
List all available Stark tools
```

You should see tools like:
- `stark_analyze_large_codebase`
- `stark_analyze_database_system`
- `stark_modernize_legacy_system`
- `stark_full_system_assessment`
- `stark_execute_workflow`

### Check Service Connectivity

```
Check the status of Stark services
```

All services should be reachable and healthy.

---

## Next Steps

### Learn More

- **[Complete Guide](LARGE_SCALE_CAPABILITIES.md)**: Comprehensive documentation
- **[Use Case Examples](examples/LARGE_SCALE_EXAMPLES.md)**: Detailed real-world scenarios
- **[API Reference](API_REFERENCE_LARGE_SCALE.md)**: Complete API documentation
- **[Troubleshooting](LARGE_SCALE_CAPABILITIES.md#troubleshooting)**: Common issues and solutions

### Try Advanced Features

1. **Semantic Code Search**: Find code using natural language
2. **Dependency Impact Analysis**: Understand change impact
3. **Business Logic Extraction**: Document legacy business rules
4. **Query Pattern Analysis**: Optimize database performance
5. **Context Management**: Store and retrieve large-scale context

### Explore Workflows

```
List all available Stark workflows
```

Try pre-defined workflows for common tasks:
- `large-codebase-analysis`
- `database-modernization`
- `legacy-system-assessment`
- `secure-code-generation`
- `full-sdlc-cycle`
- `performance-optimization`

---

## Tips for Success

### Code Intelligence

1. **Use incremental indexing** for faster updates
2. **Exclude test files** and dependencies to reduce noise
3. **Be specific in queries** for better search results
4. **Apply filters** to narrow down results

### Schema Intelligence

1. **Use read-only database users** for safety
2. **Enable SSL** for production databases
3. **Start with basic analysis** then go deeper
4. **Cache extracted schemas** to avoid re-extraction

### Legacy System Analysis

1. **Begin with shallow analysis** to get overview
2. **Focus on business logic** for migration planning
3. **Document copybooks first** as they're critical
4. **Generate reports regularly** to track progress

### Performance

1. **Use appropriate storage tiers** (hot/warm/cold)
2. **Enable compression** to save storage
3. **Monitor resource usage** to stay under limits
4. **Prioritize contexts** before retrieval

---

## Common Issues

### Issue: Tools Not Appearing

**Solution:**
1. Verify `claude_desktop_config.json` syntax
2. Check absolute paths are correct
3. Restart Claude Desktop completely
4. Check logs for errors

### Issue: Service Connection Errors

**Solution:**
1. Verify services are running
2. Check service URLs in config
3. Test connectivity: `curl http://localhost:8004/health`
4. Check firewall settings

### Issue: Slow Performance

**Solution:**
1. Check network connectivity
2. Verify service resources (CPU, memory)
3. Use incremental operations when possible
4. Apply filters to reduce data volume

---

## Getting Help

- **Documentation**: [docs/](.)
- **GitHub Issues**: [Report bugs](https://github.com/walkowicz19/stark-mcp-package/issues)
- **Discussions**: [Ask questions](https://github.com/walkowicz19/stark-mcp-package/discussions)

---

**Ready to analyze enterprise-scale systems!** 🚀

*Last Updated: 2026-04-28*