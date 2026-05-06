const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Production-ready logging service with file rotation and structured logging
 */
class Logger {
  constructor(options = {}) {
    this.level = options.level || process.env.LOG_LEVEL || 'info';
    this.logDir = options.logDir || path.join(__dirname, '../logs');
    this.logFile = options.logFile || 'dashboard.log';
    this.maxSize = options.maxSize || parseInt(process.env.LOG_MAX_SIZE) || 10 * 1024 * 1024; // 10MB
    this.maxFiles = options.maxFiles || parseInt(process.env.LOG_MAX_FILES) || 5;
    this.enableConsole = options.enableConsole !== false;
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };

    this.colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      debug: '\x1b[35m',
      trace: '\x1b[90m',
      reset: '\x1b[0m'
    };

    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  formatConsoleMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = this.colors[level] || '';
    const reset = this.colors.reset;
    const metaStr = Object.keys(meta).length > 0 ? ` ${util.inspect(meta, { colors: true, depth: 3 })}` : '';
    return `${color}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}${metaStr}`;
  }

  writeToFile(message) {
    const logPath = path.join(this.logDir, this.logFile);
    
    try {
      // Check file size and rotate if needed
      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        if (stats.size >= this.maxSize) {
          this.rotateLog();
        }
      }

      fs.appendFileSync(logPath, message + '\n', 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  rotateLog() {
    const logPath = path.join(this.logDir, this.logFile);
    
    try {
      // Rotate existing logs
      for (let i = this.maxFiles - 1; i > 0; i--) {
        const oldPath = path.join(this.logDir, `${this.logFile}.${i}`);
        const newPath = path.join(this.logDir, `${this.logFile}.${i + 1}`);
        
        if (fs.existsSync(oldPath)) {
          if (i === this.maxFiles - 1) {
            fs.unlinkSync(oldPath); // Delete oldest
          } else {
            fs.renameSync(oldPath, newPath);
          }
        }
      }

      // Rotate current log
      if (fs.existsSync(logPath)) {
        fs.renameSync(logPath, path.join(this.logDir, `${this.logFile}.1`));
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, meta);
    this.writeToFile(formattedMessage);

    if (this.enableConsole) {
      const consoleMessage = this.formatConsoleMessage(level, message, meta);
      console.log(consoleMessage);
    }
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  trace(message, meta = {}) {
    this.log('trace', message, meta);
  }

  // Structured logging methods
  logRequest(req, res, duration) {
    this.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  }

  logError(error, context = {}) {
    this.error(error.message, {
      stack: error.stack,
      ...context
    });
  }

  logSecurity(action, user, details = {}) {
    this.warn('Security Event', {
      action,
      user,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  logPerformance(operation, duration, details = {}) {
    const level = duration > 1000 ? 'warn' : 'info';
    this.log(level, `Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...details
    });
  }

  // Get recent logs
  getRecentLogs(lines = 100) {
    const logPath = path.join(this.logDir, this.logFile);
    
    try {
      if (!fs.existsSync(logPath)) {
        return [];
      }

      const content = fs.readFileSync(logPath, 'utf8');
      const allLines = content.split('\n').filter(line => line.trim());
      return allLines.slice(-lines);
    } catch (error) {
      console.error('Failed to read log file:', error);
      return [];
    }
  }

  // Clear logs
  clearLogs() {
    const logPath = path.join(this.logDir, this.logFile);
    
    try {
      if (fs.existsSync(logPath)) {
        fs.unlinkSync(logPath);
      }

      // Clear rotated logs
      for (let i = 1; i <= this.maxFiles; i++) {
        const rotatedPath = path.join(this.logDir, `${this.logFile}.${i}`);
        if (fs.existsSync(rotatedPath)) {
          fs.unlinkSync(rotatedPath);
        }
      }

      this.info('Logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
module.exports.Logger = Logger;

// Made with Bob
