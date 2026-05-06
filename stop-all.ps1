# Sytra Complete System Shutdown Script
# Stops all services, Docker containers, and dashboard

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  SYTRA COMPLETE SYSTEM SHUTDOWN" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

# Stop Dashboard API
Write-ColorOutput "=== Stopping Dashboard API ===" "Magenta"
$dashboardProcesses = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*dashboard-api*" -or 
    ($_.CommandLine -like "*server.js*" -and $_.CommandLine -like "*dashboard-api*")
}

if ($dashboardProcesses) {
    Write-ColorOutput "Stopping Dashboard API processes..." "Cyan"
    $dashboardProcesses | Stop-Process -Force
    Write-ColorOutput "Dashboard API stopped" "Green"
}
else {
    Write-ColorOutput "No Dashboard API processes found" "Yellow"
}

# Stop Backend Services (Docker)
Write-ColorOutput "`n=== Stopping Backend Services (Docker) ===" "Magenta"

if (Test-Path "services/docker-compose.yml") {
    Push-Location services
    try {
        Write-ColorOutput "Stopping Docker containers..." "Cyan"
        docker-compose down
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Backend services stopped successfully" "Green"
        }
        else {
            Write-ColorOutput "Failed to stop some backend services" "Yellow"
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-ColorOutput "services/docker-compose.yml not found" "Yellow"
}

# Summary
Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  SHUTDOWN COMPLETE" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

Write-ColorOutput "All Sytra services have been stopped." "Green"
Write-ColorOutput "`nTo start again, run: .\start-all.ps1`n" "Gray"

# Made with Bob
