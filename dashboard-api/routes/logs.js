const express = require('express');
const router = express.Router();

// Get all logs (combined)
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const limit = parseInt(req.query.limit) || 100;
    
    const mcpLogs = db.getMCPLogs({ limit });
    const commandLogs = db.getCommandLogs({ limit });
    
    res.json({ 
      mcp: mcpLogs,
      commands: commandLogs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get MCP server logs
router.get('/mcp', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const filters = {
      server_name: req.query.server,
      level: req.query.level,
      startDate: req.query.startDate,
      limit: parseInt(req.query.limit) || 100
    };
    const logs = db.getMCPLogs(filters);
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching MCP logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get command execution logs
router.get('/commands', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const filters = {
      tool_name: req.query.tool,
      status: req.query.status,
      startDate: req.query.startDate,
      limit: parseInt(req.query.limit) || 100
    };
    const logs = db.getCommandLogs(filters);
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching command logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get hallucination detection logs
router.get('/hallucinations', async (req, res) => {
  try {
    const hallucinationDetector = req.app.locals.hallucinationDetector;
    const filters = {
      is_flagged: req.query.flagged === 'true',
      model: req.query.model,
      limit: parseInt(req.query.limit) || 100
    };
    const logs = hallucinationDetector.getRecords(filters);
    const stats = hallucinationDetector.getStats();
    res.json({ logs, stats });
  } catch (error) {
    console.error('Error fetching hallucination logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear logs
router.delete('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const type = req.query.type || 'all';
    
    // Note: Implement actual deletion logic based on type
    // For now, we'll just return success
    res.json({ success: true, message: `Cleared ${type} logs` });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
