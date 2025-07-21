/**
 * AI Service
 * OpenAI integration for influencer content analysis
 *
 * @description Handles all AI-related operations including prompt engineering,
 * API calls, response parsing, and fallback mechanisms
 */

const axios = require("axios")
const logger = require("./logger")

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
    this.model = process.env.OPENAI_MODEL || "gpt-4"
    this.baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
    this.timeout = Number.parseInt(process.env.OPENAI_TIMEOUT) || 30000
    this.maxRetries = Number.parseInt(process.env.OPENAI_MAX_RETRIES) || 3

    if (!this.apiKey) {
      console.log("ℹ️  OpenAI API key not configured. Using mock responses for development.")
      console.log("📝 To enable AI features:")
      console.log("   1. Get API key from: https://platform.openai.com/api-keys")
      console.log("   2. Add OPENAI_API_KEY to your environment variables")
      console.log("   3. Redeploy your application")
    }
  }

  /**
   * Analyze influencer content using OpenAI GPT
   * @param {Array} posts - Array of post objects
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {Promise<Object>} AI analysis results
   */
  async analyzeInfluencerContent(posts, brand, influencer) {
    const startTime = Date.now()

    try {
      if (!this.apiKey) {
        logger.info("Using mock AI response (OpenAI API key not configured)", {
          brand,
          influencer,
          postsCount: posts.length,
          note: "Add OPENAI_API_KEY to environment variables to enable real AI analysis",
        })
        return this.generateMockResponse(brand, influencer, posts)
      }

      const prompt = this.buildAnalysisPrompt(posts, brand, influencer)

      logger.info("Sending request to OpenAI", {
        model: this.model,
        postsCount: posts.length,
        promptLength: prompt.length,
      })

      const response = await this.makeOpenAIRequest(prompt)
      const parsedResponse = this.parseAIResponse(response, brand, influencer)

      logger.info("AI analysis completed successfully", {
        processingTime: Date.now() - startTime,
        sentimentScore: parsedResponse.sentimentScore,
        overallSentiment: parsedResponse.overallSentiment,
      })

      return parsedResponse
    } catch (error) {
      logger.error("AI analysis failed, using fallback", {
        error: error.message,
        processingTime: Date.now() - startTime,
        fallbackReason: "OpenAI API error - check API key and quota",
      })

      // Fallback to mock response
      return this.generateMockResponse(brand, influencer, posts)
    }
  }

  /**
   * Make request to OpenAI API with retry logic
   * @param {string} prompt - Analysis prompt
   * @returns {Promise<string>} AI response
   */
  async makeOpenAIRequest(prompt) {
    let lastError

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: this.model,
            messages: [
              {
                role: "system",
                content: this.getSystemPrompt(),
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: this.timeout,
          },
        )

        return response.data.choices[0].message.content
      } catch (error) {
        lastError = error

        logger.warn(`OpenAI request attempt ${attempt} failed`, {
          error: error.message,
          status: error.response?.status,
          attempt,
          maxRetries: this.maxRetries,
        })

        // Don't retry on certain errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError
  }

  /**
   * Get system prompt for AI analysis
   * @returns {string} System prompt
   */
  getSystemPrompt() {
    return `You are an expert brand strategist and marketing analyst specializing in influencer marketing. 

Your role is to analyze influencer content and provide comprehensive insights about brand sentiment, alignment, and marketing effectiveness.

You must respond with valid JSON format only. Be objective, data-driven, and provide actionable insights for marketing executives.

Focus on:
- Brand sentiment and perception
- Content authenticity and alignment
- Engagement quality and patterns
- Marketing effectiveness
- Risk assessment
- Strategic recommendations`
  }

  /**
   * Build analysis prompt for AI
   * @param {Array} posts - Post data
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {string} Formatted prompt
   */
  buildAnalysisPrompt(posts, brand, influencer) {
    const postsText = posts
      .map(
        (post, index) =>
          `POST ${index + 1}:
Caption: "${post.caption}"
Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments${post.engagement.shares ? `, ${post.engagement.shares} shares` : ""}${post.engagement.views ? `, ${post.engagement.views} views` : ""}
Platform: ${post.platform}
Published: ${post.publishedAt}
Hashtags: ${post.hashtags.join(", ") || "None"}
`,
      )
      .join("\n\n")

    return `Analyze the following ${posts.length} posts from influencer "${influencer}" in relation to the brand "${brand}".

POSTS DATA:
${postsText}

Provide your analysis in this exact JSON format:
{
  "overallSentiment": "Positive" | "Neutral" | "Negative",
  "sentimentScore": 0-100,
  "brandAlignment": "Highly Aligned" | "Aligned" | "Partially Aligned" | "Not Aligned",
  "topKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "aiQuote": "One insightful sentence about the influencer's impact on the brand (max 150 characters)",
  "contentAnalysis": [
    {
      "postIndex": 1,
      "sentiment": "Positive" | "Neutral" | "Negative",
      "aiComment": "Brief analysis of this specific post (max 100 characters)",
      "brandMention": true | false
    }
  ],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "riskFactors": ["risk1", "risk2"] or [],
  "opportunities": ["opportunity1", "opportunity2"],
  "engagementInsights": "Analysis of engagement patterns and their meaning for the brand"
}

Analysis Guidelines:
- Consider brand mention frequency and context
- Evaluate tone alignment with brand values
- Assess audience engagement quality
- Identify potential PR risks or opportunities
- Evaluate authenticity of endorsements
- Analyze overall brand impact and ROI potential
- Consider demographic alignment and reach

Be specific, actionable, and executive-focused in your insights.`
  }

  /**
   * Parse and validate AI response
   * @param {string} aiResponse - Raw AI response
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {Object} Parsed and validated response
   */
  parseAIResponse(aiResponse, brand, influencer) {
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response")
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate and sanitize response
      return {
        overallSentiment: this.validateSentiment(parsed.overallSentiment),
        sentimentScore: this.validateScore(parsed.sentimentScore),
        brandAlignment: this.validateAlignment(parsed.brandAlignment),
        topKeywords: this.validateKeywords(parsed.topKeywords),
        aiQuote: this.validateQuote(parsed.aiQuote, influencer, brand),
        contentAnalysis: this.validateContentAnalysis(parsed.contentAnalysis),
        recommendations: this.validateRecommendations(parsed.recommendations),
        riskFactors: this.validateRiskFactors(parsed.riskFactors),
        opportunities: this.validateOpportunities(parsed.opportunities),
        engagementInsights: this.validateEngagementInsights(parsed.engagementInsights),
      }
    } catch (error) {
      logger.error("Failed to parse AI response", {
        error: error.message,
        responseLength: aiResponse.length,
        responsePreview: aiResponse.substring(0, 200),
      })

      throw new Error("Invalid AI response format")
    }
  }

  /**
   * Generate mock AI response for testing/fallback
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @param {Array} posts - Posts array
   * @returns {Object} Mock analysis response
   */
  generateMockResponse(brand, influencer, posts) {
    const sentiments = ["Positive", "Neutral", "Negative"]
    const alignments = ["Highly Aligned", "Aligned", "Partially Aligned", "Not Aligned"]

    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
    const randomAlignment = alignments[Math.floor(Math.random() * alignments.length)]

    const baseScore = randomSentiment === "Positive" ? 75 : randomSentiment === "Negative" ? 35 : 55
    const score = Math.max(0, Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10))

    const brandMentions = posts.filter((post) => post.caption.toLowerCase().includes(brand.toLowerCase())).length

    return {
      overallSentiment: randomSentiment,
      sentimentScore: score,
      brandAlignment: randomAlignment,
      topKeywords: ["engagement", "authentic", "lifestyle", "community", "trending"],
      aiQuote: `${influencer} demonstrates ${randomSentiment.toLowerCase()} engagement with ${brand}, showing authentic connection with their audience.`,
      contentAnalysis: posts.map((post, index) => ({
        postIndex: index + 1,
        sentiment: randomSentiment,
        aiComment: `${randomSentiment} sentiment with good engagement metrics`,
        brandMention: post.caption.toLowerCase().includes(brand.toLowerCase()),
      })),
      recommendations: [
        "Continue authentic content collaboration",
        "Monitor engagement trends closely",
        "Consider long-term partnership opportunities",
      ],
      riskFactors: randomSentiment === "Negative" ? ["Potential brand misalignment", "Low engagement rates"] : [],
      opportunities: [
        "Increase collaboration frequency",
        "Explore new content formats",
        "Leverage audience demographics",
      ],
      engagementInsights: `Engagement patterns indicate ${randomSentiment.toLowerCase()} audience connection with ${brandMentions} brand mentions across ${posts.length} posts.`,
    }
  }

  // Validation helper methods
  validateSentiment(sentiment) {
    const valid = ["Positive", "Neutral", "Negative"]
    return valid.includes(sentiment) ? sentiment : "Neutral"
  }

  validateScore(score) {
    const num = Number.parseInt(score)
    return isNaN(num) ? 50 : Math.max(0, Math.min(100, num))
  }

  validateAlignment(alignment) {
    const valid = ["Highly Aligned", "Aligned", "Partially Aligned", "Not Aligned"]
    return valid.includes(alignment) ? alignment : "Partially Aligned"
  }

  validateKeywords(keywords) {
    if (!Array.isArray(keywords)) return ["engagement", "content", "brand"]
    return keywords.slice(0, 5).filter((k) => typeof k === "string" && k.length > 0)
  }

  validateQuote(quote, influencer, brand) {
    if (typeof quote !== "string" || quote.length === 0) {
      return `${influencer} shows moderate engagement with ${brand} content.`
    }
    return quote.length > 150 ? quote.substring(0, 147) + "..." : quote
  }

  validateContentAnalysis(analysis) {
    if (!Array.isArray(analysis)) return []
    return analysis.map((item) => ({
      postIndex: item.postIndex || 1,
      sentiment: this.validateSentiment(item.sentiment),
      aiComment: typeof item.aiComment === "string" ? item.aiComment : "Standard engagement post",
      brandMention: Boolean(item.brandMention),
    }))
  }

  validateRecommendations(recommendations) {
    if (!Array.isArray(recommendations)) return ["Monitor engagement trends"]
    return recommendations.slice(0, 5).filter((r) => typeof r === "string" && r.length > 0)
  }

  validateRiskFactors(risks) {
    if (!Array.isArray(risks)) return []
    return risks.slice(0, 3).filter((r) => typeof r === "string" && r.length > 0)
  }

  validateOpportunities(opportunities) {
    if (!Array.isArray(opportunities)) return ["Explore collaboration opportunities"]
    return opportunities.slice(0, 3).filter((o) => typeof o === "string" && o.length > 0)
  }

  validateEngagementInsights(insights) {
    if (typeof insights !== "string" || insights.length === 0) {
      return "Engagement patterns show standard influencer activity with moderate audience interaction."
    }
    return insights
  }
}

module.exports = new AIService()
