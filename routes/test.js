/**
 * Test Routes
 * API integration testing endpoints
 *
 * @description Routes for testing external API integrations
 * including YouTube, Instagram, and other social media APIs
 */

const express = require("express")
const axios = require("axios")
const logger = require("../utils/logger")

const router = express.Router()

/**
 * @route   GET /api/test-apis
 * @desc    Test YouTube and Instagram API integrations
 * @access  Public
 */
router.get("/test-apis", async (req, res) => {
  const startTime = Date.now()

  try {
    logger.info("API integration test requested", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    })

    const results = {
      youtube: null,
      instagram: null,
      openai: null,
      errors: [],
      warnings: [],
      configuration: {
        youtubeConfigured: !!process.env.YOUTUBE_API_KEY,
        instagramConfigured: !!(process.env.IG_ACCESS_TOKEN && process.env.IG_USER_ID),
        openaiConfigured: !!process.env.OPENAI_API_KEY,
      },
      deploymentGuide: {
        vercelEnvironmentVariables: ["YOUTUBE_API_KEY", "IG_ACCESS_TOKEN", "IG_USER_ID", "OPENAI_API_KEY"],
        vercelDeploymentSteps: [
          "1. Go to your Vercel Dashboard",
          "2. Select your project",
          "3. Go to Settings → Environment Variables",
          "4. Add the required API keys listed above",
          "5. Redeploy your application",
        ],
      },
      metadata: {
        timestamp: new Date().toISOString(),
        testDuration: null,
        environment: process.env.NODE_ENV || "development",
      },
    }

    // Test YouTube API
    if (!process.env.YOUTUBE_API_KEY) {
      results.youtube = {
        success: false,
        configured: false,
        error: "YOUTUBE_API_KEY not configured",
        message: "YouTube API key is missing. Add it to your environment variables.",
        howToFix: {
          step1: "Get API key from: https://console.developers.google.com/",
          step2: "Enable YouTube Data API v3",
          step3: "Add YOUTUBE_API_KEY to Vercel environment variables",
          step4: "Redeploy your application",
        },
      }
      results.warnings.push("YouTube API not configured")
    } else {
      try {
        logger.info("Testing YouTube API integration")

        const youtubeStartTime = Date.now()
        const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            q: "test",
            type: "video",
            part: "snippet",
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 5,
            order: "relevance",
          },
          timeout: 15000,
          headers: {
            "User-Agent": "AI-Influencer-Dashboard/1.0.0",
          },
        })

        const youtubeResponseTime = Date.now() - youtubeStartTime

        results.youtube = {
          success: true,
          configured: true,
          status: youtubeResponse.status,
          responseTime: `${youtubeResponseTime}ms`,
          data: {
            kind: youtubeResponse.data.kind,
            etag: youtubeResponse.data.etag,
            regionCode: youtubeResponse.data.regionCode,
            pageInfo: youtubeResponse.data.pageInfo,
            items: youtubeResponse.data.items?.map((item) => ({
              kind: item.kind,
              etag: item.etag,
              id: item.id,
              snippet: {
                publishedAt: item.snippet.publishedAt,
                channelId: item.snippet.channelId,
                title: item.snippet.title,
                description: item.snippet.description?.substring(0, 200) + "...",
                thumbnails: item.snippet.thumbnails,
                channelTitle: item.snippet.channelTitle,
                publishTime: item.snippet.publishTime,
              },
            })),
          },
          itemsCount: youtubeResponse.data.items?.length || 0,
          quotaUsed: 100,
        }

        logger.info("YouTube API test successful", {
          itemsReturned: results.youtube.itemsCount,
          responseTime: youtubeResponseTime,
        })
      } catch (error) {
        logger.error("YouTube API test failed", {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
        })

        results.youtube = {
          success: false,
          configured: true,
          error: error.message,
          status: error.response?.status || null,
          statusText: error.response?.statusText || null,
          details: error.response?.data || null,
          troubleshooting: {
            checkApiKey: "Verify YOUTUBE_API_KEY is valid and has quota remaining",
            checkQuota: "Check YouTube API quota in Google Cloud Console",
            documentation: "https://developers.google.com/youtube/v3/docs/search/list",
          },
        }

        results.errors.push(`YouTube API: ${error.message}`)
      }
    }

    // Test Instagram API
    if (!process.env.IG_ACCESS_TOKEN || !process.env.IG_USER_ID) {
      const missingVars = []
      if (!process.env.IG_ACCESS_TOKEN) missingVars.push("IG_ACCESS_TOKEN")
      if (!process.env.IG_USER_ID) missingVars.push("IG_USER_ID")

      results.instagram = {
        success: false,
        configured: false,
        error: `Missing environment variables: ${missingVars.join(", ")}`,
        message: "Instagram API credentials are missing. Add them to your environment variables.",
        howToFix: {
          step1: "Go to: https://developers.facebook.com/apps/",
          step2: "Create a new app or use existing one",
          step3: "Add Instagram Basic Display product",
          step4: "Generate access token and get user ID",
          step5: "Add IG_ACCESS_TOKEN and IG_USER_ID to Vercel environment variables",
          step6: "Redeploy your application",
        },
      }
      results.warnings.push(`Instagram API not configured: missing ${missingVars.join(", ")}`)
    } else {
      try {
        logger.info("Testing Instagram API integration")

        const instagramStartTime = Date.now()
        const instagramResponse = await axios.get(`https://graph.facebook.com/v19.0/${process.env.IG_USER_ID}/media`, {
          params: {
            fields: "id,caption,media_url,timestamp,media_type,permalink,like_count,comments_count",
            access_token: process.env.IG_ACCESS_TOKEN,
            limit: 5,
          },
          timeout: 15000,
          headers: {
            "User-Agent": "AI-Influencer-Dashboard/1.0.0",
          },
        })

        const instagramResponseTime = Date.now() - instagramStartTime

        results.instagram = {
          success: true,
          configured: true,
          status: instagramResponse.status,
          responseTime: `${instagramResponseTime}ms`,
          data: {
            data: instagramResponse.data.data?.map((item) => ({
              id: item.id,
              caption: item.caption?.substring(0, 200) + (item.caption?.length > 200 ? "..." : ""),
              media_url: item.media_url,
              timestamp: item.timestamp,
              media_type: item.media_type,
              permalink: item.permalink,
              like_count: item.like_count,
              comments_count: item.comments_count,
            })),
            paging: instagramResponse.data.paging,
          },
          itemsCount: instagramResponse.data.data?.length || 0,
          userId: process.env.IG_USER_ID,
        }

        logger.info("Instagram API test successful", {
          itemsReturned: results.instagram.itemsCount,
          responseTime: instagramResponseTime,
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
          configured: true,
          error: error.message,
          status: error.response?.status || null,
          statusText: error.response?.statusText || null,
          details: error.response?.data || null,
          troubleshooting: {
            checkToken: "Verify IG_ACCESS_TOKEN is valid and not expired",
            checkUserId: "Verify IG_USER_ID matches the token owner",
            checkPermissions: "Ensure token has instagram_basic permission",
            documentation: "https://developers.facebook.com/docs/instagram-basic-display-api",
          },
        }

        results.errors.push(`Instagram API: ${error.message}`)
      }
    }

    // Test OpenAI API
    if (!process.env.OPENAI_API_KEY) {
      results.openai = {
        success: false,
        configured: false,
        error: "OPENAI_API_KEY not configured",
        message: "OpenAI API key is missing. Add it to your environment variables.",
        howToFix: {
          step1: "Get API key from: https://platform.openai.com/api-keys",
          step2: "Add OPENAI_API_KEY to Vercel environment variables",
          step3: "Optionally set OPENAI_MODEL (defaults to gpt-4)",
          step4: "Redeploy your application",
        },
      }
      results.warnings.push("OpenAI API not configured")
    } else {
      try {
        logger.info("Testing OpenAI API integration")

        const openaiStartTime = Date.now()
        const openaiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: process.env.OPENAI_MODEL || "gpt-4",
            messages: [
              {
                role: "user",
                content: "Say 'API test successful' in exactly 3 words.",
              },
            ],
            max_tokens: 10,
            temperature: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 15000,
          },
        )

        const openaiResponseTime = Date.now() - openaiStartTime

        results.openai = {
          success: true,
          configured: true,
          status: openaiResponse.status,
          responseTime: `${openaiResponseTime}ms`,
          model: process.env.OPENAI_MODEL || "gpt-4",
          response: openaiResponse.data.choices[0]?.message?.content || "No response",
          usage: openaiResponse.data.usage,
        }

        logger.info("OpenAI API test successful", {
          model: results.openai.model,
          responseTime: openaiResponseTime,
        })
      } catch (error) {
        logger.error("OpenAI API test failed", {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
        })

        results.openai = {
          success: false,
          configured: true,
          error: error.message,
          status: error.response?.status || null,
          statusText: error.response?.statusText || null,
          details: error.response?.data || null,
          troubleshooting: {
            checkApiKey: "Verify OPENAI_API_KEY is valid",
            checkQuota: "Check OpenAI API usage and billing",
            checkModel: "Verify you have access to the specified model",
            documentation: "https://platform.openai.com/docs/api-reference",
          },
        }

        results.errors.push(`OpenAI API: ${error.message}`)
      }
    }

    // Calculate total test duration
    results.metadata.testDuration = `${Date.now() - startTime}ms`

    // Determine overall success and configuration status
    const configuredAPIs = [
      results.youtube?.configured,
      results.instagram?.configured,
      results.openai?.configured,
    ].filter(Boolean).length

    const successfulAPIs = [results.youtube?.success, results.instagram?.success, results.openai?.success].filter(
      Boolean,
    ).length

    const totalAPIs = 3

    // Log test completion
    logger.info("API integration test completed", {
      configuredAPIs: `${configuredAPIs}/${totalAPIs}`,
      successfulAPIs: `${successfulAPIs}/${configuredAPIs || 0}`,
      totalDuration: results.metadata.testDuration,
      errorsCount: results.errors.length,
      warningsCount: results.warnings.length,
    })

    // Return results with appropriate status code and message
    if (configuredAPIs === 0) {
      // No APIs configured
      res.status(424).json({
        success: false,
        message: "⚠️ No API keys configured. Please add environment variables in Vercel.",
        ...results,
      })
    } else if (successfulAPIs === configuredAPIs) {
      // All configured APIs working
      res.json({
        success: true,
        message: `🎉 All ${configuredAPIs} configured API(s) working successfully!`,
        ...results,
      })
    } else if (successfulAPIs > 0) {
      // Some APIs working
      res.status(207).json({
        success: false,
        message: `⚠️ ${successfulAPIs}/${configuredAPIs} configured APIs working. Check errors below.`,
        ...results,
      })
    } else {
      // All configured APIs failing
      res.status(502).json({
        success: false,
        message: `❌ All ${configuredAPIs} configured APIs are failing. Check your API keys.`,
        ...results,
      })
    }
  } catch (error) {
    logger.error("API test route error", {
      error: error.message,
      stack: error.stack,
      duration: `${Date.now() - startTime}ms`,
    })

    res.status(500).json({
      success: false,
      message: "API fetch failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
      deploymentGuide: {
        message:
          "If you're seeing this error after deployment, make sure to add your API keys to Vercel environment variables.",
        vercelSteps: [
          "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables",
          "2. Add: YOUTUBE_API_KEY, IG_ACCESS_TOKEN, IG_USER_ID, OPENAI_API_KEY",
          "3. Redeploy your application",
        ],
      },
    })
  }
})

