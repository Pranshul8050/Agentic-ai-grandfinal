/**
 * Logger Utility
 * Centralized logging system with multiple transports and log levels
 *
 * @description Production-ready logging with file rotation, structured logging,
 * and different log levels for development and production environments
 */

const winston = require("winston")
const path = require("path")
const fs = require("fs")

// Ensure logs directory exists
const logsDir = path.join(__dirname, "..", "logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint(),
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`
    }

    return msg
  }),
)

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: {
    service: "influencer-monitoring-api",
    version: "1.0.0",
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),

    // HTTP requests log
    new winston.transports.File({
      filename: path.join(logsDir, "http.log"),
      level: "http",
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      tailable: true,
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
    }),
  ],
})

// Add console transport for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
    }),
  )
}

// Custom logging methods
class Logger {
  constructor(winstonLogger) {
    this.winston = winstonLogger
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    this.winston.info(message, meta)
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    this.winston.warn(message, meta)
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  error(message, meta = {}) {
    this.winston.error(message, meta)
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    this.winston.debug(message, meta)
  }

  /**
   * Log HTTP request
   * @param {string} message - Log message
   * @param {Object} meta - Request metadata
   */
  http(message, meta = {}) {
    this.winston.log("http", message, meta)
  }

  /**
   * Log error with full context
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError(error, context = {}) {
    this.winston.error("Application Error", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      ...context,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Log API request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in ms
   */
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      contentLength: res.get("Content-Length") || 0,
    }

    // Add request body for POST/PUT requests (excluding sensitive data)
    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      const sanitizedBody = { ...req.body }
      // Remove sensitive fields
      delete sanitizedBody.password
      delete sanitizedBody.token
      delete sanitizedBody.apiKey
      logData.body = sanitizedBody
    }

    const level = res.statusCode >= 400 ? "error" : "http"
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`

    this.winston.log(level, message, logData)
  }

  /**
   * Log performance metrics
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in ms
   * @param {Object} meta - Additional metadata
   */
  logPerformance(operation, duration, meta = {}) {
    this.winston.info("Performance Metric", {
      operation,
      duration: `${duration}ms`,
      ...meta,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Log business event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  logEvent(event, data = {}) {
    this.winston.info("Business Event", {
      event,
      ...data,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = new Logger(logger)
