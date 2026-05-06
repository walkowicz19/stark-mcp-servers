class TokenTracker {
  constructor(db) {
    this.db = db;
    this.alerts = [];
    this.thresholds = {
      hourly: 100000,
      daily: 1000000,
      costPerDay: 50
    };
  }

  async trackUsage(data) {
    this.db.logTokenUsage(data);
    this.checkThresholds();
  }

  getUsageStats(period = '24h') {
    return this.db.getTokenStats(period);
  }

  getUsageHistory(filters = {}) {
    return this.db.getTokenUsage(filters);
  }

  checkThresholds() {
    const hourlyStats = this.db.getTokenStats('1h');
    const dailyStats = this.db.getTokenStats('24h');
    
    const hourlyTotal = hourlyStats.reduce((sum, s) => sum + s.total_tokens, 0);
    const dailyTotal = dailyStats.reduce((sum, s) => sum + s.total_tokens, 0);
    const dailyCost = dailyStats.reduce((sum, s) => sum + (s.total_cost || 0), 0);

    this.alerts = [];

    if (hourlyTotal > this.thresholds.hourly) {
      this.alerts.push({
        level: 'warning',
        message: `Hourly token usage (${hourlyTotal}) exceeded threshold (${this.thresholds.hourly})`,
        timestamp: new Date().toISOString()
      });
    }

    if (dailyTotal > this.thresholds.daily) {
      this.alerts.push({
        level: 'critical',
        message: `Daily token usage (${dailyTotal}) exceeded threshold (${this.thresholds.daily})`,
        timestamp: new Date().toISOString()
      });
    }

    if (dailyCost > this.thresholds.costPerDay) {
      this.alerts.push({
        level: 'warning',
        message: `Daily cost ($${dailyCost.toFixed(2)}) exceeded threshold ($${this.thresholds.costPerDay})`,
        timestamp: new Date().toISOString()
      });
    }
  }

  getAlerts() {
    return this.alerts;
  }

  setThresholds(thresholds) {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  getCostProjection() {
    const stats = this.db.getTokenStats('24h');
    const totalCost = stats.reduce((sum, s) => sum + (s.total_cost || 0), 0);
    return {
      daily: totalCost,
      weekly: totalCost * 7,
      monthly: totalCost * 30,
      yearly: totalCost * 365
    };
  }
}

module.exports = TokenTracker;
