/**
 * Mock Data Generator
 * Generates realistic mock data for testing and development
 */

/**
 * Generate mock social media posts for an influencer
 * @param {string} influencer - Influencer username
 * @param {string} brand - Brand name (optional)
 * @param {string} platform - Social media platform
 * @param {number} count - Number of posts to generate
 * @returns {Array} Array of mock post objects
 */
function generateMockPosts(influencer, brand = null, platform = "instagram", count = 10) {
  const posts = []
  const baseDate = new Date()

  // Sample captions with and without brand mentions
  const captionTemplates = {
    withBrand: [
      `Just tried the new ${brand} collection and I'm obsessed! 😍 The quality is amazing #${brand?.toLowerCase()} #sponsored`,
      `My honest review of ${brand} - totally worth the hype! Link in bio 🛍️ #${brand?.toLowerCase()}`,
      `Unboxing my ${brand} haul! You guys asked for it 📦✨ #unboxing #${brand?.toLowerCase()}`,
      `${brand} really knows how to make quality products. Been using this for weeks! 💯`,
      `Styling my new ${brand} pieces for date night 💕 What do you think? #ootd #${brand?.toLowerCase()}`,
      `${brand} sent me their latest drop and I had to share! Use my code for 20% off 🎉`,
      `Why I choose ${brand} every time - thread below 👇 #authentic #${brand?.toLowerCase()}`,
      `${brand} x me = perfect match! Thanks for the amazing collaboration 🤝`,
    ],
    withoutBrand: [
      "Morning workout done! 💪 Who else is crushing their fitness goals today?",
      "Coffee and good vibes ☕️ What's everyone up to this weekend?",
      "Throwback to this amazing sunset 🌅 Missing this place already",
      "New haircut, new me! 💇‍♀️ Feeling fresh and ready for the week",
      "Sunday brunch with the squad 🥐 Life is good when you're surrounded by good people",
      "Behind the scenes of today's photoshoot 📸 The magic happens here!",
      "Cozy night in with my favorite book 📚 What are you reading lately?",
      "Travel planning mode activated ✈️ Where should I go next?",
      "Grateful for all the love and support from you amazing humans 💕",
      "Late night thoughts and city lights 🌃 Sometimes you just need to pause and reflect",
    ],
  }

  for (let i = 0; i < count; i++) {
    const hasBrandMention = brand && Math.random() > 0.3 // 70% chance of brand mention if brand provided
    const captions = hasBrandMention ? captionTemplates.withBrand : captionTemplates.withoutBrand
    const caption = captions[Math.floor(Math.random() * captions.length)]

    // Generate realistic engagement numbers
    const baseEngagement = platform === "youtube" ? 50000 : 10000
    const variance = 0.5 // 50% variance

    const likes = Math.floor(baseEngagement * (1 + (Math.random() - 0.5) * variance))
    const comments = Math.floor(likes * (0.02 + Math.random() * 0.08)) // 2-10% of likes
    const shares = Math.floor(likes * (0.005 + Math.random() * 0.015)) // 0.5-2% of likes

    // Generate post date (recent posts)
    const postDate = new Date(baseDate)
    postDate.setDate(postDate.getDate() - i)

    posts.push({
      id: `${platform}_${influencer}_${Date.now()}_${i}`,
      influencer,
      platform,
      imageUrl: `/placeholder.svg?height=400&width=400&text=Post ${i + 1}`,
      caption: caption,
      engagement: {
        likes,
        comments,
        shares,
        views: platform === "youtube" ? likes * 10 : undefined,
      },
      publishedAt: postDate.toISOString(),
      url: `https://${platform}.com/${influencer}/post/${i + 1}`,
      hashtags: extractHashtags(caption),
      mentions: extractMentions(caption),
    })
  }

  return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

/**
 * Extract hashtags from caption text
 * @param {string} caption - Post caption
 * @returns {Array} Array of hashtags
 */
function extractHashtags(caption) {
  const hashtagRegex = /#[\w]+/g
  const matches = caption.match(hashtagRegex)
  return matches ? matches.map((tag) => tag.substring(1)) : []
}

/**
 * Extract mentions from caption text
 * @param {string} caption - Post caption
 * @returns {Array} Array of mentions
 */
function extractMentions(caption) {
  const mentionRegex = /@[\w]+/g
  const matches = caption.match(mentionRegex)
  return matches ? matches.map((mention) => mention.substring(1)) : []
}

/**
 * Generate mock engagement trend data
 * @param {number} days - Number of days to generate data for
 * @returns {Array} Array of engagement data points
 */
function generateEngagementTrend(days = 7) {
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

module.exports = {
  generateMockPosts,
  generateEngagementTrend,
  extractHashtags,
  extractMentions,
}
