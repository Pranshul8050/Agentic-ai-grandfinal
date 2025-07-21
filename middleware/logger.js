/**
 * Request Logger Middleware
 * Logs all incoming requests with timing information
 */

function logger(req, res, next) {
  const start = Date.now()
  const timestamp = new Date().toISOString()

  // Log request
  console.log(`📥 ${timestamp} ${req.method} ${req.url} - ${req.ip}`)

  // Log request body for POST/PUT requests (excluding sensitive data)
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    const logBody = { ...req.body }
    // Remove sensitive fields
    delete logBody.password
    delete logBody.token
    delete logBody.apiKey

    console.log("📝 Request body:", JSON.stringify(logBody, null, 2))
  }

  // Override res.json to log response
  const originalJson = res.json
  res.json = function (data) {
    const duration = Date.now() - start
    const status = res.statusCode
    const statusEmoji = status >= 400 ? "❌" : status >= 300 ? "⚠️" : "✅"

    console.log(`📤 ${statusEmoji} ${req.method} ${req.url} - ${status} - ${duration}ms`)

    // Log error responses
    if (status >= 400 && data) {
      console.log("❌ Error response:", JSON.stringify(data, null, 2))
    }

    return originalJson.call(this, data)
  }

  next()
}

module.exports = logger
