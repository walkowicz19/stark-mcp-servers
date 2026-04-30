const express = require('express');
const router = express.Router();

function getAvailableModels() {
  return [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable GPT-4 model' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Faster and cheaper GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and efficient' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', description: 'Most capable Claude model' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', description: 'Balanced performance' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fast and affordable' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Latest Claude model' }
  ];
}

function inferProvider(modelName = '') {
  const normalized = modelName.toLowerCase();
  if (normalized.includes('claude')) return 'Anthropic';
  if (normalized.includes('gpt')) return 'OpenAI';
  if (normalized.includes('gemini')) return 'Google';
  if (normalized.includes('llama')) return 'Meta';
  if (normalized.includes('mistral')) return 'Mistral';
  return 'Unknown';
}

// Get all model configurations
router.get('/', (req, res) => {
  try {
    const { db } = req.app.locals;
    const configuredModels = db.getAllModelConfigs();
    const trackedModels = db.getDistinctTrackedModels(req.query.period || '30d');

    const configuredMap = new Map(configuredModels.map(model => [model.model_name, model]));
    const mergedModels = [...configuredModels];

    trackedModels.forEach(tracked => {
      if (!configuredMap.has(tracked.model)) {
        mergedModels.push({
          model_name: tracked.model,
          provider: inferProvider(tracked.model),
          source: 'tracked',
          is_active: 1,
          last_seen: tracked.last_seen,
          metadata: JSON.stringify({
            tracked_only: true,
            request_count: tracked.request_count,
            total_tokens: tracked.total_tokens
          })
        });
      }
    });
    
    res.json({
      success: true,
      models: mergedModels,
      tracked: trackedModels,
      available: getAvailableModels(),
      count: mergedModels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific model configuration
router.get('/:modelName', (req, res) => {
  try {
    const { db } = req.app.locals;
    const model = db.getModelConfig(req.params.modelName);
    
    if (!model) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }
    
    res.json({
      success: true,
      data: model
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create or update model configuration
router.post('/', (req, res) => {
  try {
    const { db, broadcast } = req.app.locals;
    const config = req.body;
    
    // Validate required fields
    if (!config.model_name) {
      return res.status(400).json({
        success: false,
        error: 'model_name is required'
      });
    }
    
    // Set defaults
    const modelConfig = {
      model_name: config.model_name,
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 2000,
      top_p: config.top_p || 1.0,
      frequency_penalty: config.frequency_penalty || 0.0,
      presence_penalty: config.presence_penalty || 0.0,
      is_active: config.is_active !== undefined ? config.is_active : true,
      provider: config.provider || inferProvider(config.model_name),
      source: config.source || 'manual',
      last_seen: config.last_seen || new Date().toISOString(),
      metadata: config.metadata || {}
    };
    
    db.saveModelConfig(modelConfig);
    
    // Broadcast update
    broadcast({
      type: 'model_config_updated',
      data: modelConfig,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: modelConfig,
      message: 'Model configuration saved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update model configuration
router.put('/:modelName', (req, res) => {
  try {
    const { db, broadcast } = req.app.locals;
    const existingModel = db.getModelConfig(req.params.modelName);
    
    if (!existingModel) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }
    
    const updates = req.body;
    const modelConfig = {
      model_name: req.params.modelName,
      temperature: updates.temperature !== undefined ? updates.temperature : existingModel.temperature,
      max_tokens: updates.max_tokens !== undefined ? updates.max_tokens : existingModel.max_tokens,
      top_p: updates.top_p !== undefined ? updates.top_p : existingModel.top_p,
      frequency_penalty: updates.frequency_penalty !== undefined ? updates.frequency_penalty : existingModel.frequency_penalty,
      presence_penalty: updates.presence_penalty !== undefined ? updates.presence_penalty : existingModel.presence_penalty,
      is_active: updates.is_active !== undefined ? updates.is_active : existingModel.is_active,
      provider: updates.provider !== undefined ? updates.provider : existingModel.provider,
      source: updates.source !== undefined ? updates.source : existingModel.source,
      last_seen: updates.last_seen !== undefined ? updates.last_seen : existingModel.last_seen,
      metadata: updates.metadata !== undefined ? updates.metadata : (existingModel.metadata ? JSON.parse(existingModel.metadata) : {})
    };
    
    db.saveModelConfig(modelConfig);
    
    // Broadcast update
    broadcast({
      type: 'model_config_updated',
      data: modelConfig,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: modelConfig,
      message: 'Model configuration updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get model performance metrics
router.get('/:modelName/metrics', (req, res) => {
  try {
    const { db, tokenTracker, hallucinationDetector } = req.app.locals;
    const modelName = req.params.modelName;
    const period = req.query.period || '24h';
    
    // Get token usage for this model
    const tokenUsage = db.getTokenUsage({
      model: modelName,
      limit: 1000
    });
    
    // Calculate metrics
    const totalTokens = tokenUsage.reduce((sum, u) => sum + u.total_tokens, 0);
    const totalCost = tokenUsage.reduce((sum, u) => sum + (u.cost || 0), 0);
    const avgTokens = tokenUsage.length > 0 ? totalTokens / tokenUsage.length : 0;
    
    // Get hallucination stats for this model
    const hallucinationRecords = db.getHallucinationRecords({
      model: modelName,
      limit: 1000
    });
    
    const flaggedCount = hallucinationRecords.filter(r => r.is_flagged).length;
    const avgConfidence = hallucinationRecords.length > 0
      ? hallucinationRecords.reduce((sum, r) => sum + r.confidence_score, 0) / hallucinationRecords.length
      : 0;
    
    res.json({
      success: true,
      data: {
        model: modelName,
        period,
        token_usage: {
          total_tokens: totalTokens,
          total_cost: totalCost,
          avg_tokens_per_request: avgTokens,
          request_count: tokenUsage.length
        },
        hallucination_detection: {
          total_checks: hallucinationRecords.length,
          flagged_count: flaggedCount,
          flag_rate: hallucinationRecords.length > 0 ? flaggedCount / hallucinationRecords.length : 0,
          avg_confidence: avgConfidence
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available models (predefined list)
router.get('/available/list', (req, res) => {
  const availableModels = getAvailableModels();
  
  res.json({
    success: true,
    data: availableModels,
    count: availableModels.length
  });
});

module.exports = router;

// Made with Bob
