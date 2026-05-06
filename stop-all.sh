#!/bin/bash
# Sytra Complete System Shutdown Script
# Stops all services, Docker containers, and dashboard

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

function print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_color "$CYAN" "\n========================================"
print_color "$CYAN" "  SYTRA COMPLETE SYSTEM SHUTDOWN"
print_color "$CYAN" "========================================\n"

# Stop Dashboard API
print_color "$CYAN" "=== Stopping Dashboard API ==="

if [ -f "dashboard-api.pid" ]; then
    DASHBOARD_PID=$(cat dashboard-api.pid)
    if ps -p $DASHBOARD_PID > /dev/null 2>&1; then
        print_color "$CYAN" "Stopping Dashboard API (PID: $DASHBOARD_PID)..."
        kill $DASHBOARD_PID
        rm dashboard-api.pid
        print_color "$GREEN" "Dashboard API stopped"
    else
        print_color "$YELLOW" "Dashboard API process not found"
        rm dashboard-api.pid
    fi
else
    # Try to find and kill node processes running server.js
    PIDS=$(pgrep -f "node.*server.js" || true)
    if [ -n "$PIDS" ]; then
        print_color "$CYAN" "Stopping Dashboard API processes..."
        echo "$PIDS" | xargs kill 2>/dev/null || true
        print_color "$GREEN" "Dashboard API stopped"
    else
        print_color "$YELLOW" "No Dashboard API processes found"
    fi
fi

# Stop Backend Services (Docker)
print_color "$CYAN" "\n=== Stopping Backend Services (Docker) ==="

if [ -f "services/docker-compose.yml" ]; then
    cd services
    print_color "$CYAN" "Stopping Docker containers..."
    docker-compose down
    
    if [ $? -eq 0 ]; then
        print_color "$GREEN" "Backend services stopped successfully"
    else
        print_color "$YELLOW" "Failed to stop some backend services"
    fi
    cd ..
else
    print_color "$YELLOW" "services/docker-compose.yml not found"
fi

# Summary
print_color "$CYAN" "\n========================================"
print_color "$CYAN" "  SHUTDOWN COMPLETE"
print_color "$CYAN" "========================================\n"

print_color "$GREEN" "All Sytra services have been stopped."
print_color "$NC" "\nTo start again, run: ./start-all.sh\n"

# Made with Bob
