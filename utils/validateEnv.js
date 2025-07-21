/**
 * Environment Validation Utility
 * Validates required environment variables on application startup
 *
 * @description Ensures all necessary environment variables are present
 * and properly formatted before the application starts
 */

const logger = require("./logger")

/**
 * Validate environment variables
 * @throws {Error} If required environment variables are missing or invalid
 */
function validateEnv() {
  const errors = []
  const warnings = []
  const info = []

  // Critical environment variables (will cause startup failure)
  const critical = []

  // Recommended environment variables (will show warnings)
  const recommended = ["OPENAI_API_KEY", "YOUTUBE_API_KEY", "IG_ACCESS_TOKEN", "IG_USER_ID"]

  // Optional environment variables (will show info)
  const optional = ["OPENAI_MODEL", "LOG_LEVEL", "ALLOWED_ORIGINS"]

  // Validate critical variables
  critical.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing critical environment variable: ${varName}`)
    }
  })

  // Check recommended variables
  recommended.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(`Missing recommended environment variable: ${varName}`)
    }
  })

  // Check optional variables
  optional.forEach((varName) => {
    if (!process.env[varName]) {
      info.push(`Optional environment variable not set: ${varName}`)
    }
  })

  // Validate specific formats
  validateSpecificFormats(errors, warnings)

  // Log info messages
  if (info.length > 0) {
    info.forEach((infoMsg) => {
      console.log(`ℹ️  ${infoMsg}`)
    })
  }

  // Log warnings
  if (warnings.length > 0) {
    console.log("\n⚠️  Environment Warnings:")
    warnings.forEach((warning) => {
      console.log(`   • ${warning}`)
      logger.warn("Environment Warning", { warning })
    })

    console.log("\n📝 To configure missing API keys:")
    console.log("   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables")
    console.log("   2. Add the missing environment variables listed above")
    console.log("   3. Redeploy your application")
    console.log("   4. Test your APIs at: /api/test-apis")
  }

  // Throw error only if critical variables are missing
  if (errors.length > 0) {
    const errorMessage = "Critical environment validation failed:\n" + errors.join("\n")
    logger.error("Environment Validation Failed", { errors })
    throw new Error(errorMessage)
  }

  // Log successful validation
  const configuredAPIs = [
    process.env.OPENAI_API_KEY ? "OpenAI" : null,
    process.env.YOUTUBE_API_KEY ? "YouTube" : null,
    process.env.IG_ACCESS_TOKEN && process.env.IG_USER_ID ? "Instagram" : null,
  ].filter(Boolean)

  logger.info("Environment validation completed", {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3001,
    logLevel: process.env.LOG_LEVEL || "info",
    configuredAPIs: configuredAPIs.length > 0 ? configuredAPIs : ["None"],
    warningsCount: warnings.length,
    infoCount: info.length,
  })

  if (configuredAPIs.length > 0) {
    console.log(`\n✅ Configured APIs: ${configuredAPIs.join(", ")}`)
  } else {
    console.log("\n📋 No API keys configured yet. Add them in Vercel environment variables.")
  }
}

/**
 * Validate specific environment variable formats
 * @param {Array} errors - Array to collect errors
 * @param {Array} warnings - Array to collect warnings
 */
function validateSpecificFormats(errors, warnings) {
  // Validate PORT
  if (process.env.PORT) {
    const port = Number.parseInt(process.env.PORT)
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push("PORT must be a valid port number (1-65535)")
    }
  }

  // Validate LOG_LEVEL
  if (process.env.LOG_LEVEL) {
    const validLevels = ["error", "warn", "info", "http", "verbose", "debug", "silly"]
    if (!validLevels.includes(process.env.LOG_LEVEL)) {
      warnings.push(`LOG_LEVEL should be one of: ${validLevels.join(", ")}`)
    }
  }

  // Validate NODE_ENV
  if (process.env.NODE_ENV) {
    const validEnvs = ["development", "production", "test", "staging"]
    if (!validEnvs.includes(process.env.NODE_ENV)) {
      warnings.push(`NODE_ENV should be one of: ${validEnvs.join(", ")}`)
    }
  }

  // Validate RATE_LIMIT_WINDOW_MS
  if (process.env.RATE_LIMIT_WINDOW_MS) {
    const windowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS)
    if (isNaN(windowMs) || windowMs < 1000) {
      warnings.push("RATE_LIMIT_WINDOW_MS should be at least 1000 (1 second)")
    }
  }

  // Validate RATE_LIMIT_MAX_REQUESTS
  if (process.env.RATE_LIMIT_MAX_REQUESTS) {
    const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
    if (isNaN(maxRequests) || maxRequests < 1) {
      warnings.push("RATE_LIMIT_MAX_REQUESTS should be at least 1")
    }
  }

  // Validate OPENAI_TIMEOUT
  if (process.env.OPENAI_TIMEOUT) {
    const timeout = Number.parseInt(process.env.OPENAI_TIMEOUT)
    if (isNaN(timeout) || timeout < 1000) {
      warnings.push("OPENAI_TIMEOUT should be at least 1000 (1 second)")
    }
  }

  // Validate OPENAI_MAX_RETRIES
  if (process.env.OPENAI_MAX_RETRIES) {
    const retries = Number.parseInt(process.env.OPENAI_MAX_RETRIES)
    if (isNaN(retries) || retries < 0 || retries > 10) {
      warnings.push("OPENAI_MAX_RETRIES should be between 0 and 10")
    }
  }

  // Validate ALLOWED_ORIGINS format
  if (process.env.ALLOWED_ORIGINS) {
    const origins = process.env.ALLOWED_ORIGINS.split(",")
    origins.forEach((origin) => {
      const trimmed = origin.trim()
      if (trimmed && !isValidOrigin(trimmed)) {
        warnings.push(`Invalid origin format in ALLOWED_ORIGINS: ${trimmed}`)
      }
    })
  }
  // Validate JSON_LIMIT and URL_ENCODED_LIMIT
  ;["JSON_LIMIT", "URL_ENCODED_LIMIT"].forEach((limitVar) => {
    if (process.env[limitVar]) {
      const limit = process.env[limitVar]
      if (!isValidSizeLimit(limit)) {
        warnings.push(`${limitVar} should be in format like '10mb', '1gb', '500kb'`)
      }
    }
  })
}

/**
 * Check if origin is valid
 * @param {string} origin - Origin to validate
 * @returns {boolean} True if valid
 */
function isValidOrigin(origin) {
  try {
    new URL(origin)
    return true
  } catch {
    return false
  }
}

/**
 * Check if size limit is valid
 * @param {string} limit - Size limit to validate
 * @returns {boolean} True if valid
 */
function isValidSizeLimit(limit) {
  return /^\d+[kmgt]?b$/i.test(limit)
}

/**
 * Get environment summary for logging
 * @returns {Object} Environment summary
 */
function getEnvironmentSummary() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3001,
    logLevel: process.env.LOG_LEVEL || "info",
    rateLimiting: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
      maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 60,
    },
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      cors: !!process.env.ALLOWED_ORIGINS,
    },
    limits: {
      json: process.env.JSON_LIMIT || "1mb",
      urlEncoded: process.env.URL_ENCODED_LIMIT || "1mb",
    },
  }
}

module.exports = validateEnv
module.exports.getEnvironmentSummary = getEnvironmentSummary
