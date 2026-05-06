class HallucinationDetector {
  constructor(db) {
    this.db = db;
    this.confidenceThreshold = 0.7;
  }

  async analyzeResponse(model, prompt, response) {
    const analysis = {
      model,
      prompt,
      response,
      confidence_score: this.calculateConfidence(response),
      is_flagged: false,
      verification_result: null,
      timestamp: new Date().toISOString()
    };

    if (analysis.confidence_score < this.confidenceThreshold) {
      analysis.is_flagged = true;
      analysis.verification_result = 'Low confidence - requires verification';
    }

    this.db.logHallucination(analysis);
    return analysis;
  }

  calculateConfidence(response) {
    let score = 1.0;
    
    const uncertainPhrases = [
      'i think', 'maybe', 'possibly', 'might be', 'could be',
      'not sure', 'uncertain', 'probably', 'perhaps'
    ];
    
    const lowerResponse = response.toLowerCase();
    uncertainPhrases.forEach(phrase => {
      if (lowerResponse.includes(phrase)) {
        score -= 0.1;
      }
    });

    if (response.length < 50) {
      score -= 0.1;
    }

    const hasCodeBlocks = /`[\s\S]*`/.test(response);
    const hasStructure = /^#+\s/m.test(response) || /^\d+\.\s/m.test(response);
    if (hasCodeBlocks || hasStructure) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  getRecords(filters = {}) {
    return this.db.getHallucinationRecords(filters);
  }

  getFlaggedRecords() {
    return this.db.getHallucinationRecords({ is_flagged: true });
  }

  getStats() {
    const all = this.db.getHallucinationRecords({ limit: 1000 });
    const flagged = all.filter(r => r.is_flagged);
    
    return {
      total: all.length,
      flagged: flagged.length,
      flaggedPercentage: all.length > 0 ? (flagged.length / all.length * 100).toFixed(2) : 0,
      averageConfidence: all.length > 0 
        ? (all.reduce((sum, r) => sum + r.confidence_score, 0) / all.length).toFixed(3)
        : 0
    };
  }
}

module.exports = HallucinationDetector;
