/**
 * Global Error Handler Middleware
 * Centralized error handling for the entire application
 * 
 * @description Production-ready error handler with proper logging,
 * error classification, and client-safe error responses
 */

const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Must be the last middleware in the application
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log the error with context
  logger.logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    requestId: req.id
  });

  // Default error response
  let error = {
    success: false,
    message: 'Internal server error',
    status: 500,
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation failed';
    error.details = err.details || err.message;
  } 
  else if (err.name === 'AIServiceError') {
    error.status = 503;
    error.message = 'AI service temporarily unavailable';
    error.retryAfter = 300; // 5 minutes
  }
  else if (err.name === 'UnauthorizedError') {
    error.status = 401;
    error.message = 'Unauthorized access';
  }
  else if (err.name === 'ForbiddenError') {
    error.status = 403;
    error.message = 'Access forbidden';
  }
  else if (err.code === 'ECONNREFUSED') {
    error.status = 503;
    error.message = 'External service unavailable';
  }
  else if (err.code === 'ETIMEDOUT') {
    error.status = 504;
    error.message = 'Request timeout';
  }
  else if (err.response && err.response.status) {
    // Handle axios/HTTP errors
    error.status = err.response.status;
    error.message = err.response.data?.message || err.message;
    
    if (err.response.status === 429) {
      error.message = 'Rate limit exceeded';
      error.retryAfter = err.response.headers['retry-after'] || 60;
    }
  }
  else if (err.message) {
    // Use the error message if it's safe to expose
    const safeMessages = [
      'Validation failed',
      'Invalid input',
      'Resource not found',
      'Access denied',
      'Rate limit exceeded'
    ];
    
    if (safeMessages.some(msg => err.message.includes(msg))) {
      error.message = err.message;
    }
  }

  // Add request context for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
    error.requestContext = {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    };
  }

  // Add request ID for tracking
  if (req.id) {
    error.requestId = req.id;
  }

  // Send error response
  res.status(error.status).json(error);
}

/**
 * 404 Not Found handler
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  logger.warn('404 - Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    message: 'Route not found',
    status: 404,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'POST /api/analyze',
      'GET /api/health',
      'GET /api/health/detailed'
    ]
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
