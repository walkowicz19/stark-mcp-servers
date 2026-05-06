// Main Dashboard Application
class Dashboard {
  constructor() {
    this.currentSection = 'overview';
    this.refreshInterval = null;
    this.refreshRate = 30000; // 30 seconds
    this.charts = {};
    this.init();
  }

  async init() {
    console.log('Initializing Sytra MCP Dashboard...');
    
    // Set up navigation
    this.setupNavigation();
    
    // Set up WebSocket listeners
    this.setupWebSocketListeners();
    
    // Load initial data
    await this.loadInitialData();
    
    // Start auto-refresh
    this.startAutoRefresh();
    
    console.log('Dashboard initialized successfully');
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === sectionId) {
        item.classList.add('active');
      }
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
      if (section.id === sectionId) {
        section.classList.add('active');
      }
    });

    this.currentSection = sectionId;
    
    // Load section-specific data
    this.loadSectionData(sectionId);
  }

  async loadInitialData() {
    try {
      // Load overview data
      await this.loadOverviewData();
      
      // Load models
      await this.loadModels();
      
      // Load health status
      await this.loadHealthStatus();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.showError('Failed to load dashboard data');
    }
  }

  async loadSectionData(sectionId) {
    switch (sectionId) {
      case 'overview':
        await this.loadOverviewData();
        break;
      case 'models':
        await this.loadModels();
        break;
      case 'tokens':
        await this.loadTokenData();
        break;
      case 'logs':
        await this.loadLogs();
        break;
      case 'credentials':
        await this.loadCredentials();
        break;
      case 'security':
        await this.loadSecurityData();
        break;
      case 'memory':
        await this.loadMemoryData();
        break;
      case 'health':
        await this.loadHealthStatus();
        break;
    }
  }

  async loadOverviewData() {
    try {
      // Load health summary
      const health = await api.getHealthStatus();
      this.updateHealthOverview(health);

      // Load token stats
      const tokenStats = await api.getTokenStats('24h');
      this.updateTokenOverview(tokenStats);

      // Load memory stats
      const memoryStats = await api.getMemoryStats();
      this.updateMemoryOverview(memoryStats);

      // Load recent activity
      const logs = await api.getLogs({ limit: 10 });
      this.updateRecentActivity(logs);

    } catch (error) {
      console.error('Error loading overview data:', error);
    }
  }

  updateHealthOverview(health) {
    const statusEl = document.getElementById('overviewHealth');
    const healthyEl = document.getElementById('healthyServers');
    const unhealthyEl = document.getElementById('unhealthyServers');

    // Handle the actual API response structure
    const status = health.status || 'unknown';
    const services = health.services || [];
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const unhealthyCount = services.filter(s => s.status !== 'healthy').length;

    if (statusEl) {
      statusEl.querySelector('.metric-value').textContent = status.toUpperCase();
      statusEl.querySelector('.metric-value').className = `metric-value status-${status}`;
    }

    if (healthyEl) {
      healthyEl.textContent = healthyCount;
    }

    if (unhealthyEl) {
      unhealthyEl.textContent = unhealthyCount;
    }

    // Update system status indicator
    this.updateSystemStatus(status);
  }

  updateTokenOverview(stats) {
    const totalTokensEl = document.getElementById('totalTokens');
    const totalCostEl = document.getElementById('totalCost');
    const totalRequestsEl = document.getElementById('totalRequests');

    if (stats && stats.summary) {
      if (totalTokensEl) {
        totalTokensEl.textContent = this.formatNumber(stats.summary.total_tokens || 0);
      }
      if (totalCostEl) {
        totalCostEl.textContent = `$${(stats.summary.total_cost || 0).toFixed(2)}`;
      }
      if (totalRequestsEl) {
        totalRequestsEl.textContent = this.formatNumber(stats.summary.request_count || 0);
      }
    }
  }

  updateMemoryOverview(stats) {
    const nodesEl = document.getElementById('memoryNodes');
    const relationshipsEl = document.getElementById('memoryRelationships');
    const accessEl = document.getElementById('memoryAccess');

    // Handle the actual API response structure from /api/memory/stats
    const actualStats = stats.stats || stats;
    
    if (actualStats) {
      if (nodesEl) {
        nodesEl.textContent = this.formatNumber(actualStats.totalNodes || 0);
      }
      if (relationshipsEl) {
        relationshipsEl.textContent = this.formatNumber(actualStats.totalRelationships || 0);
      }
      if (accessEl) {
        // Calculate total access from mostAccessed array
        const totalAccess = (actualStats.mostAccessed || []).reduce((sum, node) => sum + (node.access_count || 0), 0);
        accessEl.textContent = this.formatNumber(totalAccess);
      }
    }
  }

  updateRecentActivity(logs) {
    const activityEl = document.getElementById('recentActivity');
    if (!activityEl) return;

    if (!logs || !logs.logs || logs.logs.length === 0) {
      activityEl.innerHTML = '<p class="no-data">No recent activity</p>';
      return;
    }

    activityEl.innerHTML = logs.logs.map(log => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="bi bi-circle-fill" style="color: ${this.getLevelColor(log.level)}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${this.escapeHtml(log.message)}</div>
          <div class="activity-meta">
            <span>${log.server_name || 'System'}</span>
            <span>${this.formatTimestamp(log.timestamp)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  async loadModels() {
    try {
      const models = await api.getModels();
      this.displayModels(models);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }

  displayModels(models) {
    const activeList = document.getElementById('modelsList');
    const availableList = document.getElementById('availableModelsList');

    if (!models || !models.models) {
      if (activeList) activeList.innerHTML = '<p class="no-data">No models configured</p>';
      return;
    }

    const active = models.models.filter(m => m.is_active);
    const tracked = models.tracked || [];
    const available = models.available || [];

    if (activeList) {
      if (active.length === 0) {
        activeList.innerHTML = '<p class="no-data">No active models</p>';
      } else {
        activeList.innerHTML = active.map(model => {
          let parsedMetadata = {};
          try {
            parsedMetadata = typeof model.metadata === 'string' ? JSON.parse(model.metadata) : (model.metadata || {});
          } catch (error) {
            parsedMetadata = {};
          }

          const trackedInfo = tracked.find(t => t.model === model.model_name);
          return `
          <div class="model-card">
            <div class="model-header">
              <h4>${this.escapeHtml(model.model_name)}</h4>
              <span class="badge badge-success">${model.source === 'tracked' ? 'Tracked' : 'Active'}</span>
            </div>
            <div class="model-body">
              <div class="model-param">
                <span>Provider:</span>
                <span>${this.escapeHtml(model.provider || 'Unknown')}</span>
              </div>
              <div class="model-param">
                <span>Source:</span>
                <span>${this.escapeHtml(model.source || 'manual')}</span>
              </div>
              <div class="model-param">
                <span>Temperature:</span>
                <span>${model.temperature ?? '-'}</span>
              </div>
              <div class="model-param">
                <span>Max Tokens:</span>
                <span>${model.max_tokens ?? '-'}</span>
              </div>
              <div class="model-param">
                <span>IDE:</span>
                <span>${this.escapeHtml(parsedMetadata.ide || '-')}</span>
              </div>
              <div class="model-param">
                <span>Requests:</span>
                <span>${this.formatNumber(trackedInfo?.request_count || parsedMetadata.request_count || 0)}</span>
              </div>
              <div class="model-param">
                <span>Last Seen:</span>
                <span>${model.last_seen ? this.formatTimestamp(model.last_seen) : '-'}</span>
              </div>
            </div>
          </div>
        `;
        }).join('');
      }
    }

    if (availableList) {
      if (available.length === 0) {
        availableList.innerHTML = '<p class="no-data">No available models</p>';
      } else {
        availableList.innerHTML = available.map(model => `
          <div class="model-card">
            <div class="model-header">
              <h4>${this.escapeHtml(model.name)}</h4>
              <button class="btn btn-sm btn-primary" onclick="dashboard.addModel('${model.id}')">
                Add
              </button>
            </div>
            <div class="model-body">
              <p>${this.escapeHtml(model.description || 'No description')}</p>
            </div>
          </div>
        `).join('');
      }
    }
  }

  async loadTokenData() {
    try {
      const period = document.getElementById('tokenPeriodSelect')?.value || '24h';
      const stats = await api.getTokenStats(period);
      
      if (window.updateTokenCharts) {
        window.updateTokenCharts(stats);
      }
    } catch (error) {
      console.error('Error loading token data:', error);
    }
  }

  async loadLogs() {
    try {
      const type = document.getElementById('logTypeSelect')?.value || 'all';
      const level = document.getElementById('logLevelSelect')?.value || '';
      
      const filters = { limit: 100 };
      if (level) filters.level = level;

      let logs;
      if (type === 'mcp') {
        logs = await api.getMCPLogs(filters);
      } else if (type === 'commands') {
        logs = await api.getCommandLogs(filters);
      } else if (type === 'hallucinations') {
        logs = await api.getHallucinationLogs(filters);
      } else {
        logs = await api.getLogs(filters);
      }

      if (window.displayLogs) {
        window.displayLogs(logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }

  async loadCredentials() {
    try {
      const credentials = await api.getCredentials();
      if (window.displayCredentials) {
        window.displayCredentials(credentials);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  }

  async loadSecurityData() {
    try {
      const passwordStatus = await api.getPasswordStatus();
      this.updatePasswordStatus(passwordStatus);

      const auditLog = await api.getAuditLog(50);
      this.displayAuditLog(auditLog);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  }

  updatePasswordStatus(status) {
    const statusEl = document.getElementById('passwordStatus');
    if (!statusEl) return;

    if (status.configured) {
      statusEl.innerHTML = `
        <div class="status-indicator">
          <i class="bi bi-shield-check" style="color: var(--accent-green);"></i>
          <span>Password Configured</span>
        </div>
      `;
    } else {
      statusEl.innerHTML = `
        <div class="status-indicator">
          <i class="bi bi-shield-x" style="color: var(--accent-red);"></i>
          <span>Not Configured</span>
        </div>
      `;
    }
  }

  displayAuditLog(auditData) {
    const logEl = document.getElementById('securityAuditLog');
    if (!logEl) return;

    if (!auditData || !auditData.logs || auditData.logs.length === 0) {
      logEl.innerHTML = '<p class="no-data">No audit logs</p>';
      return;
    }

    logEl.innerHTML = auditData.logs.map(log => `
      <div class="audit-log-item">
        <div class="audit-time">${this.formatTimestamp(log.timestamp)}</div>
        <div class="audit-action">${this.escapeHtml(log.action)}</div>
        <div class="audit-user">${this.escapeHtml(log.user || 'System')}</div>
        <div class="audit-resource">${this.escapeHtml(log.resource || '-')}</div>
      </div>
    `).join('');
  }

  async loadMemoryData() {
    try {
      const graph = await api.getMemoryGraph();
      const stats = await api.getMemoryStats();

      if (window.renderMemoryGraph) {
        window.renderMemoryGraph(graph);
      }

      this.displayMemoryStats(stats);
    } catch (error) {
      console.error('Error loading memory data:', error);
    }
  }

  displayMemoryStats(stats) {
    const statsEl = document.getElementById('memoryStats');
    if (!statsEl || !stats) return;

    // Handle the actual API response structure
    const actualStats = stats.stats || stats;
    const totalAccess = (actualStats.mostAccessed || []).reduce((sum, node) => sum + (node.access_count || 0), 0);
    const avgAccess = actualStats.totalNodes > 0 ? (totalAccess / actualStats.totalNodes).toFixed(1) : 0;

    statsEl.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${this.formatNumber(actualStats.totalNodes || 0)}</div>
          <div class="stat-label">Total Nodes</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.formatNumber(actualStats.totalRelationships || 0)}</div>
          <div class="stat-label">Relationships</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.formatNumber(totalAccess)}</div>
          <div class="stat-label">Total Access</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.formatNumber(avgAccess)}</div>
          <div class="stat-label">Avg Access</div>
        </div>
      </div>
      
      <div class="node-types-breakdown">
        <h4>Nodes by Type</h4>
        ${Object.entries(actualStats.nodesByType || {}).map(([type, count]) => `
          <div class="type-item">
            <span class="type-name">${type}</span>
            <span class="type-count">${count}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  async loadHealthStatus() {
    try {
      const health = await api.getHealthStatus();
      this.displayHealthStatus(health);
    } catch (error) {
      console.error('Error loading health status:', error);
    }
  }

  displayHealthStatus(health) {
    const gridEl = document.getElementById('serverStatusGrid');
    if (!gridEl || !health || !health.services) return;

    // Map service names to ports (based on docker-compose.yml)
    const portMap = {
      'security': 8001,
      'codegen': 8002,
      'memory': 8003,
      'intelligence': 8004,
      'tokens': 8005,
      'sdlc': 8006,
      'legacy': 8007,
      'schema': 8008,
      'performance': 8009
    };

    gridEl.innerHTML = health.services.map(service => `
      <div class="server-card status-${service.status}">
        <div class="server-header">
          <h4>${this.escapeHtml(service.name)}</h4>
          <span class="badge badge-${service.status === 'healthy' ? 'success' : 'danger'}">
            ${service.status}
          </span>
        </div>
        <div class="server-body">
          <div class="server-metric">
            <span>Port:</span>
            <span>${portMap[service.name] || '-'}</span>
          </div>
          <div class="server-metric">
            <span>Response Time:</span>
            <span>${service.responseTime || '-'}ms</span>
          </div>
          <div class="server-metric">
            <span>Last Check:</span>
            <span>${this.formatTimestamp(service.lastCheck)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupWebSocketListeners() {
    api.on('ws:connected', () => {
      this.updateWebSocketStatus('connected');
    });

    api.on('ws:disconnected', () => {
      this.updateWebSocketStatus('disconnected');
    });

    api.on('ws:health_update', (data) => {
      this.updateHealthOverview(data.data);
      if (this.currentSection === 'health') {
        this.loadHealthStatus();
      }
    });

    api.on('ws:token_update', (data) => {
      this.updateTokenOverview({
        summary: data.data?.totals || {},
        by_model: data.data?.by_model || []
      });
      if (this.currentSection === 'tokens') {
        this.loadTokenData();
      }
    });

    api.on('ws:token_usage', () => {
      this.loadOverviewData();
      if (this.currentSection === 'tokens') {
        this.loadTokenData();
      }
      if (this.currentSection === 'models') {
        this.loadModels();
      }
      if (this.currentSection === 'memory') {
        this.loadMemoryData();
      }
    });

    api.on('ws:model_config_updated', () => {
      this.loadModels();
    });

    api.on('ws:memory_node_updated', () => {
      this.updateMemorySectionLive();
    });

    api.on('ws:memory_relationship_created', () => {
      this.updateMemorySectionLive();
    });

    api.on('ws:command_log', () => {
      if (this.currentSection === 'logs') {
        this.loadLogs();
      }
      this.loadOverviewData();
    });

    api.on('ws:hallucination_detected', () => {
      if (this.currentSection === 'logs') {
        this.loadLogs();
      }
      this.loadOverviewData();
    });

    api.on('ws:alerts', (data) => {
      this.displayAlerts(data.data);
    });
  }

  updateSystemStatus(status) {
    const statusEl = document.getElementById('systemStatus');
    if (!statusEl) return;

    const statusText = statusEl.querySelector('.status-text');
    const statusDot = statusEl.querySelector('.status-dot');

    if (statusText) {
      statusText.textContent = status.toUpperCase();
    }

    if (statusDot) {
      statusDot.className = `status-dot status-${status}`;
    }
  }

  updateWebSocketStatus(status) {
    const wsEl = document.getElementById('wsStatus');
    if (!wsEl) return;

    const wsText = wsEl.querySelector('.ws-text');
    const wsDot = wsEl.querySelector('.ws-dot');

    if (wsText) {
      wsText.textContent = status === 'connected' ? 'Connected' : 'Disconnected';
    }

    if (wsDot) {
      wsDot.className = `ws-dot ws-${status}`;
    }
  }

  async updateMemorySectionLive() {
    await this.loadOverviewData();
    if (this.currentSection === 'memory') {
      await this.loadMemoryData();
    }
  }

  displayAlerts(alerts) {
    const alertsCard = document.getElementById('alertsCard');
    const alertsList = document.getElementById('alertsList');

    if (!alertsCard || !alertsList) return;

    const allAlerts = [...(alerts.mcp || []), ...(alerts.tokens || [])];

    if (allAlerts.length === 0) {
      alertsCard.style.display = 'none';
      return;
    }

    alertsCard.style.display = 'block';
    alertsList.innerHTML = allAlerts.map(alert => `
      <div class="alert alert-${alert.level}">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <div class="alert-content">
          <div class="alert-message">${this.escapeHtml(alert.message)}</div>
          <div class="alert-time">${this.formatTimestamp(alert.timestamp)}</div>
        </div>
      </div>
    `).join('');
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.loadSectionData(this.currentSection);
    }, this.refreshRate);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Utility methods
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatTimestamp(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleString();
  }

  getLevelColor(level) {
    const colors = {
      'INFO': 'var(--accent-blue)',
      'WARN': 'var(--accent-orange)',
      'ERROR': 'var(--accent-red)',
      'SUCCESS': 'var(--accent-green)'
    };
    return colors[level] || 'var(--text-secondary)';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showError(message) {
    console.error(message);
    // Could add a toast notification here
  }
}

// Initialize dashboard when DOM is ready
let dashboard;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
  });
} else {
  dashboard = new Dashboard();
}

// Made with Bob