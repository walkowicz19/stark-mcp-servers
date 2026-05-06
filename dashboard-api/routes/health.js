const express = require('express');
const router = express.Router();

// Get overall health status
router.get('/', async (req, res) => {
  try {
    const mcpMonitor = req.app.locals.mcpMonitor;
    const summary = mcpMonitor.getHealthSummary();
    res.json({ health: summary });
  } catch (error) {
    console.error('Error fetching health:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed health status
router.get('/status', async (req, res) => {
  try {
    const mcpMonitor = req.app.locals.mcpMonitor;
    const db = req.app.locals.db;
    
    const summary = mcpMonitor.getHealthSummary();
    const alerts = mcpMonitor.getAlerts();
    
    // Get recent health metrics
    const metrics = db.getHealthMetrics(null, '1h');

    res.json({ 
      status: summary.overallStatus,
      services: summary.services,
      alerts,
      metrics
    });
  } catch (error) {
    console.error('Error fetching health status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get health history
router.get('/history', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const serverId = req.query.server;
    const period = req.query.period || '1h';
    
    const metrics = db.getHealthMetrics(serverId, period);
    res.json({ metrics, period });
  } catch (error) {
    console.error('Error fetching health history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get service-specific health
router.get('/services/:serviceName', async (req, res) => {
  try {
    const mcpMonitor = req.app.locals.mcpMonitor;
    const { serviceName } = req.params;
    
    const service = mcpMonitor.getServiceStatus(serviceName);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Error fetching service health:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trigger health check
router.post('/check', async (req, res) => {
  try {
    const mcpMonitor = req.app.locals.mcpMonitor;
    await mcpMonitor.checkAllServices();
    const summary = mcpMonitor.getHealthSummary();
    res.json({ success: true, health: summary });
  } catch (error) {
    console.error('Error triggering health check:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear health alerts
router.delete('/alerts', async (req, res) => {
  try {
    const mcpMonitor = req.app.locals.mcpMonitor;
    mcpMonitor.clearAlerts();
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
