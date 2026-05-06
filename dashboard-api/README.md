# Sytra MCP Dashboard API

Backend API for the Sytra MCP Management Dashboard.

## Features

- ✅ **Complete REST API** - All endpoints implemented
- ✅ **WebSocket Support** - Real-time updates
- ✅ **SQLite Database** - Persistent storage with automatic backups
- ✅ **Security** - Admin password protection, encryption, rate limiting
- ✅ **Monitoring** - Health checks, metrics, alerts
- ✅ **Logging** - Structured logging with rotation
- ✅ **Enterprise Features** - Error handling, validation, performance optimized

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the server
npm start
```

The API will be available at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## API Endpoints

### Health
- `GET /api/health` - Overall health status
- `GET /api/health/status` - Detailed health status
- `GET /api/health/history` - Health metrics history
- `POST /api/health/check` - Trigger health check

### Models
- `GET /api/models` - Get all model configurations
- `GET /api/models/active` - Get active models
- `GET /api/models/tracked` - Get tracked models from usage
- `POST /api/models` - Add/update model configuration
- `PUT /api/models/:modelName` - Update model configuration
- `DELETE /api/models/:modelName` - Deactivate model

### Tokens
- `GET /api/tokens/stats` - Token usage statistics
- `GET /api/tokens/usage` - Token usage history
- `GET /api/tokens/projection` - Cost projection
- `GET /api/tokens/alerts` - Token usage alerts
- `POST /api/tokens/log` - Log token usage
- `PUT /api/tokens/thresholds` - Update thresholds

### Logs
- `GET /api/logs` - Get all logs
- `GET /api/logs/mcp` - Get MCP server logs
- `GET /api/logs/commands` - Get command execution logs
- `GET /api/logs/hallucinations` - Get hallucination detection logs
- `DELETE /api/logs` - Clear logs

### Credentials
- `GET /api/credentials` - Get all credentials (metadata only)
- `GET /api/credentials/:name` - Get credential value (decrypted)
- `POST /api/credentials` - Add new credential
- `DELETE /api/credentials/:name` - Delete credential
- `POST /api/credentials/:name/test` - Test credential

### Memory
- `GET /api/memory/graph` - Get memory graph
- `GET /api/memory/stats` - Get memory statistics
- `GET /api/memory/search` - Search memory
- `GET /api/memory/nodes/:nodeId` - Get node details
- `POST /api/memory/nodes` - Add memory node
- `POST /api/memory/relationships` - Add memory relationship

### Admin
- `POST /api/admin/set-password` - Set admin password
- `POST /api/admin/verify-password` - Verify admin password
- `GET /api/admin/password-status` - Check if password is configured
- `GET /api/admin/audit-log` - Get audit log

## WebSocket Events

Connect to `ws://localhost:3000` to receive real-time updates:

### Subscribe to Events
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  events: ['health_update', 'token_update', 'alerts']
}));
```

### Event Types
- `health_update` - Health status updates (every 10s)
- `token_update` - Token usage updates (every 10s)
- `alerts` - System alerts
- `log_update` - New log entries
- `token_usage` - Token usage logged
- `model_config_updated` - Model configuration changed
- `memory_node_updated` - Memory node updated
- `memory_relationship_created` - Memory relationship created
- `command_log` - Command executed
- `hallucination_detected` - Hallucination detected

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (error/warn/info/debug/trace)
- `DB_PATH` - Database file path
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Admin Password

The admin password is configured through the dashboard UI, not via environment variables. This ensures the password is never stored in configuration files.

1. Start the server
2. Open the dashboard at `http://localhost:3000`
3. Navigate to Security section
4. Set admin password (minimum 8 characters)

## Security Features

### Encryption
- AES-256-GCM for credential storage
- PBKDF2 key derivation (100,000 iterations)
- Secure master key generation

### Authentication
- Admin password protection
- Session tokens with expiration
- Rate limiting (100 requests per 15 minutes)

### Audit Logging
- All admin actions logged
- IP address tracking
- Timestamp and context recording

## Database

### SQLite with sql.js
- In-memory database with file persistence
- Automatic backups every 30 minutes
- Backup retention (last 10 backups)
- Atomic writes with temporary files

### Schema
- `token_usage` - Token usage tracking
- `command_logs` - Command execution logs
- `credentials` - Encrypted credentials
- `memory_nodes` - Memory graph nodes
- `memory_relationships` - Memory graph relationships
- `mcp_logs` - MCP server logs
- `hallucination_records` - Hallucination detection
- `model_configs` - Model configurations
- `health_metrics` - Health metrics
- `audit_logs` - Security audit logs

## Services

### CredentialVault
Secure credential storage with encryption and admin password management.

### TokenTracker
Token usage tracking with threshold alerts and cost projection.

### HallucinationDetector
AI response confidence scoring and hallucination detection.

### MCPMonitor
MCP service health monitoring with automatic checks.

### Logger
Structured logging with file rotation and log management.

## Development

### Project Structure
```
dashboard-api/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── db/                    # Database files
│   ├── sqlite.js          # Database class
│   └── sqlite-adapter.js  # sql.js adapter
├── services/              # Business logic
│   ├── credential-vault.js
│   ├── token-tracker.js
│   ├── hallucination-detector.js
│   ├── mcp-monitor.js
│   └── logger.js
└── routes/                # API routes
    ├── models.js
    ├── tokens.js
    ├── logs.js
    ├── credentials.js
    ├── memory.js
    └── health.js
```

### Adding New Routes

1. Create route file in `routes/`
2. Import in `server.js`
3. Mount with `app.use('/api/path', router)`

### Adding New Services

1. Create service file in `services/`
2. Initialize in `server.js`
3. Add to `app.locals` for route access

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure admin password
- [ ] Set up HTTPS/TLS
- [ ] Configure CORS_ORIGIN
- [ ] Set up log rotation
- [ ] Configure database backups
- [ ] Set up monitoring
- [ ] Review rate limits
- [ ] Secure master encryption key

### Docker Deployment

```bash
# Build image
docker build -t sytra-dashboard-api .

# Run container
docker run -p 3000:3000 \
  -v $(pwd)/db:/app/db \
  -v $(pwd)/logs:/app/logs \
  -e NODE_ENV=production \
  sytra-dashboard-api
```

### Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name sytra-dashboard-api

# Enable startup script
pm2 startup
pm2 save
```

## Troubleshooting

### Database Issues

**Problem**: Database file locked
**Solution**: Ensure only one instance is running

**Problem**: Backup directory full
**Solution**: Increase `DB_BACKUP_RETENTION` or clear old backups

### Performance Issues

**Problem**: Slow queries
**Solution**: Check database indexes, consider vacuuming

**Problem**: High memory usage
**Solution**: Reduce `MAX_MEMORY_NODES` and `MAX_LOG_ENTRIES`

### Security Issues

**Problem**: Admin password forgotten
**Solution**: Delete `.admin-password` file and reconfigure

**Problem**: Rate limit too restrictive
**Solution**: Adjust `RATE_LIMIT_MAX_REQUESTS` in .env

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/walkowicz19/sytra-mcp-servers/issues
- Documentation: https://github.com/walkowicz19/sytra-mcp-servers

---

Made with ❤️ for the Sytra MCP project