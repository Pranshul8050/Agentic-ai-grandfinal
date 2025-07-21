/**
 * AI Configuration and API client setup
 * Handles OpenAI, Gemini, and other AI service configurations
 */

const axios = require("axios")

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY
    this.openaiModel = process.env.OPENAI_MODEL || "gpt-4"
    this.openaiBaseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"

    if (!this.openaiApiKey) {
      console.warn("⚠️  OpenAI API key not found. AI features will use mock responses.")
    }
  }

  /**
   * Analyze influencer content using OpenAI GPT
   * @param {Array} posts - Array of post objects with captions and engagement
   * @param {string} brand - Brand name to analyze against
   * @param {string} influencer - Influencer username
   * @returns {Promise<Object>} AI analysis results
   */
  async analyzeInfluencerContent(posts, brand, influencer) {
    try {
      if (!this.openaiApiKey) {
        return this.getMockAIResponse(brand, influencer)
      }

      const prompt = this.buildAnalysisPrompt(posts, brand, influencer)

      const response = await axios.post(
        `${this.openaiBaseUrl}/chat/completions`,
        {
          model: this.openaiModel,
          messages: [
            {
              role: "system",
              content:
                "You are a marketing strategist and brand expert. You analyze influencer content for brand sentiment, tone alignment, and marketing effectiveness. Always respond with valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        },
      )

      const aiResponse = response.data.choices[0].message.content
      return this.parseAIResponse(aiResponse, brand, influencer)
    } catch (error) {
      console.error("AI Analysis Error:", error.message)

      // Fallback to mock response on error
      return this.getMockAIResponse(brand, influencer)
    }
  }

  /**
   * Build the analysis prompt for AI
   * @param {Array} posts - Post data
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {string} Formatted prompt
   */
  buildAnalysisPrompt(posts, brand, influencer) {
    const postsText = posts
      .map(
        (post, index) =>
          `${index + 1}. Caption: "${post.caption}"\n   Engagement: ${post.engagement.likes} likes, ${post.engagement.comments} comments, ${post.engagement.shares} shares`,
      )
      .join("\n\n")

    return `Analyze the following ${posts.length} posts from influencer "${influencer}" in relation to the brand "${brand}".

POSTS DATA:
${postsText}

Please provide your analysis in the following JSON format:
{
  "overallSentiment": "Positive" | "Neutral" | "Negative",
  "sentimentScore": 0-100,
  "topKeywords": ["keyword1", "keyword2", "keyword3"],
  "brandAlignment": "Aligned" | "Partially Aligned" | "Not Aligned",
  "aiQuote": "One insightful sentence about the influencer's impact on the brand",
  "contentAnalysis": [
    {
      "postIndex": 1,
      "sentiment": "Positive" | "Neutral" | "Negative",
      "aiComment": "Brief analysis of this specific post",
      "brandMention": true | false
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "riskFactors": ["risk1", "risk2"] or [],
  "engagementInsights": "Analysis of engagement patterns and their meaning"
}

Consider:
- Brand mention frequency and context
- Tone alignment with brand values
- Audience engagement quality
- Potential PR risks or opportunities
- Authenticity of endorsements
- Overall brand impact`
  }

  /**
   * Parse AI response and ensure proper format
   * @param {string} aiResponse - Raw AI response
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {Object} Parsed and validated response
   */
  parseAIResponse(aiResponse, brand, influencer) {
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse

      const parsed = JSON.parse(jsonString)

      // Validate and set defaults
      return {
        overallSentiment: parsed.overallSentiment || "Neutral",
        sentimentScore: Math.max(0, Math.min(100, parsed.sentimentScore || 50)),
        topKeywords: Array.isArray(parsed.topKeywords)
          ? parsed.topKeywords.slice(0, 5)
          : ["engagement", "content", "brand"],
        brandAlignment: parsed.brandAlignment || "Partially Aligned",
        aiQuote: parsed.aiQuote || `${influencer} shows moderate engagement with ${brand} content.`,
        contentAnalysis: Array.isArray(parsed.contentAnalysis) ? parsed.contentAnalysis : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
        engagementInsights: parsed.engagementInsights || "Engagement patterns show standard influencer activity.",
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error.message)
      return this.getMockAIResponse(brand, influencer)
    }
  }

  /**
   * Generate mock AI response for testing/fallback
   * @param {string} brand - Brand name
   * @param {string} influencer - Influencer username
   * @returns {Object} Mock analysis response
   */
  getMockAIResponse(brand, influencer) {
    const sentimentOptions = ["Positive", "Neutral", "Negative"]
    const randomSentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)]
    const baseScore = randomSentiment === "Positive" ? 75 : randomSentiment === "Negative" ? 35 : 55
    const score = baseScore + Math.floor(Math.random() * 20) - 10

    return {
      overallSentiment: randomSentiment,
      sentimentScore: Math.max(0, Math.min(100, score)),
      topKeywords: ["engagement", "authentic", "lifestyle", "trending", "community"],
      brandAlignment: randomSentiment === "Positive" ? "Aligned" : "Partially Aligned",
      aiQuote: `${influencer} demonstrates ${randomSentiment.toLowerCase()} engagement with ${brand}, showing authentic connection with their audience.`,
      contentAnalysis: [
        {
          postIndex: 1,
          sentiment: randomSentiment,
          aiComment: `Strong ${randomSentiment.toLowerCase()} sentiment with good engagement metrics.`,
          brandMention: true,
        },
      ],
      recommendations: [
        "Continue authentic content collaboration",
        "Monitor engagement trends closely",
        "Consider long-term partnership opportunities",
      ],
      riskFactors: randomSentiment === "Negative" ? ["Potential brand misalignment", "Low engagement rates"] : [],
      engagementInsights: "Engagement patterns indicate strong audience connection and authentic influence.",
    }
  }
}

module.exports = new AIService()
