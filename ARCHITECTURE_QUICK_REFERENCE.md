# Stark MCP Architecture - Quick Reference

**Version:** 1.0  
**Date:** 2026-04-27

---

## System Overview

**Stark MCP** is an enterprise-grade AI agent infrastructure platform with:
- 🔒 Security-first design with real-time guardrails
- 🌐 Hybrid deployment (edge, on-premise, cloud)
- 🤖 Intelligent AI routing (local + cloud models)
- 🏛️ Legacy system modernization (COBOL, Fortran, mainframes)
- 📈 Elastic scaling (10 to 10,000+ users)

---

## Core Services (8)

| Service | Purpose | Technology | Port |
|---------|---------|------------|------|
| **API Gateway** | Request routing, auth, rate limiting | Go + Kong/Envoy | 8080 |
| **Security Guardrails** | Policy enforcement, access control | Rust + Python | 8081 |
| **Code Generation** | Code gen with validation & sandbox | Python + Rust | 8082 |
| **Memory Management** | Persistent context & sessions | Python + PostgreSQL | 8083 |
| **Intelligence Amplification** | AI routing & enhancement | Python + FastAPI | 8084 |
| **Token Optimization** | Token usage optimization | Python + Redis | 8085 |
| **SDLC Integration** | Git, CI/CD, testing integration | Python | 8086 |
| **Legacy Adapter** | Legacy code modernization | Python + Java | 8087 |

---

## Technology Stack

### Languages
- **Python 3.11+**: AI/ML, business logic
- **Rust 1.70+**: Security, sandbox, performance
- **Go 1.21+**: API gateway, microservices
- **Java 17+**: Legacy system integration
- **TypeScript 5.0+**: Web UI, IDE plugins

### Databases
- **PostgreSQL 15+**: Primary relational DB
- **Redis 7+**: Caching, sessions
- **Qdrant/Weaviate**: Vector embeddings
- **SQLite 3.40+**: Edge deployment

### Infrastructure
- **Docker**: Containerization
- **Kubernetes**: Orchestration (enterprise)
- **RabbitMQ**: Message queue
- **Prometheus + Grafana**: Monitoring

---

## Deployment Modes

### 1. Edge Mode (Developer Laptop)
```
Resources: 4 cores, 8GB RAM, 50GB disk
Components: All services + SQLite + Local model
Use Case: Individual developers, offline work
```

### 2. Hybrid Mode (Team/Department)
```
Resources: 3-5 nodes, 8 cores/32GB each
Components: K8s cluster + PostgreSQL + Redis
Use Case: Teams (10-500 users)
```

### 3. Enterprise Mode (Multi-Region Cloud)
```
Resources: Auto-scaling (10-100+ nodes)
Components: Multi-region K8s + managed services
Use Case: Large enterprises (1000+ users)
```

---

## API Endpoints

### Code Generation
```
POST /api/v1/codegen/generate
POST /api/v1/codegen/validate
POST /api/v1/codegen/execute
```

### Security
```
POST /api/v1/security/evaluate
POST /api/v1/security/authorize
GET  /api/v1/security/audit
```

### Memory
```
POST /api/v1/memory/sessions
GET  /api/v1/memory/sessions/{id}
POST /api/v1/memory/store
POST /api/v1/memory/search
```

### Intelligence
```
POST /api/v1/intelligence/analyze
POST /api/v1/intelligence/route
POST /api/v1/intelligence/enhance
```

### Legacy
```
POST /api/v1/legacy/parse
POST /api/v1/legacy/analyze
POST /api/v1/legacy/modernize
POST /api/v1/legacy/document
```

---

## Performance Targets

| Metric | Edge | Hybrid | Enterprise |
|--------|------|--------|------------|
| API Response (p95) | <500ms | <200ms | <100ms |
| Code Gen (simple) | <2s | <1s | <500ms |
| Code Gen (complex) | <10s | <5s | <3s |
| Concurrent Users | 1-10 | 100-500 | 1000+ |
| Availability | 95% | 99% | 99.99% |

---

## Security Features

### Authentication
- OAuth 2.0 / OpenID Connect
- JWT tokens
- API keys

### Authorization
- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)
- Policy engine (OPA)

