# Sytra Backend Services Startup Script (PowerShell)
# Starts all backend services for Sytra MCP

Write-Host "Starting Sytra Backend Services..." -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker is running" -ForegroundColor Green

# Navigate to services directory
$servicesDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $servicesDir

# Start services with Docker Compose
Write-Host ""
Write-Host "Starting services with Docker Compose..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "Service URLs:" -ForegroundColor Cyan
    Write-Host "  Security:      http://localhost:8001/docs" -ForegroundColor White
    Write-Host "  Code Gen:      http://localhost:8002/docs" -ForegroundColor White
    Write-Host "  Memory:        http://localhost:8003/docs" -ForegroundColor White
    Write-Host "  Intelligence:  http://localhost:8004/docs" -ForegroundColor White
    Write-Host "  Tokens:        http://localhost:8005/docs" -ForegroundColor White
    Write-Host "  SDLC:          http://localhost:8006/docs" -ForegroundColor White
    Write-Host "  Legacy:        http://localhost:8007/docs" -ForegroundColor White
    Write-Host "  Schema:        http://localhost:8008/docs" -ForegroundColor White
    Write-Host "  Performance:   http://localhost:8009/docs" -ForegroundColor White
    
    Write-Host ""
    Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "To stop services: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to start services" -ForegroundColor Red
    Write-Host "Check the logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}

# Made with Bob
