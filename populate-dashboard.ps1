# Populate Dashboard with Sample Data

$baseUrl = "http://localhost:3000/api"

Write-Host "Populating dashboard with sample data..." -ForegroundColor Cyan

# Add memory nodes
Write-Host "`nAdding memory nodes..." -ForegroundColor Yellow
$nodes = @(
    @{nodeId="auth_001"; type="context"; content="User authentication flow"; metadata=@{}},
    @{nodeId="db_002"; type="code"; content="Database connection logic"; metadata=@{}},
    @{nodeId="api_003"; type="api"; content="REST API endpoints"; metadata=@{}},
    @{nodeId="error_004"; type="context"; content="Error handling"; metadata=@{}},
    @{nodeId="session_005"; type="data"; content="Session management"; metadata=@{}}
)

foreach ($node in $nodes) {
    try {
        $json = $node | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri "$baseUrl/memory/nodes" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "  Added: $($node.nodeId)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($node.nodeId)" -ForegroundColor Red
    }
}

# Add relationships
Write-Host "`nAdding relationships..." -ForegroundColor Yellow
$rels = @(
    @{sourceId="auth_001"; targetId="db_002"; type="depends_on"; weight=5},
    @{sourceId="db_002"; targetId="api_003"; type="uses"; weight=3},
    @{sourceId="api_003"; targetId="error_004"; type="handles"; weight=2},
    @{sourceId="auth_001"; targetId="session_005"; type="relates_to"; weight=4}
)

foreach ($rel in $rels) {
    try {
        $json = $rel | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri "$baseUrl/memory/relationships" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "  Added: $($rel.sourceId) -> $($rel.targetId)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($rel.sourceId) -> $($rel.targetId)" -ForegroundColor Red
    }
}

# Add token usage
Write-Host "`nAdding token usage..." -ForegroundColor Yellow
$tokens = @(
    @{model="gpt-4"; promptTokens=1500; completionTokens=800; totalTokens=2300; cost=0.092},
    @{model="gpt-4"; promptTokens=2200; completionTokens=1100; totalTokens=3300; cost=0.132},
    @{model="gpt-3.5-turbo"; promptTokens=800; completionTokens=400; totalTokens=1200; cost=0.0024}
)

foreach ($token in $tokens) {
    try {
        $json = $token | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri "$baseUrl/tokens/usage" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "  Added: $($token.model) - $($token.totalTokens) tokens" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($token.model)" -ForegroundColor Red
    }
}

# Add logs
Write-Host "`nAdding activity logs..." -ForegroundColor Yellow
$logs = @(
    @{level="info"; message="Code generation completed"; service="codegen"},
    @{level="info"; message="Memory node created"; service="memory"},
    @{level="warning"; message="High token usage detected"; service="tokens"},
    @{level="info"; message="Security scan completed"; service="security"}
)

foreach ($log in $logs) {
    try {
        $json = $log | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri "$baseUrl/logs" -Method Post -Body $json -ContentType "application/json" | Out-Null
        Write-Host "  Added: [$($log.level)] $($log.message)" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($log.message)" -ForegroundColor Red
    }
}

Write-Host "`nDone! Visit http://localhost:3000 to see the dashboard." -ForegroundColor Cyan

# Made with Bob
