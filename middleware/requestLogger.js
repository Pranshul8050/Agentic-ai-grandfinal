/**
 * Request Logger Middleware
 * Logs all incoming HTTP requests with detailed information
 *
 * @description Comprehensive request logging with timing, user info,
 * and response details for monitoring and debugging
 */

const logger = require("../utils/logger")

/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function requestLogger(req, res, next) {
  const startTime = Date.now()
  const requestId = generateRequestId()

  // Add request ID to request object for tracking
  req.id = requestId

  // Log incoming request
  logger.http("Incoming Request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    contentType: req.get("Content-Type"),
    contentLength: req.get("Content-Length"),
    referer: req.get("Referer"),
    timestamp: new Date().toISOString(),
  })

  // Log request body for POST/PUT/PATCH requests (excluding sensitive data)
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    const sanitizedBody = sanitizeRequestBody(req.body)
    logger.debug("Request Body", {
      requestId,
      body: sanitizedBody,
    })
  }

  // Override res.end to capture response details
  const originalEnd = res.end
  res.end = function (chunk, encoding) {
    const endTime = Date.now()
    const responseTime = endTime - startTime

    // Log response details
    logger.logRequest(req, res, responseTime)

    // Log slow requests
    if (responseTime > 5000) {
      // 5 seconds
      logger.warn("Slow Request Detected", {
        requestId,
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode,
      })
    }

    // Log error responses
    if (res.statusCode >= 400) {
      logger.warn("Error Response", {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        ip: req.ip,
      })
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding)
  }

  next()
}

/**
 * Generate unique request ID
 * @returns {string} Unique request identifier
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sanitize request body by removing sensitive information
 * @param {Object} body - Request body
 * @returns {Object} Sanitized body
 */
function sanitizeRequestBody(body) {
  if (!body || typeof body !== "object") {
    return body
  }

  const sanitized = { ...body }

  // Remove sensitive fields
  const sensitiveFields = [
    "password",
    "token",
    "apiKey",
    "api_key",
    "secret",
    "auth",
    "authorization",
    "credit_card",
    "creditCard",
    "ssn",
    "social_security",
  ]

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]"
    }
  })

  return sanitized
}

module.exports = requestLogger
