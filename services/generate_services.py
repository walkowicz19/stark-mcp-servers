#!/usr/bin/env python3
"""
Service Generator Script
Generates all Sytra backend services from templates
"""

import os
import json
from pathlib import Path

# Service definitions
SERVICES = {
    "codegen": {
        "port": 8002,
        "name": "Code Generation",
        "description": "Code generation, validation, and refactoring service",
        "endpoints": [
            ("POST", "/generate", "Generate code from requirements"),
            ("POST", "/validate", "Validate code syntax and structure"),
            ("POST", "/refactor", "Refactor code for improvements"),
            ("POST", "/explain", "Explain code functionality"),
            ("POST", "/generate-tests", "Generate unit tests"),
            ("POST", "/optimize", "Optimize code performance"),
        ]
    },
    "memory": {
        "port": 8003,
        "name": "Memory Management",
        "description": "Context storage and retrieval service",
        "endpoints": [
            ("POST", "/store", "Store context data"),
            ("GET", "/retrieve", "Retrieve stored context"),
            ("DELETE", "/clear", "Clear context data"),
            ("GET", "/search", "Search context by query"),
            ("POST", "/update", "Update existing context"),
        ]
    },
    "intelligence": {
        "port": 8004,
        "name": "Intelligence Amplification",
        "description": "Prompt optimization and code intelligence service",
        "endpoints": [
            ("POST", "/prompt/optimize", "Optimize prompts for better results"),
            ("POST", "/task/decompose", "Decompose complex tasks"),
            ("POST", "/reasoning/chain", "Chain-of-thought reasoning"),
            ("POST", "/rag/query", "RAG-based query answering"),
            ("POST", "/model/route", "Route to appropriate model"),
            ("POST", "/repositories/index", "Index code repository"),
            ("POST", "/search/semantic", "Semantic code search"),
            ("POST", "/dependencies/analyze", "Analyze code dependencies"),
            ("POST", "/symbols/references", "Find symbol references"),
            ("POST", "/analysis/complexity", "Analyze code complexity"),
        ]
    },
    "tokens": {
        "port": 8005,
        "name": "Token Optimization",
        "description": "Token counting, compression, and optimization service",
        "endpoints": [
            ("POST", "/count", "Count tokens in text"),
            ("POST", "/compress", "Compress text to reduce tokens"),
            ("POST", "/optimize", "Optimize text for token efficiency"),
            ("POST", "/estimate-cost", "Estimate API cost"),
            ("POST", "/split", "Split text into chunks"),
        ]
    },
    "sdlc": {
        "port": 8006,
        "name": "SDLC Integration",
        "description": "Software development lifecycle integration service",
        "endpoints": [
            ("POST", "/generate-tests", "Generate test cases"),
            ("POST", "/generate-documentation", "Generate documentation"),
            ("POST", "/analyze-coverage", "Analyze test coverage"),
            ("POST", "/create-pr", "Create pull request"),
            ("POST", "/review-code", "Automated code review"),
        ]
    },
    "legacy": {
        "port": 8007,
        "name": "Legacy Support",
        "description": "Legacy code analysis and modernization service",
        "endpoints": [
            ("POST", "/parse_cobol", "Parse COBOL code"),
            ("POST", "/analyze_complexity", "Analyze code complexity"),
            ("POST", "/analyze_dependencies", "Analyze dependencies"),
            ("POST", "/translate_cobol_to_python", "Translate COBOL to Python"),
            ("POST", "/generate_migration_plan", "Generate migration plan"),
            ("POST", "/assess_system", "Assess legacy system"),
        ]
    },
    "schema": {
        "port": 8008,
        "name": "Schema Intelligence",
        "description": "Database schema analysis and optimization service",
        "endpoints": [
            ("POST", "/analyze", "Analyze database schema"),
            ("POST", "/optimize", "Optimize schema design"),
            ("POST", "/generate-migrations", "Generate migration scripts"),
            ("POST", "/validate", "Validate schema structure"),
            ("POST", "/suggest-indexes", "Suggest index improvements"),
        ]
    },
    "performance": {
        "port": 8009,
        "name": "Performance Optimizer",
        "description": "Performance profiling and optimization service",
        "endpoints": [
            ("POST", "/profile", "Profile code performance"),
            ("POST", "/optimize_algorithm", "Optimize algorithm"),
            ("POST", "/analyze_bottlenecks", "Analyze performance bottlenecks"),
            ("POST", "/suggest_improvements", "Suggest performance improvements"),
            ("POST", "/benchmark", "Benchmark code execution"),
        ]
    }
}

def generate_service_main(service_key, service_info):
    """Generate main.py for a service"""
    endpoints_code = []
    
    for method, path, description in service_info["endpoints"]:
        endpoint_name = path.strip("/").replace("/", "_").replace("-", "_")
        endpoints_code.append(f'''
        @self.app.{method.lower()}("{path}")
        async def {endpoint_name}(request: dict):
            """{description}"""
            self.log_info(f"{{request}} received at {path}")
            return {{
                "status": "success",
                "message": "{description}",
                "data": {{"result": "Mock implementation - replace with actual logic"}}
            }}
''')
    
    return f'''"""
{service_info["name"]} Service
{service_info["description"]}
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from fastapi import HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from shared.base_service import BaseService


class {service_key.capitalize()}Service(BaseService):
    def __init__(self):
        super().__init__(
            name="{service_info["name"]}",
            version="1.0.0",
            description="{service_info["description"]}"
        )
        self.register_endpoints()
    
    def register_endpoints(self):
        """Register all service endpoints"""
        {''.join(endpoints_code)}

# Create service instance
service = {service_key.capitalize()}Service()
app = service.get_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port={service_info["port"]})
'''

def generate_dockerfile(service_key, port):
    """Generate Dockerfile for a service"""
    return f'''FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy and install shared requirements
COPY shared/requirements.txt /app/shared/requirements.txt
RUN pip install --no-cache-dir -r shared/requirements.txt

# Copy shared code
COPY shared /app/shared

# Copy service code
COPY {service_key} /app/{service_key}

WORKDIR /app/{service_key}

# Expose port
EXPOSE {port}

# Run service
CMD ["python", "main.py"]
'''

def main():
    """Generate all services"""
    services_dir = Path(__file__).parent
    
    print("Generating Sytra backend services...")
    print(f"Services directory: {services_dir}")
    
    for service_key, service_info in SERVICES.items():
        service_dir = services_dir / service_key
        service_dir.mkdir(exist_ok=True)
        
        print(f"\nGenerating {service_info['name']} ({service_key})...")
        
        # Generate main.py
        main_py = service_dir / "main.py"
        main_py.write_text(generate_service_main(service_key, service_info))
        print(f"  [OK] Created {main_py}")
        
        # Generate Dockerfile
        dockerfile = service_dir / "Dockerfile"
        dockerfile.write_text(generate_dockerfile(service_key, service_info["port"]))
        print(f"  [OK] Created {dockerfile}")
        
        # Create __init__.py
        init_py = service_dir / "__init__.py"
        init_py.write_text(f'"""{service_info["name"]} Service"""')
        print(f"  [OK] Created {init_py}")
    
    print("\n[SUCCESS] All services generated successfully!")
    print("\nNext steps:")
    print("1. Review generated services in services/ directory")
    print("2. Start services: cd services && docker-compose up -d")
    print("3. Test services: curl http://localhost:8001/health")
    print("4. View API docs: http://localhost:8001/docs")

if __name__ == "__main__":
    main()

# Made with Bob
