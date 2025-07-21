/**
 * Analysis Controller
 * Core business logic for influencer content analysis
 *
 * @description Handles all analysis-related operations including
 * AI-powered sentiment analysis, content processing, and response formatting
 */

const aiService = require("../utils/aiService")
const mockDataService = require("../utils/mockDataService")
const logger = require("../utils/logger")

class AnalyzeController {
  /**
   * Analyze influencer content for brand sentiment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async analyzeInfluencer(req, res, next) {
    const startTime = Date.now()

    try {
      const { influencer, brand, platform = "instagram", limit = 10 } = req.body

      logger.info("Starting influencer analysis", {
        influencer,
        brand,
        platform,
        limit,
        requestId: req.id,
      })

      // Step 1: Fetch influencer posts (using mock data for now)
      const posts = mockDataService.generateMockPosts(influencer, brand, platform, Number.parseInt(limit))

      logger.info("Generated mock posts", {
        influencer,
        postsCount: posts.length,
        requestId: req.id,
      })

      // Step 2: Analyze content with AI
      const aiAnalysis = await aiService.analyzeInfluencerContent(posts, brand, influencer)

      logger.info("AI analysis completed", {
        influencer,
        brand,
        sentimentScore: aiAnalysis.sentimentScore,
        overallSentiment: aiAnalysis.overallSentiment,
        processingTime: Date.now() - startTime,
        requestId: req.id,
      })

      // Step 3: Process and format response
      const responseData = this.formatAnalysisResponse(influencer, brand, platform, posts, aiAnalysis, startTime)

      // Step 4: Send response
      res.json(responseData)

      // Log successful completion
      logger.info("Analysis request completed successfully", {
        influencer,
        brand,
        totalProcessingTime: Date.now() - startTime,
        requestId: req.id,
      })
    } catch (error) {
      logger.error("Error in analyzeInfluencer", {
        error: error.message,
        stack: error.stack,
        influencer: req.body.influencer,
        brand: req.body.brand,
        requestId: req.id,
      })

      next(error)
    }
  }

  /**
   * Fetch influencer content without analysis
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async fetchContent(req, res, next) {
    try {
      const { influencer, platform = "instagram", limit = 10 } = req.query

      logger.info("Fetching influencer content", {
        influencer,
        platform,
        limit,
      })

      // Generate mock posts
      const posts = mockDataService.generateMockPosts(influencer, null, platform, Number.parseInt(limit))

      const responseData = {
        success: true,
        data: {
          influencer,
          platform,
          totalPosts: posts.length,
          posts: posts.map((post) => ({
            id: post.id,
            imageURL: post.imageURL,
            caption: post.caption,
            engagement: post.engagement,
            publishedAt: post.publishedAt,
            platform: post.platform,
            hashtags: post.hashtags,
            mentions: post.mentions,
          })),
        },
        metadata: {
          timestamp: new Date().toISOString(),
          platform,
          postsReturned: posts.length,
        },
      }

      res.json(responseData)

      logger.info("Content fetch completed", {
        influencer,
        platform,
        postsReturned: posts.length,
      })
    } catch (error) {
      logger.error("Error in fetchContent", {
        error: error.message,
        influencer: req.query.influencer,
        platform: req.query.platform,
      })

      next(error)
    }
  }

  /**
   * Submit feedback on AI analysis results
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async submitFeedback(req, res, next) {
    try {
      const { influencer, brand, analysisId, feedback, rating, comments } = req.body

      // Create feedback record
      const feedbackData = {
        id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        influencer,
        brand,
        analysisId: analysisId || null,
        feedback,
        rating: rating || null,
        comments: comments || "",
        timestamp: new Date().toISOString(),
        metadata: {
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          source: "api",
        },
      }

      // Log feedback (in production, save to database)
      logger.info("Feedback received", feedbackData)

      // TODO: Save to database
      // await FeedbackModel.create(feedbackData);

      const responseData = {
        success: true,
        message: "Feedback submitted successfully",
        data: {
          feedbackId: feedbackData.id,
          status: "recorded",
          timestamp: feedbackData.timestamp,
        },
      }

      res.json(responseData)

      logger.info("Feedback processed successfully", {
        feedbackId: feedbackData.id,
        influencer,
        brand,
        feedback,
      })
    } catch (error) {
      logger.error("Error in submitFeedback", {
        error: error.message,
        influencer: req.body.influencer,
        brand: req.body.brand,
      })

      next(error)
    }
  }

  /**
   * Format the analysis response with all required data
   * @param {string} influencer - Influencer username
   * @param {string} brand - Brand name
   * @param {string} platform - Social media platform
   * @param {Array} posts - Array of post objects
   * @param {Object} aiAnalysis - AI analysis results
   * @param {number} startTime - Request start time
   * @returns {Object} Formatted response object
   */
  formatAnalysisResponse(influencer, brand, platform, posts, aiAnalysis, startTime) {
    // Calculate engagement metrics
    const totalEngagement = posts.reduce(
      (sum, post) => sum + post.engagement.likes + post.engagement.comments + (post.engagement.shares || 0),
      0,
    )

    const averageEngagement = Math.round(totalEngagement / posts.length)
    const brandMentions = posts.filter((post) => post.caption.toLowerCase().includes(brand.toLowerCase())).length

    // Generate insight tags
    const tags = this.generateInsightTags(aiAnalysis, brandMentions, posts.length)

    return {
      success: true,
      data: {
        // Core Analysis Results
        sentimentScore: aiAnalysis.sentimentScore,
        overallSentiment: aiAnalysis.overallSentiment,
        brandAlignment: aiAnalysis.brandAlignment,

        // AI Insights
        aiQuote: aiAnalysis.aiQuote,
        topKeywords: aiAnalysis.topKeywords,
        recommendations: aiAnalysis.recommendations,
        riskFactors: aiAnalysis.riskFactors,
        opportunities: aiAnalysis.opportunities || [],

        // Content Analysis
        contentAnalysis: posts.map((post, index) => ({
          id: post.id,
          imageURL: post.imageURL,
          caption: post.caption,
          engagement: post.engagement,
          platform: post.platform,
          publishedAt: post.publishedAt,
          aiComment: aiAnalysis.contentAnalysis[index]?.aiComment || "Standard engagement post",
          sentiment: aiAnalysis.contentAnalysis[index]?.sentiment || "Neutral",
          brandMention: post.caption.toLowerCase().includes(brand.toLowerCase()),
          hashtags: post.hashtags,
          mentions: post.mentions,
        })),

        // Summary Metrics
        summary: {
          totalPosts: posts.length,
          totalEngagement,
          averageEngagement,
          brandMentions,
          brandMentionRate: Math.round((brandMentions / posts.length) * 100),
          sentimentDistribution: this.calculateSentimentDistribution(aiAnalysis.contentAnalysis),
        },

        // Quick Insight Tags
        tags,
      },

      // Response Metadata
      metadata: {
        influencer,
        brand,
        platform,
        processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
        timestamp: new Date().toISOString(),
        postsAnalyzed: posts.length,
        aiModel: process.env.OPENAI_MODEL || "gpt-4",
        version: "1.0.0",
      },
    }
  }

