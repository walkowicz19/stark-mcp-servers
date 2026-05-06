#!/bin/bash
# Sytra Complete System Startup Script
# Starts all services, Docker containers, and dashboard in one command
#
# Components:
# - 9 Backend Services (Docker containers on ports 8001-8009)
# - Dashboard API (Node.js on port 3000)
# - Dashboard UI (opens in browser)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;37m'
NC='\033[0m'

SKIP_DOCKER=false
SKIP_DASHBOARD=false
NO_BROWSER=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-docker)
            SKIP_DOCKER=true
            shift
            ;;
        --skip-dashboard)
            SKIP_DASHBOARD=true
            shift
            ;;
        --no-browser)
            NO_BROWSER=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--skip-docker] [--skip-dashboard] [--no-browser]"
            exit 1
            ;;
    esac
done

function print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

function test_port() {
    local port=$1
    if command -v nc &> /dev/null; then
        nc -z localhost $port 2>/dev/null
        return $?
    elif command -v telnet &> /dev/null; then
        timeout 1 telnet localhost $port &>/dev/null
        return $?
    else
        # Fallback: try to connect with curl
        curl -s http://localhost:$port &>/dev/null
        return $?
    fi
}

print_color "$CYAN" "\n========================================"
print_color "$CYAN" "  SYTRA COMPLETE SYSTEM STARTUP"
print_color "$CYAN" "========================================\n"

# Check prerequisites
print_color "$MAGENTA" "=== Checking Prerequisites ==="

if [ ! -f "services/docker-compose.yml" ]; then
    print_color "$RED" "ERROR: services/docker-compose.yml not found"
    exit 1
fi

if [ ! -f "dashboard-api/server.js" ]; then
    print_color "$RED" "ERROR: dashboard-api/server.js not found"
    exit 1
fi

if [ ! -f "dashboard/index.html" ]; then
    print_color "$RED" "ERROR: dashboard/index.html not found"
    exit 1
fi

print_color "$GREEN" "All files found"

# Start Backend Services (Docker)
if [ "$SKIP_DOCKER" = false ]; then
    print_color "$MAGENTA" "\n=== Starting Backend Services (Docker) ==="
    
    if ! docker info &> /dev/null; then
        print_color "$RED" "ERROR: Docker is not running. Please start Docker first."
        print_color "$YELLOW" "Tip: You can skip Docker with --skip-docker flag"
        exit 1
    fi
    
    print_color "$GREEN" "Docker is running"
    
    cd services
    print_color "$CYAN" "Starting 9 backend services (ports 8001-8009)..."
    print_color "$YELLOW" "This may take a few minutes on first run (building images)..."
    
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        print_color "$GREEN" "Backend services started successfully"
        
        # Wait for services to be healthy
        print_color "$CYAN" "\nWaiting for services to be healthy..."
        sleep 10
        
        # Check service health
        services=("security" "codegen" "memory" "intelligence" "tokens" "sdlc" "legacy" "schema" "performance")
        ports=(8001 8002 8003 8004 8005 8006 8007 8008 8009)
        
        for i in "${!services[@]}"; do
            service="${services[$i]}"
            port="${ports[$i]}"
            
            if test_port $port; then
                print_color "$GREEN" "  ✓ $service (port $port)"
            else
                print_color "$YELLOW" "  ⚠ $service (port $port) - not responding yet"
            fi
        done
    else
        print_color "$RED" "Failed to start backend services"
        print_color "$YELLOW" "Check logs with: docker-compose logs"
    fi
    
    cd ..
else
    print_color "$YELLOW" "\nSkipping Docker backend services"
fi

# Start Dashboard API
if [ "$SKIP_DASHBOARD" = false ]; then
    print_color "$MAGENTA" "\n=== Starting Dashboard API ==="
    
    # Check if already running
    if test_port 3000; then
        print_color "$YELLOW" "Dashboard API already running on port 3000"
    else
        cd dashboard-api
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            print_color "$CYAN" "Installing dashboard API dependencies..."
            npm install
        fi
        
        print_color "$CYAN" "Starting Dashboard API on port 3000..."
        
        # Start in background
        nohup node server.js > ../dashboard-api.log 2>&1 &
        DASHBOARD_PID=$!
        echo $DASHBOARD_PID > ../dashboard-api.pid
        
        # Wait for API to start
        print_color "$CYAN" "Waiting for Dashboard API to start..."
        max_attempts=30
        attempt=0
        
        while [ $attempt -lt $max_attempts ]; do
            sleep 1
            if test_port 3000; then
                print_color "$GREEN" "Dashboard API started successfully (PID: $DASHBOARD_PID)"
                break
            fi
            attempt=$((attempt + 1))
        done
        
        if [ $attempt -eq $max_attempts ]; then
            print_color "$YELLOW" "Dashboard API did not start within 30 seconds"
        fi
        
        cd ..
    fi
else
    print_color "$YELLOW" "\nSkipping Dashboard API"
fi

# Open Dashboard in Browser
if [ "$NO_BROWSER" = false ] && [ "$SKIP_DASHBOARD" = false ]; then
    print_color "$MAGENTA" "\n=== Opening Dashboard ==="
    
    dashboard_url="http://localhost:3000"
    
    if test_port 3000; then
        print_color "$CYAN" "Opening dashboard at $dashboard_url"
        
        # Open browser based on OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$dashboard_url"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v xdg-open &> /dev/null; then
                xdg-open "$dashboard_url"
            elif command -v gnome-open &> /dev/null; then
                gnome-open "$dashboard_url"
            fi
        fi
    else
        print_color "$YELLOW" "Dashboard API not running, cannot open browser"
        print_color "$YELLOW" "You can manually open: $dashboard_url"
    fi
fi

# Summary
print_color "$CYAN" "\n========================================"
print_color "$CYAN" "  STARTUP COMPLETE"
print_color "$CYAN" "========================================\n"

print_color "$NC" "Services Status:"
if [ "$SKIP_DOCKER" = false ]; then
    print_color "$GREEN" "  Backend Services: Running on ports 8001-8009"
    print_color "$GRAY" "    - Security:      http://localhost:8001"
    print_color "$GRAY" "    - Code Gen:      http://localhost:8002"
    print_color "$GRAY" "    - Memory:        http://localhost:8003"
    print_color "$GRAY" "    - Intelligence:  http://localhost:8004"
    print_color "$GRAY" "    - Tokens:        http://localhost:8005"
    print_color "$GRAY" "    - SDLC:          http://localhost:8006"
    print_color "$GRAY" "    - Legacy:        http://localhost:8007"
    print_color "$GRAY" "    - Schema:        http://localhost:8008"
    print_color "$GRAY" "    - Performance:   http://localhost:8009"
fi

if [ "$SKIP_DASHBOARD" = false ]; then
    print_color "$GREEN" "  Dashboard API:    http://localhost:3000"
    print_color "$GREEN" "  Dashboard UI:     http://localhost:3000"
fi

print_color "$NC" "\nManagement Commands:"
print_color "$GRAY" "  Stop all services:    ./stop-all.sh"
print_color "$GRAY" "  View Docker logs:     cd services && docker-compose logs -f"
print_color "$GRAY" "  Restart services:     cd services && docker-compose restart"
print_color "$GRAY" "  View Dashboard logs:  tail -f dashboard-api.log"

print_color "$NC" "\nFlags:"
print_color "$GRAY" "  --skip-docker      Skip starting Docker backend services"
print_color "$GRAY" "  --skip-dashboard   Skip starting Dashboard API"
print_color "$GRAY" "  --no-browser       Don't open browser automatically"

echo ""

# Made with Bob
