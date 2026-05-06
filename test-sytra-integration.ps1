# Test Sytra MCP Integration - Simulate MCP usage to populate dashboard

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║          Sytra MCP Integration Test Suite                 ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$dashboardUrl = "http://localhost:3000/api"
$testsPassed = 0
$testsFailed = 0

# Test 1: Add Memory Nodes
Write-Host "Test 1: Creating Memory Nodes..." -ForegroundColor Yellow
try {
    $memoryNodes = @(
        @{nodeId="auth_flow_001"; type="context"; content="User authentication implementation with JWT tokens"; metadata=@{priority="high"}},
        @{nodeId="db_conn_002"; type="code"; content="PostgreSQL connection pool configuration"; metadata=@{language="typescript"}},
        @{nodeId="api_rest_003"; type="api"; content="RESTful API endpoints for user management"; metadata=@{version="v1"}},
        @{nodeId="error_handle_004"; type="context"; content="Global error handling middleware"; metadata=@{priority="medium"}},
        @{nodeId="session_mgmt_005"; type="data"; content="Redis-based session management"; metadata=@{cache="redis"}},
        @{nodeId="security_audit_006"; type="security"; content="Security audit logging system"; metadata=@{compliance="GDPR"}},
        @{nodeId="perf_monitor_007"; type="monitoring"; content="Performance monitoring with Prometheus"; metadata=@{tool="prometheus"}}
    )
    
    foreach ($node in $memoryNodes) {
        $json = $node | ConvertTo-Json -Compress
        $response = Invoke-RestMethod -Uri "$dashboardUrl/memory/nodes" -Method Post -Body $json -ContentType "application/json"
        Write-Host "  ✓ Created node: $($node.nodeId)" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    $testsPassed++
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Add Memory Relationships
Write-Host "`nTest 2: Creating Memory Relationships..." -ForegroundColor Yellow
try {
    $relationships = @(
        @{sourceId="auth_flow_001"; targetId="db_conn_002"; type="depends_on"; weight=5},
        @{sourceId="auth_flow_001"; targetId="session_mgmt_005"; type="uses"; weight=4},
        @{sourceId="api_rest_003"; targetId="auth_flow_001"; type="requires"; weight=5},
        @{sourceId="api_rest_003"; targetId="error_handle_004"; type="handles"; weight=3},
        @{sourceId="db_conn_002"; targetId="perf_monitor_007"; type="monitored_by"; weight=2},
        @{sourceId="security_audit_006"; targetId="auth_flow_001"; type="audits"; weight=4},
        @{sourceId="error_handle_004"; targetId="security_audit_006"; type="logs_to"; weight=3}
    )
    
    foreach ($rel in $relationships) {
        $json = $rel | ConvertTo-Json -Compress
        $response = Invoke-RestMethod -Uri "$dashboardUrl/memory/relationships" -Method Post -Body $json -ContentType "application/json"
        Write-Host "  ✓ Created relationship: $($rel.sourceId) -> $($rel.targetId)" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    $testsPassed++
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 3: Add Token Usage Data
Write-Host "`nTest 3: Logging Token Usage..." -ForegroundColor Yellow
try {
    $tokenUsages = @(
        @{model="gpt-4"; promptTokens=1500; completionTokens=800; totalTokens=2300; cost=0.092; timestamp=(Get-Date).AddHours(-2).ToString("o")},
        @{model="gpt-4"; promptTokens=2200; completionTokens=1100; totalTokens=3300; cost=0.132; timestamp=(Get-Date).AddHours(-1).ToString("o")},
        @{model="gpt-3.5-turbo"; promptTokens=800; completionTokens=400; totalTokens=1200; cost=0.0024; timestamp=(Get-Date).AddMinutes(-30).ToString("o")},
        @{model="gpt-4"; promptTokens=1800; completionTokens=950; totalTokens=2750; cost=0.110; timestamp=(Get-Date).AddMinutes(-15).ToString("o")},
        @{model="gpt-3.5-turbo"; promptTokens=1200; completionTokens=600; totalTokens=1800; cost=0.0036; timestamp=(Get-Date).AddMinutes(-5).ToString("o")}
    )
    
    foreach ($usage in $tokenUsages) {
        $json = $usage | ConvertTo-Json -Compress
        $response = Invoke-RestMethod -Uri "$dashboardUrl/tokens/usage" -Method Post -Body $json -ContentType "application/json"
        Write-Host "  ✓ Logged token usage: $($usage.model) - $($usage.totalTokens) tokens" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    $testsPassed++
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 4: Add Activity Logs
Write-Host "`nTest 4: Creating Activity Logs..." -ForegroundColor Yellow
try {
    $logs = @(
        @{level="info"; message="Code generation completed successfully"; service="codegen"; timestamp=(Get-Date).AddMinutes(-10).ToString("o")},
        @{level="info"; message="Memory node created: auth_flow_001"; service="memory"; timestamp=(Get-Date).AddMinutes(-8).ToString("o")},
        @{level="warning"; message="High token usage detected"; service="tokens"; timestamp=(Get-Date).AddMinutes(-5).ToString("o")},
        @{level="info"; message="Security scan completed - no issues found"; service="security"; timestamp=(Get-Date).AddMinutes(-3).ToString("o")},
        @{level="info"; message="Performance optimization suggestions generated"; service="performance"; timestamp=(Get-Date).AddMinutes(-1).ToString("o")}
    )
    
    foreach ($log in $logs) {
        $json = $log | ConvertTo-Json -Compress
        $response = Invoke-RestMethod -Uri "$dashboardUrl/logs" -Method Post -Body $json -ContentType "application/json"
        Write-Host "  ✓ Created log: [$($log.level)] $($log.message)" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    $testsPassed++
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Verify Dashboard Data
Write-Host "`nTest 5: Verifying Dashboard Data..." -ForegroundColor Yellow
try {
    # Check memory stats
    $memoryStats = Invoke-RestMethod -Uri "$dashboardUrl/memory/stats" -Method Get
    Write-Host "  ✓ Memory Stats: $($memoryStats.stats.totalNodes) nodes, $($memoryStats.stats.totalRelationships) relationships" -ForegroundColor Green
    
    # Check token stats
    $tokenStats = Invoke-RestMethod -Uri "$dashboardUrl/tokens/stats?period=24h" -Method Get
    Write-Host "  ✓ Token Stats: $($tokenStats.stats.Count) usage records" -ForegroundColor Green
    
    # Check health status
    $health = Invoke-RestMethod -Uri "$dashboardUrl/health" -Method Get
    Write-Host "  ✓ Health Status: $($health.health.healthy)/$($health.health.total) services healthy" -ForegroundColor Green
    
    $testsPassed++
} catch {
    Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Test Summary                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "Dashboard URL: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Navigate to the Memory section to see the graph visualization!" -ForegroundColor Cyan
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✓ All tests passed! Dashboard should now display real-time data." -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed. Check the errors above." -ForegroundColor Red
}

# Made with Bob
