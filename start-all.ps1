# Sytra Complete System Startup Script
# Starts all services, Docker containers, and dashboard in one command
#
# Components:
# - 9 Backend Services (Docker containers on ports 8001-8009)
# - Dashboard API (Node.js on port 3000)
# - Dashboard UI (opens in browser)

param(
    [switch]$SkipDocker,
    [switch]$SkipDashboard,
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-DockerRunning {
    try {
        docker info 2>&1 | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        return $connection.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  SYTRA COMPLETE SYSTEM STARTUP" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

# Check prerequisites
Write-ColorOutput "=== Checking Prerequisites ===" "Magenta"

if (-not (Test-Path "services/docker-compose.yml")) {
    Write-ColorOutput "ERROR: services/docker-compose.yml not found" "Red"
    exit 1
}

if (-not (Test-Path "dashboard-api/server.js")) {
    Write-ColorOutput "ERROR: dashboard-api/server.js not found" "Red"
    exit 1
}

if (-not (Test-Path "dashboard/index.html")) {
    Write-ColorOutput "ERROR: dashboard/index.html not found" "Red"
    exit 1
}

Write-ColorOutput "All files found" "Green"

# Start Backend Services (Docker)
if (-not $SkipDocker) {
    Write-ColorOutput "`n=== Starting Backend Services (Docker) ===" "Magenta"
    
    if (-not (Test-DockerRunning)) {
        Write-ColorOutput "ERROR: Docker is not running. Please start Docker Desktop first." "Red"
        Write-ColorOutput "Tip: You can skip Docker with -SkipDocker flag" "Yellow"
        exit 1
    }
    
    Write-ColorOutput "Docker is running" "Green"
    
    Push-Location services
    try {
        Write-ColorOutput "Starting 9 backend services (ports 8001-8009)..." "Cyan"
        Write-ColorOutput "This may take a few minutes on first run (building images)..." "Yellow"
        
        docker-compose up -d --build
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Backend services started successfully" "Green"
            
            # Wait for services to be healthy
            Write-ColorOutput "`nWaiting for services to be healthy..." "Cyan"
            Start-Sleep -Seconds 10
            
            # Check service health
            $services = @("security", "codegen", "memory", "intelligence", "tokens", "sdlc", "legacy", "schema", "performance")
            $ports = @(8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009)
            
            for ($i = 0; $i -lt $services.Length; $i++) {
                $service = $services[$i]
                $port = $ports[$i]
                
                if (Test-Port -Port $port) {
                    Write-ColorOutput "  ✓ $service (port $port)" "Green"
                }
                else {
                    Write-ColorOutput "  ⚠ $service (port $port) - not responding yet" "Yellow"
                }
            }
        }
        else {
            Write-ColorOutput "Failed to start backend services" "Red"
            Write-ColorOutput "Check logs with: docker-compose logs" "Yellow"
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-ColorOutput "`nSkipping Docker backend services" "Yellow"
}

# Start Dashboard API
if (-not $SkipDashboard) {
    Write-ColorOutput "`n=== Starting Dashboard API ===" "Magenta"
    
    # Check if already running
    if (Test-Port -Port 3000) {
        Write-ColorOutput "Dashboard API already running on port 3000" "Yellow"
    }
    else {
        Push-Location dashboard-api
        try {
            # Check if node_modules exists
            if (-not (Test-Path "node_modules")) {
                Write-ColorOutput "Installing dashboard API dependencies..." "Cyan"
                npm install
            }
            
            Write-ColorOutput "Starting Dashboard API on port 3000..." "Cyan"
            
            # Start in new window
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js"
            
            # Wait for API to start
            Write-ColorOutput "Waiting for Dashboard API to start..." "Cyan"
            $maxAttempts = 30
            $attempt = 0
            
            while ($attempt -lt $maxAttempts) {
                Start-Sleep -Seconds 1
                if (Test-Port -Port 3000) {
                    Write-ColorOutput "Dashboard API started successfully" "Green"
                    break
                }
                $attempt++
            }
            
            if ($attempt -eq $maxAttempts) {
                Write-ColorOutput "Dashboard API did not start within 30 seconds" "Yellow"
            }
        }
        finally {
            Pop-Location
        }
    }
}
else {
    Write-ColorOutput "`nSkipping Dashboard API" "Yellow"
}

# Open Dashboard in Browser
if (-not $NoBrowser -and -not $SkipDashboard) {
    Write-ColorOutput "`n=== Opening Dashboard ===" "Magenta"
    
    $dashboardUrl = "http://localhost:3000"
    
    if (Test-Port -Port 3000) {
        Write-ColorOutput "Opening dashboard at $dashboardUrl" "Cyan"
        Start-Process $dashboardUrl
    }
    else {
        Write-ColorOutput "Dashboard API not running, cannot open browser" "Yellow"
        Write-ColorOutput "You can manually open: $dashboardUrl" "Yellow"
    }
}

# Summary
Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  STARTUP COMPLETE" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

Write-ColorOutput "Services Status:" "White"
if (-not $SkipDocker) {
    Write-ColorOutput "  Backend Services: Running on ports 8001-8009" "Green"
    Write-ColorOutput "    - Security:      http://localhost:8001" "Gray"
    Write-ColorOutput "    - Code Gen:      http://localhost:8002" "Gray"
    Write-ColorOutput "    - Memory:        http://localhost:8003" "Gray"
    Write-ColorOutput "    - Intelligence:  http://localhost:8004" "Gray"
    Write-ColorOutput "    - Tokens:        http://localhost:8005" "Gray"
    Write-ColorOutput "    - SDLC:          http://localhost:8006" "Gray"
    Write-ColorOutput "    - Legacy:        http://localhost:8007" "Gray"
    Write-ColorOutput "    - Schema:        http://localhost:8008" "Gray"
    Write-ColorOutput "    - Performance:   http://localhost:8009" "Gray"
}

if (-not $SkipDashboard) {
    Write-ColorOutput "  Dashboard API:    http://localhost:3000" "Green"
    Write-ColorOutput "  Dashboard UI:     http://localhost:3000" "Green"
}

Write-ColorOutput "`nManagement Commands:" "White"
Write-ColorOutput "  Stop all services:    .\stop-all.ps1" "Gray"
Write-ColorOutput "  View Docker logs:     cd services; docker-compose logs -f" "Gray"
Write-ColorOutput "  Restart services:     cd services; docker-compose restart" "Gray"

Write-ColorOutput "`nFlags:" "White"
Write-ColorOutput "  -SkipDocker      Skip starting Docker backend services" "Gray"
Write-ColorOutput "  -SkipDashboard   Skip starting Dashboard API" "Gray"
Write-ColorOutput "  -NoBrowser       Don't open browser automatically" "Gray"

Write-ColorOutput "`n"

# Made with Bob
