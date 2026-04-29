#!/bin/bash
# Sytra Backend Services Startup Script (Bash)
# Starts all backend services for Sytra MCP

echo "Starting Sytra Backend Services..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running"
    echo "Please start Docker and try again"
    exit 1
fi

echo "Docker is running"

# Navigate to services directory
cd "$(dirname "$0")"

# Start services with Docker Compose
echo ""
echo "Starting services with Docker Compose..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "Services started successfully!"
    echo ""
    echo "Service Status:"
    docker-compose ps
    
    echo ""
    echo "Service URLs:"
    echo "  Security:      http://localhost:8001/docs"
    echo "  Code Gen:      http://localhost:8002/docs"
    echo "  Memory:        http://localhost:8003/docs"
    echo "  Intelligence:  http://localhost:8004/docs"
    echo "  Tokens:        http://localhost:8005/docs"
    echo "  SDLC:          http://localhost:8006/docs"
    echo "  Legacy:        http://localhost:8007/docs"
    echo "  Schema:        http://localhost:8008/docs"
    echo "  Performance:   http://localhost:8009/docs"
    
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop services: docker-compose down"
else
    echo ""
    echo "ERROR: Failed to start services"
    echo "Check the logs with: docker-compose logs"
    exit 1
fi

# Made with Bob
