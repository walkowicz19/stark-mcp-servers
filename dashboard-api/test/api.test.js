/**
 * Basic API tests for Sytra MCP Dashboard
 * Run with: npm test
 */

const http = require('http');

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('\n🧪 Running Sytra MCP Dashboard API Tests\n');
    
    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed, ${this.tests.length} total\n`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

// HTTP request helper
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Assertion helpers
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

// Test suite
const runner = new TestRunner();

// Health endpoint tests
runner.test('GET /api/health returns 200', async () => {
  const res = await request('/api/health');
  assertEqual(res.statusCode, 200, 'Status code should be 200');
  assert(res.body.health, 'Response should contain health data');
});

runner.test('GET /api/health/status returns detailed status', async () => {
  const res = await request('/api/health/status');
  assertEqual(res.statusCode, 200);
  assert(res.body.status, 'Response should contain status');
  assert(res.body.services, 'Response should contain services');
});

// Models endpoint tests
runner.test('GET /api/models returns models list', async () => {
  const res = await request('/api/models');
  assertEqual(res.statusCode, 200);
  assert(Array.isArray(res.body.models), 'Models should be an array');
});

runner.test('GET /api/models/active returns active models', async () => {
  const res = await request('/api/models/active');
  assertEqual(res.statusCode, 200);
  assert(Array.isArray(res.body.models), 'Active models should be an array');
});

runner.test('POST /api/models creates new model', async () => {
  const res = await request('/api/models', {
    method: 'POST',
    body: {
      model_name: 'test-model',
      temperature: 0.7,
      max_tokens: 2000
    }
  });
  assertEqual(res.statusCode, 200);
  assert(res.body.success, 'Should return success');
});

// Tokens endpoint tests
runner.test('GET /api/tokens/stats returns token statistics', async () => {
  const res = await request('/api/tokens/stats?period=24h');
  assertEqual(res.statusCode, 200);
  assert(res.body.stats, 'Response should contain stats');
});

runner.test('GET /api/tokens/usage returns usage history', async () => {
  const res = await request('/api/tokens/usage');
  assertEqual(res.statusCode, 200);
  assert(res.body.usage, 'Response should contain usage data');
});

runner.test('GET /api/tokens/projection returns cost projection', async () => {
  const res = await request('/api/tokens/projection');
  assertEqual(res.statusCode, 200);
  assert(res.body.projection, 'Response should contain projection');
});

// Logs endpoint tests
runner.test('GET /api/logs returns logs', async () => {
  const res = await request('/api/logs');
  assertEqual(res.statusCode, 200);
  assert(res.body.mcp || res.body.commands, 'Response should contain logs');
});

runner.test('GET /api/logs/mcp returns MCP logs', async () => {
  const res = await request('/api/logs/mcp');
  assertEqual(res.statusCode, 200);
  assert(Array.isArray(res.body.logs), 'Logs should be an array');
});

// Credentials endpoint tests
runner.test('GET /api/credentials returns credentials list', async () => {
  const res = await request('/api/credentials');
  assertEqual(res.statusCode, 200);
  assert(Array.isArray(res.body.credentials), 'Credentials should be an array');
});

// Memory endpoint tests
runner.test('GET /api/memory/graph returns memory graph', async () => {
  const res = await request('/api/memory/graph');
  assertEqual(res.statusCode, 200);
  assert(res.body.nodes, 'Response should contain nodes');
  assert(res.body.relationships, 'Response should contain relationships');
});

runner.test('GET /api/memory/stats returns memory statistics', async () => {
  const res = await request('/api/memory/stats');
  assertEqual(res.statusCode, 200);
  assert(res.body.stats, 'Response should contain stats');
});

// Admin endpoint tests
runner.test('GET /api/admin/password-status returns password status', async () => {
  const res = await request('/api/admin/password-status');
  assertEqual(res.statusCode, 200);
  assert(typeof res.body.configured === 'boolean', 'Should return configured status');
});

// Root API endpoint test
runner.test('GET /api returns API info', async () => {
  const res = await request('/api');
  assertEqual(res.statusCode, 200);
  assert(res.body.name, 'Response should contain API name');
  assert(res.body.version, 'Response should contain version');
  assert(res.body.endpoints, 'Response should contain endpoints');
});

// Error handling tests
runner.test('GET /api/nonexistent returns 404', async () => {
  const res = await request('/api/nonexistent');
  assertEqual(res.statusCode, 404);
});

runner.test('POST /api/models without required fields returns 400', async () => {
  const res = await request('/api/models', {
    method: 'POST',
    body: {}
  });
  assertEqual(res.statusCode, 400);
});

// Wait for server to be ready and run tests
setTimeout(() => {
  runner.run().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}, 2000);

// Made with Bob
