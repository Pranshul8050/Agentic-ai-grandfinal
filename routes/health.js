/**
 * Health Check Routes
 * Provides system health monitoring and status endpoints
 * 
 * @description Essential for production monitoring, load balancer health checks,
 * and system diagnostics
 */

const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Basic health check endpoint
 * @access  Public
 * @returns Basic system status and uptime
 */
router.get('/', (req, res) => {
  const healthData = {
    success: true,
    status: 'healthy',
    message: 'AI Influencer Monitoring API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };
  
  res.json(healthData);
});

/**
 * @route   GET /api/health/detailed
 * @desc    Detailed health check with system metrics
 * @access  Public
 * @returns Comprehensive system health information
 */
router.get('/detailed', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const healthData = {
    success: true,
    status: 'healthy',
    message: 'Detailed system health report',
    timestamp: new Date().toISOString(),
    
    // System Information
    system: {
      platform: process.platform,
      architecture: process.arch,
      nodeVersion: process.version,
      uptime: {
        process: process.uptime(),
        system: require('os').uptime()
      }
    },
    
    // Memory Usage
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
      arrayBuffers: `${Math.round(memoryUsage.arrayBuffers / 1024 / 1024)} MB`
    },
    
    // CPU Usage
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    
    // Service Dependencies
    services: {
      openai: {
        status: process.env.OPENAI_API_KEY ? 'configured' : 'not-configured',
        model: process.env.OPENAI_MODEL || 'gpt-4'
      },
      database: {
        status: 'not-implemented',
        note: 'Currently using in-memory mock data'
      },
      cache: {
        status: 'not-implemented',
        note: 'No caching layer configured'
      }
    },
    
    // Environment Configuration
    configuration: {
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3001,
      rateLimiting: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS || '900000',
        maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || '100'
      },
      cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS || 'localhost origins'
      }
    },
    
    // Performance Metrics
    performance: {
      memoryUsagePercentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      uptimeFormatted: formatUptime(process.uptime())
    }
  };
  
  // Log health check request
  logger.info('Detailed health check requested', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    memoryUsage: healthData.memory.heapUsed,
    uptime: healthData.performance.uptimeFormatted
  });
  
  res.json(healthData);
});

/**
 * @route   GET /api/health/readiness
 * @desc    Kubernetes readiness probe endpoint
 * @access  Public
 * @returns Service readiness status
 */
router.get('/readiness', (req, res) => {
  // Check if all required services are ready
  const isReady = checkServiceReadiness();
  
  if (isReady) {
    res.json({
      success: true,
      status: 'ready',
      message: 'Service is ready to accept requests',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      success: false,
      status: 'not-ready',
      message: 'Service is not ready to accept requests',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/health/liveness
 * @desc    Kubernetes liveness probe endpoint
 * @access  Public
 * @returns Service liveness status
 */
router.get('/liveness', (req, res) => {
  // Basic liveness check - if we can respond, we're alive
  res.json({
    success: true,
    status: 'alive',
    message: 'Service is alive and responding',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

/**
 * Helper function to format uptime in human-readable format
 * @param {number} uptimeSeconds - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
function formatUptime(uptimeSeconds) {
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

/**
 * Helper function to check service readiness
 * @returns {boolean} True if service is ready
 */
function checkServiceReadiness() {
  try {
    // Check memory usage (fail if over 90%)
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    if (memoryUsagePercentage > 90) {
      logger.warn('High memory usage detected', { memoryUsagePercentage });
      return false;
    }
    
    // Add other readiness checks here (database connections, external services, etc.)
    
    return true;
  } catch (error) {
    logger.error('Error checking service readiness:', error);
    return false;
  }
}

module.exports = router;
