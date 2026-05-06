const express = require('express');
const router = express.Router();

// Get token usage statistics
router.get('/stats', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const period = req.query.period || '24h';
    const stats = db.getTokenStats(period);
    res.json({ stats, period });
  } catch (error) {
    console.error('Error fetching token stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get token usage history
router.get('/usage', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const filters = {
      model: req.query.model,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: parseInt(req.query.limit) || 100
    };
    const usage = db.getTokenUsage(filters);
    res.json({ usage });
  } catch (error) {
    console.error('Error fetching token usage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get cost projection
router.get('/projection', async (req, res) => {
  try {
    const tokenTracker = req.app.locals.tokenTracker;
    const projection = tokenTracker.getCostProjection();
    res.json({ projection });
  } catch (error) {
    console.error('Error calculating projection:', error);
    res.status(500).json({ error: error.message });
  }
});

// Log token usage
router.post('/log', async (req, res) => {
  try {
    const tokenTracker = req.app.locals.tokenTracker;
    const data = req.body;
    
    if (!data.model || !data.total_tokens) {
      return res.status(400).json({ error: 'model and total_tokens are required' });
    }

    await tokenTracker.trackUsage(data);
    
    req.app.locals.broadcast({
      type: 'token_usage',
      data,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging token usage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get token alerts
router.get('/alerts', async (req, res) => {
  try {
    const tokenTracker = req.app.locals.tokenTracker;
    const alerts = tokenTracker.getAlerts();
    res.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update token thresholds
router.put('/thresholds', async (req, res) => {
  try {
    const tokenTracker = req.app.locals.tokenTracker;
    const thresholds = req.body;
    tokenTracker.setThresholds(thresholds);
    res.json({ success: true, thresholds });
  } catch (error) {
    console.error('Error updating thresholds:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
