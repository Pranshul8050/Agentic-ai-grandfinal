/**
 * Influencer Controller
 * Handles all influencer-related API endpoints and business logic
 */

const aiService = require("../config/ai")
const { generateMockPosts } = require("../utils/mockData")
const { validateAnalysisRequest } = require("../utils/validation")

class InfluencerController {
  /**
   * Analyze influencer content for brand sentiment
   * POST /api/influencer/analyze
   */
  async analyzeInfluencer(req, res) {
    try {
      const { error, value } = validateAnalysisRequest(req.body)

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        })
      }

      const { influencer, brand, platform = "instagram" } = value

      console.log(`🔍 Starting analysis for ${influencer} x ${brand} on ${platform}`)

      // Step 1: Fetch influencer posts (mock data for now)
      const posts = generateMockPosts(influencer, brand, platform)

      // Step 2: Analyze with AI
      const aiAnalysis = await aiService.analyzeInfluencerContent(posts, brand, influencer)

      // Step 3: Prepare response data
      const responseData = {
        success: true,
        data: {
          influencer,
          brand,
          platform,
          analysisTimestamp: new Date().toISOString(),

          // Core metrics
          sentimentScore: aiAnalysis.sentimentScore,
          overallSentiment: aiAnalysis.overallSentiment,
          brandAlignment: aiAnalysis.brandAlignment,

          // AI insights
          aiQuote: aiAnalysis.aiQuote,
          topKeywords: aiAnalysis.topKeywords,
          recommendations: aiAnalysis.recommendations,
          riskFactors: aiAnalysis.riskFactors,
          engagementInsights: aiAnalysis.engagementInsights,

          // Content analysis
          contentAnalysis: posts.map((post, index) => ({
            id: post.id,
            imageUrl: post.imageUrl,
            caption: post.caption,
            engagement: post.engagement,
            platform: post.platform,
            publishedAt: post.publishedAt,
            aiComment: aiAnalysis.contentAnalysis[index]?.aiComment || "Standard engagement post",
            sentiment: aiAnalysis.contentAnalysis[index]?.sentiment || "Neutral",
            brandMention: aiAnalysis.contentAnalysis[index]?.brandMention || false,
          })),

          // Summary metrics
          summary: {
            totalPosts: posts.length,
            totalEngagement: posts.reduce((sum, post) => sum + post.engagement.likes + post.engagement.comments, 0),
            averageEngagement: Math.round(posts.reduce((sum, post) => sum + post.engagement.likes, 0) / posts.length),
            brandMentions: aiAnalysis.contentAnalysis.filter((analysis) => analysis.brandMention).length,
            sentimentDistribution: this.calculateSentimentDistribution(aiAnalysis.contentAnalysis),
          },

          // Tags for quick insights
          tags: this.generateInsightTags(aiAnalysis),
        },
      }

      console.log(`✅ Analysis completed for ${influencer} x ${brand}`)
      res.json(responseData)
    } catch (error) {
      console.error("Analysis Error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to analyze influencer content",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  }

  /**
   * Fetch influencer content without analysis
   * GET /api/influencer/content
   */
  async fetchContent(req, res) {
    try {
      const { influencer, platform = "instagram", limit = 10 } = req.query

      if (!influencer) {
        return res.status(400).json({
          success: false,
          message: "Influencer username is required",
        })
      }

      console.log(`📱 Fetching content for ${influencer} on ${platform}`)

      // Generate mock posts (replace with real API calls later)
      const posts = generateMockPosts(influencer, null, platform, Number.parseInt(limit))

      res.json({
        success: true,
        data: {
          influencer,
          platform,
          totalPosts: posts.length,
          posts: posts.map((post) => ({
            id: post.id,
            imageUrl: post.imageUrl,
            caption: post.caption,
            engagement: post.engagement,
            publishedAt: post.publishedAt,
            platform: post.platform,
          })),
        },
      })
    } catch (error) {
      console.error("Content Fetch Error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to fetch influencer content",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  }

  /**
   * Submit feedback on AI analysis
   * POST /api/influencer/feedback
   */
  async submitFeedback(req, res) {
    try {
      const { influencer, brand, analysisId, feedback, rating, comments } = req.body

      if (!influencer || !brand || !feedback) {
        return res.status(400).json({
          success: false,
          message: "Influencer, brand, and feedback are required",
        })
      }

      // Log feedback (in production, save to database)
      const feedbackData = {
        id: Date.now().toString(),
        influencer,
        brand,
        analysisId,
        feedback, // 'positive', 'negative', 'neutral'
        rating: rating || null, // 1-5 stars
        comments: comments || "",
        timestamp: new Date().toISOString(),
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      }

      console.log("📝 Feedback received:", feedbackData)

      // TODO: Save to database
      // await FeedbackModel.create(feedbackData);

      res.json({
        success: true,
        message: "Feedback submitted successfully",
        data: {
          feedbackId: feedbackData.id,
          status: "recorded",
        },
      })
    } catch (error) {
      console.error("Feedback Error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to submit feedback",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
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
   * Generate insight tags based on AI analysis
   * @param {Object} aiAnalysis - AI analysis results
   * @returns {Array} Array of insight tags
   */
  generateInsightTags(aiAnalysis) {
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
    if (aiAnalysis.brandAlignment === "Aligned") {
      tags.push("Brand Aligned")
    } else if (aiAnalysis.brandAlignment === "Not Aligned") {
      tags.push("Misaligned Content")
    }

    // Risk tags
    if (aiAnalysis.riskFactors && aiAnalysis.riskFactors.length > 0) {
      tags.push("Risk Identified")
    }

    // Keyword-based tags
    if (aiAnalysis.topKeywords.includes("authentic") || aiAnalysis.topKeywords.includes("genuine")) {
      tags.push("Authentic Voice")
    }

    if (aiAnalysis.topKeywords.includes("engagement") || aiAnalysis.topKeywords.includes("community")) {
      tags.push("High Engagement")
    }

    return tags.slice(0, 5) // Limit to 5 tags
  }
}

module.exports = new InfluencerController()
