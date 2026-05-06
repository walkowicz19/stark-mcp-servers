class MCPMonitor {
  constructor(db) {
    this.db = db;
    this.services = new Map();
    this.monitoringInterval = null;
    this.checkInterval = 30000;
    this.alerts = [];
  }

  registerService(name, config) {
    this.services.set(name, {
      name,
      url: config.url,
      status: 'unknown',
      lastCheck: null,
      responseTime: null,
      errorCount: 0,
      ...config
    });
  }

  async checkService(name) {
    const service = this.services.get(name);
    if (!service) return;

    const startTime = Date.now();
    try {
      const response = await fetch(`${service.url}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      const status = response.ok ? 'healthy' : 'unhealthy';

      service.status = status;
      service.lastCheck = new Date().toISOString();
      service.responseTime = responseTime;
      service.errorCount = 0;

      this.db.logHealthMetric({
        service_name: name,
        status,
        response_time: responseTime,
        error_rate: 0
      });

      if (responseTime > 1000) {
        this.addAlert('warning', `${name} response time high: ${responseTime}ms`);
      }
    } catch (error) {
      service.status = 'error';
      service.lastCheck = new Date().toISOString();
      service.errorCount++;

      this.db.logHealthMetric({
        service_name: name,
        status: 'error',
        error_rate: 1
      });

      this.addAlert('error', `${name} health check failed: ${error.message}`);
    }
  }

  async checkAllServices() {
    const checks = Array.from(this.services.keys()).map(name => this.checkService(name));
    await Promise.all(checks);
  }

  startMonitoring() {
    if (this.monitoringInterval) return;
    
    this.checkAllServices();
    this.monitoringInterval = setInterval(() => {
      this.checkAllServices();
    }, this.checkInterval);
    
    console.log('MCP monitoring started');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('MCP monitoring stopped');
    }
  }

  getHealthSummary() {
    const services = Array.from(this.services.values());
    const healthy = services.filter(s => s.status === 'healthy').length;
    const unhealthy = services.filter(s => s.status === 'unhealthy').length;
    const error = services.filter(s => s.status === 'error').length;
    const unknown = services.filter(s => s.status === 'unknown').length;

    return {
      total: services.length,
      healthy,
      unhealthy,
      error,
      unknown,
      overallStatus: error > 0 ? 'critical' : unhealthy > 0 ? 'degraded' : healthy === services.length ? 'healthy' : 'unknown',
      services: services.map(s => ({
        name: s.name,
        status: s.status,
        lastCheck: s.lastCheck,
        responseTime: s.responseTime
      }))
    };
  }

  getServiceStatus(name) {
    return this.services.get(name);
  }

  addAlert(level, message) {
    this.alerts.push({
      level,
      message,
      timestamp: new Date().toISOString()
    });
    
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  getAlerts() {
    return this.alerts;
  }

  clearAlerts() {
    this.alerts = [];
  }
}

module.exports = MCPMonitor;
