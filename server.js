/**
 * Main Server Entry Point
 * AI-powered Influencer Monitoring Dashboard Backend
 *
 * @description Production-ready Express.js server with comprehensive middleware,
 * security features, and enterprise-grade error handling
 * @author Your Company
 * @version 1.0.0
 */

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Import custom modules
const logger = require("./utils/logger")
const errorHandler = require("./middleware/errorHandler")
const requestLogger = require("./middleware/requestLogger")
const validateEnv = require("./utils/validateEnv")

// Import routes
const analyzeRoutes = require("./routes/analyze")
const healthRoutes = require("./routes/health")
const testRoutes = require("./routes/test")
const trackerRoutes = require("./routes/tracker")
const briefsRoutes = require("./routes/briefs")

// Validate environment variables on startup
validateEnv()

const app = express()
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || "development"

// Trust proxy for accurate IP addresses behind load balancers
app.set("trust proxy", 1)

/**
 * Security Middleware Configuration
 */
// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
)

// Compression middleware for response optimization
app.use(compression())

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP address. Please try again later.",
    status: 429,
    retryAfter: Math.ceil((Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      endpoint: req.originalUrl,
    })
    res.status(429).json({
      success: false,
      error: "Too many requests from this IP address. Please try again later.",
      status: 429,
      retryAfter: Math.ceil((Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000),
    })
  },
})

// Apply rate limiting to all requests
app.use(limiter)

/**
 * CORS Configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000", "http://localhost:3001"]

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count", "X-Rate-Limit-Remaining"],
}

app.use(cors(corsOptions))

/**
 * Body Parsing Middleware
 */
app.use(
  express.json({
    limit: process.env.JSON_LIMIT || "10mb",
    type: "application/json",
  }),
)

app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.URL_ENCODED_LIMIT || "10mb",
  }),
)

/**
 * Custom Middleware
 */
app.use(requestLogger)

/**
 * API Routes
 */
app.use("/api/health", healthRoutes)
app.use("/api", analyzeRoutes)
app.use("/api", testRoutes)
app.use("/api/tracker", trackerRoutes)
app.use("/api/briefs", briefsRoutes)

/**
 * Root Endpoint - API Information
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI-powered Brand Intelligence Platform API",
    version: "2.0.0",
    environment: NODE_ENV,
    status: "operational",
    timestamp: new Date().toISOString(),
    features: [
      "Real-time influencer tracking",
      "AI-powered trend briefs",
      "Competitor analysis",
      "Cross-platform monitoring",
      "Automated insights",
    ],
    endpoints: {
      analyze: "POST /api/analyze",
      tracker: "GET /api/tracker/list",
      briefs: "GET /api/briefs/list",
      health: "GET /api/health",
      testAPIs: "GET /api/test-apis",
    },
    documentation: {
      postman: "/api/docs/postman",
      swagger: "/api/docs/swagger",
    },
  })
})

/**
 * 404 Handler - Route Not Found
 */
app.use("*", (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    status: 404,
    availableEndpoints: [
      "POST /api/analyze",
      "GET /api/tracker/list",
      "GET /api/briefs/list",
      "GET /api/health",
      "GET /api/test-apis",
    ],
  })
})

/**
 * Global Error Handler (Must be last middleware)
 */
app.use(errorHandler)

/**
 * Server Startup
 */
const server = app.listen(PORT, () => {
  logger.info(`🚀 Brand Intelligence Platform API Server started successfully`, {
    port: PORT,
    environment: NODE_ENV,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  })

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  🎯 AI-Powered Brand Intelligence Platform API              ║
║                                                              ║
║  🌐 Server: http://localhost:${PORT}                           ║
║  📊 Health: http://localhost:${PORT}/api/health               ║
║  🔍 Analyze: POST http://localhost:${PORT}/api/analyze        ║
║  👥 Tracker: GET http://localhost:${PORT}/api/tracker/list    ║
║  📋 Briefs: GET http://localhost:${PORT}/api/briefs/list      ║
║  🧪 Test APIs: GET http://localhost:${PORT}/api/test-apis     ║
║                                                              ║
║  Environment: ${NODE_ENV.toUpperCase().padEnd(10)}                                    ║
║  Node Version: ${process.version.padEnd(8)}                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `)
})

/**
 * Graceful Shutdown Handlers
 */
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`)

  server.close((err) => {
    if (err) {
      logger.error("Error during server shutdown:", err)
      process.exit(1)
    }

    logger.info("Server closed successfully. Goodbye! 👋")
    process.exit(0)
  })

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after 30 seconds")
    process.exit(1)
  }, 30000)
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err)
  gracefulShutdown("UNCAUGHT_EXCEPTION")
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason)
  gracefulShutdown("UNHANDLED_REJECTION")
})

module.exports = app
