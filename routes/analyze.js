/**
 * Analysis Routes
 * Main API endpoints for influencer content analysis
 *
 * @description Core routes for the influencer monitoring dashboard
 * Handles analysis requests, content fetching, and feedback submission
 */

const express = require("express")
const { body, validationResult } = require("express-validator")
const analyzeController = require("../controllers/analyzeController")
const logger = require("../utils/logger")
const axios = require("axios")

const router = express.Router()

/**
 * Validation middleware for analysis requests
 */
const validateAnalysisRequest = [
  body("influencer")
    .trim()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage(
      "Influencer username must be 1-50 characters and contain only letters, numbers, dots, underscores, and hyphens",
    ),

  body("brand").trim().isLength({ min: 1, max: 100 }).withMessage("Brand name must be 1-100 characters"),

  body("platform")
    .optional()
    .isIn(["instagram", "youtube", "tiktok", "twitter"])
    .withMessage("Platform must be one of: instagram, youtube, tiktok, twitter"),

  body("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
]

/**
 * Validation middleware for feedback requests
 */
const validateFeedbackRequest = [
  body("influencer").trim().isLength({ min: 1 }).withMessage("Influencer username is required"),

  body("brand").trim().isLength({ min: 1 }).withMessage("Brand name is required"),

  body("feedback")
    .isIn(["positive", "negative", "neutral"])
    .withMessage("Feedback must be positive, negative, or neutral"),

  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

  body("comments").optional().isLength({ max: 1000 }).withMessage("Comments must be less than 1000 characters"),
]

/**
 * @route   POST /api/analyze
 * @desc    Analyze influencer content for brand sentiment
 * @access  Public
 * @body    { influencer: string, brand: string, platform?: string, limit?: number }
 */
router.post("/analyze", validateAnalysisRequest, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn("Validation failed for analysis request", {
        errors: errors.array(),
        body: req.body,
        ip: req.ip,
      })

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
        status: 400,
      })
    }

    // Log the analysis request
    logger.info("Analysis request received", {
      influencer: req.body.influencer,
      brand: req.body.brand,
      platform: req.body.platform || "instagram",
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    })

    // Call the controller
    await analyzeController.analyzeInfluencer(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @route   GET /api/content
 * @desc    Fetch influencer content without analysis
 * @access  Public
 * @query   { influencer: string, platform?: string, limit?: number }
 */
router.get("/content", async (req, res, next) => {
  try {
    const { influencer, platform = "instagram", limit = 10 } = req.query

    if (!influencer) {
      return res.status(400).json({
        success: false,
        message: "Influencer username is required",
        status: 400,
      })
    }

    logger.info("Content fetch request received", {
      influencer,
      platform,
      limit,
      ip: req.ip,
    })

    await analyzeController.fetchContent(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback on AI analysis results
 * @access  Public
 * @body    { influencer: string, brand: string, feedback: string, rating?: number, comments?: string }
 */
router.post("/feedback", validateFeedbackRequest, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      logger.warn("Validation failed for feedback request", {
        errors: errors.array(),
        body: req.body,
        ip: req.ip,
      })

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
        status: 400,
      })
    }

    logger.info("Feedback submission received", {
      influencer: req.body.influencer,
      brand: req.body.brand,
      feedback: req.body.feedback,
      ip: req.ip,
    })

    await analyzeController.submitFeedback(req, res, next)
  } catch (error) {
    next(error)
  }
})

/**
 * @route   GET /api/status
 * @desc    Get API status and available endpoints
 * @access  Public
 */
router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "AI Influencer Monitoring API is operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      analyze: "POST /api/analyze",
      content: "GET /api/content",
      feedback: "POST /api/feedback",
      health: "GET /api/health",
    },
    rateLimit: {
      windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
      maxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 60,
    },
  })
})

/**
 * @route   GET /api/test-apis
 * @desc    Test YouTube and Instagram API integrations
 * @access  Public
 */
router.get("/test-apis", async (req, res, next) => {
  try {
    logger.info("API integration test requested", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    })

    const results = {
      youtube: null,
      instagram: null,
      errors: [],
      timestamp: new Date().toISOString(),
    }

    // Test YouTube API
    try {
      if (!process.env.YOUTUBE_API_KEY) {
        throw new Error("YOUTUBE_API_KEY not configured")
      }

      logger.info("Testing YouTube API integration")

      const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          q: "test",
          type: "video",
          part: "snippet",
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 5, // Limit results for testing
        },
        timeout: 10000,
      })

      results.youtube = {
        success: true,
        status: youtubeResponse.status,
        data: youtubeResponse.data,
        itemsCount: youtubeResponse.data.items?.length || 0,
      }

      logger.info("YouTube API test successful", {
        itemsReturned: results.youtube.itemsCount,
      })
    } catch (error) {
      logger.error("YouTube API test failed", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      })

      results.youtube = {
        success: false,
        error: error.message,
        status: error.response?.status || null,
        statusText: error.response?.statusText || null,
      }

      results.errors.push(`YouTube API: ${error.message}`)
    }

    // Test Instagram API
    try {
      if (!process.env.IG_ACCESS_TOKEN) {
        throw new Error("IG_ACCESS_TOKEN not configured")
      }

      if (!process.env.IG_USER_ID) {
        throw new Error("IG_USER_ID not configured")
      }

      logger.info("Testing Instagram API integration")

      const instagramResponse = await axios.get(`https://graph.facebook.com/v19.0/${process.env.IG_USER_ID}/media`, {
        params: {
          fields: "id,caption,media_url,timestamp,media_type,permalink",
          access_token: process.env.IG_ACCESS_TOKEN,
          limit: 5, // Limit results for testing
        },
        timeout: 10000,
      })

      results.instagram = {
        success: true,
        status: instagramResponse.status,
        data: instagramResponse.data,
        itemsCount: instagramResponse.data.data?.length || 0,
      }

      logger.info("Instagram API test successful", {
        itemsReturned: results.instagram.itemsCount,
      })
    } catch (error) {
      logger.error("Instagram API test failed", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      })

      results.instagram = {
        success: false,
        error: error.message,
        status: error.response?.status || null,
        statusText: error.response?.statusText || null,
        details: error.response?.data || null,
      }

      results.errors.push(`Instagram API: ${error.message}`)
    }

    // Determine overall success
    const overallSuccess = results.youtube?.success && results.instagram?.success

    // Return results
    if (overallSuccess) {
      logger.info("All API tests completed successfully")
      res.json({
        success: true,
        message: "All API integrations tested successfully",
        ...results,
      })
    } else {
      logger.warn("Some API tests failed", {
        errors: results.errors,
      })
      res.status(207).json({
        // 207 Multi-Status
        success: false,
        message: "Some API integrations failed",
        ...results,
      })
    }
  } catch (error) {
    logger.error("API test route error", {
      error: error.message,
      stack: error.stack,
    })

    res.status(500).json({
      success: false,
      message: "API fetch failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