/**
 * @route   GET /api/test-youtube
 * @desc    Test only YouTube API integration
 * @access  Public
 */
router.get("/test-youtube", async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(400).json({
        success: false,
        message: "YouTube API key not configured",
        error: "YOUTUBE_API_KEY environment variable missing",
      })
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: req.query.q || "test",
        type: "video",
        part: "snippet",
        key: process.env.YOUTUBE_API_KEY,
        maxResults: req.query.limit || 5,
      },
      timeout: 10000,
    })

    res.json({
      success: true,
      message: "YouTube API test successful",
      data: response.data,
      itemsCount: response.data.items?.length || 0,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "YouTube API test failed",
      error: error.message,
      details: error.response?.data,
    })
  }
})

/**
 * @route   GET /api/test-instagram
 * @desc    Test only Instagram API integration
 * @access  Public
 */
router.get("/test-instagram", async (req, res) => {
  try {
    if (!process.env.IG_ACCESS_TOKEN || !process.env.IG_USER_ID) {
      return res.status(400).json({
        success: false,
        message: "Instagram API credentials not configured",
        error: "IG_ACCESS_TOKEN or IG_USER_ID environment variables missing",
      })
    }

    const response = await axios.get(`https://graph.facebook.com/v19.0/${process.env.IG_USER_ID}/media`, {
      params: {
        fields: "id,caption,media_url,timestamp,media_type,permalink",
        access_token: process.env.IG_ACCESS_TOKEN,
        limit: req.query.limit || 5,
      },
      timeout: 10000,
    })

    res.json({
      success: true,
      message: "Instagram API test successful",
      data: response.data,
      itemsCount: response.data.data?.length || 0,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Instagram API test failed",
      error: error.message,
      details: error.response?.data,
    })
  }
})

module.exports = router