### Data Protection
- Encryption at rest (AES-256-GCM)
- Encryption in transit (TLS 1.3)
- Sandbox isolation (Rust-based)

### Audit & Compliance
- Comprehensive audit logging
- SOC2, HIPAA, GDPR support
- Real-time threat detection

---

## Data Flow

```
Client → API Gateway → Security Check → Service → Response
                ↓
         Audit Logging
```

### Code Generation Flow
```
Request → Security → Context Retrieval → AI Routing → 
Generate → Validate → Sandbox Test → Store → Return
```

---

## Key Architectural Decisions

1. **Microservices**: Independent scaling, fault isolation
2. **Hybrid AI**: Local + cloud models with intelligent routing
3. **PostgreSQL**: ACID compliance, JSONB support
4. **Rust for Security**: Memory safety, high performance
5. **gRPC Internal**: Type-safe, high-performance communication
6. **Multi-Level Cache**: In-memory → Redis → Database
7. **Kubernetes**: Industry standard orchestration
8. **Event Streaming**: Kafka for audit logs
9. **Vector DB**: Optimized semantic search
10. **OAuth 2.0**: Standard authentication

---

## Quick Start Commands

### Local Development (Docker Compose)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Kubernetes Deployment
```bash
# Deploy to K8s
kubectl apply -f k8s/

# Check status
kubectl get pods -n stark-mcp

# View logs
kubectl logs -f deployment/api-gateway -n stark-mcp
```

### API Testing
```bash
# Generate code
curl -X POST http://localhost:8080/api/v1/codegen/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a REST API endpoint",
    "language": "python"
  }'
```

---

## Monitoring & Observability

### Metrics (Prometheus)
- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: Request latency
- `code_generation_duration_seconds`: Code gen time
- `cache_hit_ratio`: Cache effectiveness

### Dashboards (Grafana)
- System Overview
- Service Health
- Performance Metrics
- Security Events

### Tracing (Jaeger)
- Distributed request tracing
- Service dependency mapping
- Performance bottleneck identification

### Logs (ELK Stack)
- Centralized log aggregation
- Full-text search
- Log analysis and visualization

---

## Common Operations

### Scale Service
```bash
# Kubernetes
kubectl scale deployment api-gateway --replicas=5 -n stark-mcp

# Docker Compose
docker-compose up -d --scale api-gateway=3
```

### Update Configuration
```bash
# Update ConfigMap
kubectl edit configmap stark-config -n stark-mcp

# Restart pods
kubectl rollout restart deployment/api-gateway -n stark-mcp
```

### Backup Database
```bash
# PostgreSQL backup
pg_dump -h localhost -U stark -d stark_mcp > backup.sql

# Restore
psql -h localhost -U stark -d stark_mcp < backup.sql
```

### View Audit Logs
```bash
# Query audit logs
curl -X GET http://localhost:8080/api/v1/security/audit \
  -H "Authorization: Bearer $TOKEN" \
  -G -d "start_date=2026-04-01" -d "end_date=2026-04-27"
```

---

## Troubleshooting

### Service Not Starting
1. Check logs: `docker-compose logs service-name`
2. Verify dependencies: Database, Redis, etc.
3. Check resource limits: CPU, memory
4. Validate configuration: Environment variables

### High Latency
1. Check cache hit ratio
2. Review database query performance
3. Check network latency
4. Review service resource usage

### Authentication Failures
1. Verify JWT token validity
2. Check token expiration
3. Validate user permissions
4. Review security policies

### Memory Issues
1. Check memory usage: `kubectl top pods`
2. Review memory limits
3. Check for memory leaks
4. Optimize cache size

---

## Support & Resources

### Documentation
- Full Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Implementation Roadmap: [`IMPLEMENTATION_ROADMAP.md`](IMPLEMENTATION_ROADMAP.md)
- API Documentation: `/api/docs` (OpenAPI/Swagger)

### Monitoring
- Grafana: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Jaeger: `http://localhost:16686`

### Development
- GitHub Repository: `https://github.com/stark-mcp/stark-mcp`
- Issue Tracker: `https://github.com/stark-mcp/stark-mcp/issues`
- CI/CD: GitHub Actions

---

**Last Updated**: 2026-04-27  
**For detailed information, see**: [`ARCHITECTURE.md`](ARCHITECTURE.md)