  /**
   * Calculate sentiment distribution from content analysis
   * @param {Array} contentAnalysis - Array of content analysis objects
   * @returns {Object} Sentiment distribution percentages
   */
  calculateSentimentDistribution(contentAnalysis) {
    if (!contentAnalysis || contentAnalysis.length === 0) {
      return { positive: 50, neutral: 30, negative: 20 }
    }

    const total = contentAnalysis.length
    const positive = contentAnalysis.filter((item) => item.sentiment === "Positive").length
    const negative = contentAnalysis.filter((item) => item.sentiment === "Negative").length
    const neutral = total - positive - negative

    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    }
  }

  /**
   * Generate insight tags based on analysis results
   * @param {Object} aiAnalysis - AI analysis results
   * @param {number} brandMentions - Number of brand mentions
   * @param {number} totalPosts - Total number of posts
   * @returns {Array} Array of insight tags
   */
  generateInsightTags(aiAnalysis, brandMentions, totalPosts) {
    const tags = []

    // Sentiment-based tags
    if (aiAnalysis.sentimentScore >= 80) {
      tags.push("Excellent Brand Advocate")
    } else if (aiAnalysis.sentimentScore >= 60) {
      tags.push("Positive Brand Impact")
    } else if (aiAnalysis.sentimentScore <= 40) {
      tags.push("Needs Attention")
    }

    // Alignment tags
    if (aiAnalysis.brandAlignment === "Highly Aligned" || aiAnalysis.brandAlignment === "Aligned") {
      tags.push("Brand Aligned")
    } else if (aiAnalysis.brandAlignment === "Not Aligned") {
      tags.push("Misaligned Content")
    }

    // Mention frequency tags
    const mentionRate = (brandMentions / totalPosts) * 100
    if (mentionRate >= 70) {
      tags.push("High Brand Visibility")
    } else if (mentionRate <= 30) {
      tags.push("Low Brand Mentions")
    }

    // Risk tags
    if (aiAnalysis.riskFactors && aiAnalysis.riskFactors.length > 0) {
      tags.push("Risk Identified")
    }

    // Keyword-based tags
    if (aiAnalysis.topKeywords.some((keyword) => ["authentic", "genuine", "real"].includes(keyword.toLowerCase()))) {
      tags.push("Authentic Voice")
    }

    if (
      aiAnalysis.topKeywords.some((keyword) => ["engagement", "community", "followers"].includes(keyword.toLowerCase()))
    ) {
      tags.push("High Engagement")
    }

    return tags.slice(0, 5) // Limit to 5 tags
  }
}

module.exports = new AnalyzeController()
