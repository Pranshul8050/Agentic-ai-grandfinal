/**
 * Mock Data Service
 * Generates realistic mock social media data for testing and development
 *
 * @description Creates authentic-looking social media posts with proper
 * engagement patterns, platform-specific content, and brand mentions
 */

const logger = require("./logger")

class MockDataService {
  constructor() {
    this.platforms = ["instagram", "youtube", "tiktok", "twitter"]
    this.baseEngagement = {
      instagram: { likes: 5000, comments: 200, shares: 50 },
      youtube: { likes: 15000, comments: 500, shares: 200, views: 250000 },
      tiktok: { likes: 8000, comments: 300, shares: 400 },
      twitter: { likes: 2000, comments: 100, shares: 150 },
    }
  }

  /**
   * Generate mock social media posts for an influencer
   * @param {string} influencer - Influencer username
   * @param {string} brand - Brand name (optional)
   * @param {string} platform - Social media platform
   * @param {number} count - Number of posts to generate
   * @returns {Array} Array of mock post objects
   */
  generateMockPosts(influencer, brand = null, platform = "instagram", count = 10) {
    logger.info("Generating mock posts", {
      influencer,
      brand,
      platform,
      count,
    })

    const posts = []
    const baseDate = new Date()

    for (let i = 0; i < count; i++) {
      const post = this.createMockPost(influencer, brand, platform, i, baseDate)
      posts.push(post)
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

    logger.info("Mock posts generated successfully", {
      influencer,
      postsGenerated: posts.length,
      brandMentions: posts.filter((p) => p.caption.toLowerCase().includes(brand?.toLowerCase() || "")).length,
    })

    return posts
  }

  /**
   * Create a single mock post
   * @param {string} influencer - Influencer username
   * @param {string} brand - Brand name
   * @param {string} platform - Platform name
   * @param {number} index - Post index
   * @param {Date} baseDate - Base date for post
   * @returns {Object} Mock post object
   */
  createMockPost(influencer, brand, platform, index, baseDate) {
    const hasBrandMention = brand && Math.random() > 0.3 // 70% chance of brand mention
    const caption = this.generateCaption(influencer, brand, platform, hasBrandMention)
    const engagement = this.generateEngagement(platform)

    // Generate post date (recent posts, going back in time)
    const postDate = new Date(baseDate)
    postDate.setHours(postDate.getHours() - index * 6) // Posts every 6 hours
    postDate.setMinutes(Math.floor(Math.random() * 60))

    return {
      id: `${platform}_${influencer}_${Date.now()}_${index}`,
      influencer,
      platform,
      imageURL: this.generateImageURL(platform, index + 1),
      caption,
      engagement,
      publishedAt: postDate.toISOString(),
      url: this.generatePostURL(platform, influencer, index + 1),
      hashtags: this.extractHashtags(caption),
      mentions: this.extractMentions(caption),
    }
  }

  /**
   * Generate realistic caption based on platform and brand
   * @param {string} influencer - Influencer username
   * @param {string} brand - Brand name
   * @param {string} platform - Platform name
   * @param {boolean} hasBrandMention - Whether to include brand mention
   * @returns {string} Generated caption
   */
  generateCaption(influencer, brand, platform, hasBrandMention) {
    const captionTemplates = {
      withBrand: {
        instagram: [
          `Just tried the new ${brand} collection and I'm obsessed! 😍 The quality is amazing #${brand?.toLowerCase()} #sponsored`,
          `My honest review of ${brand} - totally worth the hype! Link in bio 🛍️ #${brand?.toLowerCase()}`,
          `Unboxing my ${brand} haul! You guys asked for it 📦✨ #unboxing #${brand?.toLowerCase()}`,
          `${brand} really knows how to make quality products. Been using this for weeks! 💯 #${brand?.toLowerCase()}`,
          `Styling my new ${brand} pieces for date night 💕 What do you think? #ootd #${brand?.toLowerCase()}`,
          `${brand} sent me their latest drop and I had to share! Use my code for 20% off 🎉 #${brand?.toLowerCase()}`,
          `Why I choose ${brand} every time - thread below 👇 #authentic #${brand?.toLowerCase()}`,
          `${brand} x me = perfect match! Thanks for the amazing collaboration 🤝 #partnership #${brand?.toLowerCase()}`,
        ],
        youtube: [
          `Just dropped my new gym vlog powered by ${brand} gear!💪🔥 #JustDoIt #${brand?.toLowerCase()}`,
          `${brand} haul and honest review - is it worth your money? Full video up now! #${brand?.toLowerCase()} #review`,
          `Testing ${brand}'s new products for 30 days - here are my results! #${brand?.toLowerCase()} #challenge`,
          `Why ${brand} is my go-to brand - full breakdown in today's video! #${brand?.toLowerCase()} #authentic`,
          `${brand} collaboration announcement! So excited to work with them 🎉 #${brand?.toLowerCase()} #collab`,
          `Unboxing the entire ${brand} collection - which is your favorite? #${brand?.toLowerCase()} #unboxing`,
        ],
        tiktok: [
          `POV: You find the perfect ${brand} product 😍 #${brand?.toLowerCase()} #fyp`,
          `${brand} haul but make it aesthetic ✨ #${brand?.toLowerCase()} #haul #aesthetic`,
          `Rating ${brand} products as someone who's tried EVERYTHING #${brand?.toLowerCase()} #review`,
          `${brand} sent me this and I'm OBSESSED 🤩 #${brand?.toLowerCase()} #gifted`,
          `Why ${brand} hits different 💯 #${brand?.toLowerCase()} #authentic #real`,
        ],
        twitter: [
          `Just tried ${brand} and I'm genuinely impressed. Quality is 🔥 #${brand?.toLowerCase()}`,
          `${brand} really understood the assignment with this one 💯 #${brand?.toLowerCase()}`,
          `Honest ${brand} review: worth every penny. Thread below 👇 #${brand?.toLowerCase()}`,
          `${brand} collab announcement! Excited to share this journey with you all 🎉 #${brand?.toLowerCase()}`,
        ],
      },
      withoutBrand: {
        instagram: [
          "Morning workout done! 💪 Who else is crushing their fitness goals today? #fitness #motivation",
          "Coffee and good vibes ☕️ What's everyone up to this weekend? #weekend #coffee",
          "Throwback to this amazing sunset 🌅 Missing this place already #throwback #sunset",
          "New haircut, new me! 💇‍♀️ Feeling fresh and ready for the week #newlook #selfcare",
          "Sunday brunch with the squad 🥐 Life is good when you're surrounded by good people #brunch #friends",
          "Behind the scenes of today's photoshoot 📸 The magic happens here! #bts #photoshoot",
          "Cozy night in with my favorite book 📚 What are you reading lately? #reading #cozy",
          "Travel planning mode activated ✈️ Where should I go next? #travel #wanderlust",
        ],
        youtube: [
          "New video is LIVE! This one was so fun to make 🎬 #newvideo #youtube",
          "Behind the scenes of my latest project - so much work but worth it! #bts #creator",
          "Q&A video coming soon! Drop your questions below 👇 #qanda #community",
          "Editing all night but the video is finally ready! Hope you love it ❤️ #editing #creator",
          "Collab video with my bestie is up! We had way too much fun 😂 #collab #friends",
        ],
        tiktok: [
          "POV: You're having the best day ever ✨ #pov #goodvibes #fyp",
          "This trend but make it me 💅 #trend #fyp #viral",
          "Rating my outfits from this week 👗 #ootd #fashion #rating",
          "Things that just hit different 💯 #relatable #fyp #real",
          "Plot twist: I actually love Mondays 📈 #plottwist #monday #positive",
        ],
        twitter: [
          "Sometimes you just need to appreciate the little things ✨",
          "Coffee thoughts: Why do the best ideas come at 2am? ☕️💭",
          "Reminder: You're doing better than you think you are 💙",
          "Currently obsessed with this playlist. Music recommendations welcome! 🎵",
          "Weekend plans: Absolutely nothing and I'm here for it 😌",
        ],
      },
    }

    const templates =
      hasBrandMention && brand
        ? captionTemplates.withBrand[platform] || captionTemplates.withBrand.instagram
        : captionTemplates.withoutBrand[platform] || captionTemplates.withoutBrand.instagram

    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * Generate realistic engagement numbers for platform
   * @param {string} platform - Platform name
   * @returns {Object} Engagement metrics
   */
  generateEngagement(platform) {
    const base = this.baseEngagement[platform] || this.baseEngagement.instagram
    const variance = 0.6 // 60% variance

    const engagement = {
      likes: Math.floor(base.likes * (1 + (Math.random() - 0.5) * variance)),
      comments: Math.floor(base.comments * (1 + (Math.random() - 0.5) * variance)),
      shares: Math.floor(base.shares * (1 + (Math.random() - 0.5) * variance)),
    }

    // Add platform-specific metrics
    if (platform === "youtube") {
      engagement.views = Math.floor(base.views * (1 + (Math.random() - 0.5) * variance))
    }

    // Ensure minimum values
    engagement.likes = Math.max(100, engagement.likes)
    engagement.comments = Math.max(10, engagement.comments)
    engagement.shares = Math.max(5, engagement.shares)

    return engagement
  }

  /**
   * Generate image URL for post
   * @param {string} platform - Platform name
   * @param {number} index - Post index
   * @returns {string} Image URL
   */
  generateImageURL(platform, index) {
    const dimensions = {
      instagram: "1080x1080",
      youtube: "1280x720",
      tiktok: "1080x1920",
      twitter: "1200x675",
    }

    const size = dimensions[platform] || dimensions.instagram
    return `https://picsum.photos/${size}?random=${index}`
  }

  /**
   * Generate post URL
   * @param {string} platform - Platform name
   * @param {string} influencer - Influencer username
   * @param {number} index - Post index
   * @returns {string} Post URL
   */
  generatePostURL(platform, influencer, index) {
    const baseURLs = {
      instagram: `https://instagram.com/p/${influencer}_${index}`,
      youtube: `https://youtube.com/watch?v=${influencer}_${index}`,
      tiktok: `https://tiktok.com/@${influencer}/video/${Date.now()}${index}`,
      twitter: `https://twitter.com/${influencer}/status/${Date.now()}${index}`,
    }

    return baseURLs[platform] || baseURLs.instagram
  }

  /**
   * Extract hashtags from caption text
   * @param {string} caption - Post caption
   * @returns {Array} Array of hashtags (without #)
   */
  extractHashtags(caption) {
    const hashtagRegex = /#[\w]+/g
    const matches = caption.match(hashtagRegex)
    return matches ? matches.map((tag) => tag.substring(1)) : []
  }

  /**
   * Extract mentions from caption text
   * @param {string} caption - Post caption
   * @returns {Array} Array of mentions (without @)
   */
  extractMentions(caption) {
    const mentionRegex = /@[\w]+/g
    const matches = caption.match(mentionRegex)
    return matches ? matches.map((mention) => mention.substring(1)) : []
  }

  /**
   * Generate engagement trend data
   * @param {number} days - Number of days
   * @returns {Array} Engagement trend data
   */
  generateEngagementTrend(days = 7) {
    const data = []
    const baseDate = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() - i)

      const baseEngagement = 15000
      const variance = 0.3
      const engagement = Math.floor(baseEngagement * (1 + (Math.random() - 0.5) * variance))

      data.push({
        date: date.toISOString().split("T")[0],
        engagement,
        likes: Math.floor(engagement * 0.8),
        comments: Math.floor(engagement * 0.15),
        shares: Math.floor(engagement * 0.05),
      })
    }

    return data
  }
}

module.exports = new MockDataService()
