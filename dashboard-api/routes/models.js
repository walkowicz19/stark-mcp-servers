const express = require('express');
const router = express.Router();

// Get all model configurations
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const models = db.getAllModelConfigs();
    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get active models
router.get('/active', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const models = db.getAllModelConfigs().filter(m => m.is_active);
    res.json({ models });
  } catch (error) {
    console.error('Error fetching active models:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get tracked models from usage
router.get('/tracked', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const period = req.query.period || '30d';
    const models = db.getDistinctTrackedModels(period);
    res.json({ models });
  } catch (error) {
    console.error('Error fetching tracked models:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add or update model configuration
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const modelData = req.body;
    
    if (!modelData.model_name) {
      return res.status(400).json({ error: 'model_name is required' });
    }

    db.saveModelConfig(modelData);
    
    // Broadcast update
    req.app.locals.broadcast({
      type: 'model_config_updated',
      data: modelData,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, model: modelData });
  } catch (error) {
    console.error('Error saving model:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update model configuration
router.put('/:modelName', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { modelName } = req.params;
    const updates = req.body;
    
    const existing = db.getModelConfig(modelName);
    if (!existing) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const updated = { ...existing, ...updates, model_name: modelName };
    db.saveModelConfig(updated);
    
    req.app.locals.broadcast({
      type: 'model_config_updated',
      data: updated,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, model: updated });
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete model configuration
router.delete('/:modelName', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { modelName } = req.params;
    
    // Note: We don't actually delete, just mark as inactive
    const existing = db.getModelConfig(modelName);
    if (!existing) {
      return res.status(404).json({ error: 'Model not found' });
    }

    db.saveModelConfig({ ...existing, is_active: false });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
