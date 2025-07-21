"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { HeroSection } from "@/components/hero-section"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ResultsSection } from "@/components/results-section"
import { TrendingContent } from "@/components/trending-content"
import { BrandPerception } from "@/components/brand-perception"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { InfluencerTracker } from "@/components/influencer-tracker"
import { TrendBriefs } from "@/components/trend-briefs"
import { CompetitorAnalysis } from "@/components/competitor-analysis"
import { Footer } from "@/components/footer"

// Demo data variations for different influencer-brand combinations
const getDemoData = (influencer: string, brand: string) => {
  const combinations = {
    // Tech influencers
    techguru: {
      nike: {
        sentiment: "positive",
        score: 85,
        summary: `${influencer} creates authentic tech-lifestyle content that perfectly aligns with Nike's innovation narrative. Their audience engagement is 34% above industry average, with strong conversion rates on sponsored content.`,
        tags: ["Tech Innovation", "Lifestyle Integration", "High Conversion"],
        distribution: { positive: 78, neutral: 18, negative: 4 },
      },
      apple: {
        sentiment: "positive",
        score: 92,
        summary: `${influencer} demonstrates exceptional product knowledge and creates premium content that resonates with Apple's target demographic. Engagement quality is outstanding with minimal negative feedback.`,
        tags: ["Premium Content", "Product Expert", "Brand Aligned"],
        distribution: { positive: 85, neutral: 12, negative: 3 },
      },
      samsung: {
        sentiment: "neutral",
        score: 68,
        summary: `${influencer} provides balanced tech reviews but lacks emotional connection with Samsung products. Content is informative but doesn't drive strong brand advocacy among followers.`,
        tags: ["Informative", "Balanced Reviews", "Moderate Impact"],
        distribution: { positive: 55, neutral: 35, negative: 10 },
      },
    },
    fashionista: {
      nike: {
        sentiment: "positive",
        score: 79,
        summary: `${influencer} seamlessly integrates Nike products into fashion-forward content, appealing to style-conscious consumers. Strong visual storytelling drives engagement and brand desire.`,
        tags: ["Fashion Forward", "Visual Storytelling", "Style Influence"],
        distribution: { positive: 72, neutral: 22, negative: 6 },
      },
      zara: {
        sentiment: "positive",
        score: 88,
        summary: `${influencer} perfectly embodies Zara's fast-fashion aesthetic with trend-setting content that drives immediate purchase intent. Audience demographics align perfectly with brand targets.`,
        tags: ["Trend Setter", "Purchase Driver", "Perfect Alignment"],
        distribution: { positive: 81, neutral: 15, negative: 4 },
      },
      gucci: {
        sentiment: "neutral",
        score: 45,
        summary: `${influencer} struggles to authentically represent Gucci's luxury positioning. Content feels forced and doesn't resonate with their primarily budget-conscious audience.`,
        tags: ["Misaligned Audience", "Authenticity Issues", "Low Impact"],
        distribution: { positive: 35, neutral: 40, negative: 25 },
      },
    },
    fitnessking: {
      nike: {
        sentiment: "positive",
        score: 94,
        summary: `${influencer} embodies Nike's 'Just Do It' spirit with motivational fitness content that drives exceptional engagement. Perfect brand-influencer synergy with authentic product integration.`,
        tags: ["Motivational", "Authentic Integration", "Perfect Synergy"],
        distribution: { positive: 89, neutral: 9, negative: 2 },
      },
      adidas: {
        sentiment: "positive",
        score: 76,
        summary: `${influencer} creates solid fitness content featuring Adidas products, though slightly less authentic than with other brands. Good engagement but room for improvement in storytelling.`,
        tags: ["Solid Performance", "Good Engagement", "Room for Growth"],
        distribution: { positive: 68, neutral: 26, negative: 6 },
      },
      mcdonalds: {
        sentiment: "negative",
        score: 23,
        summary: `${influencer} faces significant backlash when promoting McDonald's due to conflicting brand values. Fitness audience rejects fast-food partnerships, causing reputation damage.`,
        tags: ["Brand Conflict", "Audience Backlash", "Reputation Risk"],
        distribution: { positive: 15, neutral: 25, negative: 60 },
      },
    },
  }

  // Default fallback data
  const defaultData = {
    sentiment: "neutral",
    score: 65,
    summary: `${influencer} shows moderate engagement with ${brand} content. The partnership has potential but needs strategic refinement to maximize impact and audience resonance.`,
    tags: ["Moderate Impact", "Growth Potential", "Needs Strategy"],
    distribution: { positive: 50, neutral: 35, negative: 15 },
  }

  const influencerData = combinations[influencer.toLowerCase()]
  const brandData = influencerData?.[brand.toLowerCase()] || defaultData

  return {
    influencer,
    brand,
    overallSentiment: brandData.sentiment,
    impactScore: brandData.score,
    summary: brandData.summary,
    tags: brandData.tags,
    sentimentDistribution: brandData.distribution,
    topPosts: generatePostsForCombination(influencer, brand, brandData.sentiment),
    aiQuote: generateAIQuote(influencer, brand, brandData.sentiment),
    engagementTrend: generateEngagementTrend(brandData.score),
  }
}

const generatePostsForCombination = (influencer: string, brand: string, sentiment: string) => {
  const posts = [
    {
      id: 1,
      image: "/placeholder.svg?height=300&width=400&text=Post+1",
      caption: `Just tried the new @${brand} collection and I'm ${sentiment === "positive" ? "obsessed" : sentiment === "negative" ? "not impressed" : "curious about it"}! ${sentiment === "positive" ? "😍 The quality is amazing" : sentiment === "negative" ? "😕 Expected more" : "🤔 Mixed feelings"} #${brand.toLowerCase()}`,
      engagement: {
        likes: sentiment === "positive" ? 15600 : sentiment === "negative" ? 3200 : 8900,
        comments: sentiment === "positive" ? 450 : sentiment === "negative" ? 180 : 320,
        shares: sentiment === "positive" ? 120 : sentiment === "negative" ? 25 : 67,
      },
      sentiment: sentiment,
      alignment:
        sentiment === "positive"
          ? "Promoting Brand Well"
          : sentiment === "negative"
            ? "Brand Misalignment"
            : "Needs Re-alignment",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=300&width=400&text=Post+2",
      caption: `My honest review of ${brand} - ${sentiment === "positive" ? "totally worth the hype!" : sentiment === "negative" ? "not living up to expectations" : "has potential but..."} ${sentiment === "positive" ? "Link in bio 🛍️" : sentiment === "negative" ? "Swipe for details 👆" : "What do you think? 💭"} #review #${brand.toLowerCase()}`,
      engagement: {
        likes: sentiment === "positive" ? 12300 : sentiment === "negative" ? 2800 : 7100,
        comments: sentiment === "positive" ? 380 : sentiment === "negative" ? 220 : 290,
        shares: sentiment === "positive" ? 95 : sentiment === "negative" ? 15 : 45,
      },
      sentiment: sentiment,
      alignment:
        sentiment === "positive"
          ? "Promoting Brand Well"
          : sentiment === "negative"
            ? "Brand Misalignment"
            : "Needs Re-alignment",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=300&width=400&text=Post+3",
      caption: `${sentiment === "positive" ? "Unboxing my" : sentiment === "negative" ? "Trying out" : "Testing"} ${brand} ${sentiment === "positive" ? "haul! You guys asked for it 📦✨" : sentiment === "negative" ? "products... let's see 📦😬" : "collection - first impressions 📦🤷‍♂️"} #unboxing #${brand.toLowerCase()}`,
      engagement: {
        likes: sentiment === "positive" ? 18900 : sentiment === "negative" ? 4100 : 9800,
        comments: sentiment === "positive" ? 520 : sentiment === "negative" ? 340 : 410,
        shares: sentiment === "positive" ? 150 : sentiment === "negative" ? 35 : 78,
      },
      sentiment: sentiment,
      alignment:
        sentiment === "positive"
          ? "Promoting Brand Well"
          : sentiment === "negative"
            ? "Brand Misalignment"
            : "Needs Re-alignment",
    },
  ]

  return posts
}

const generateAIQuote = (influencer: string, brand: string, sentiment: string) => {
  const quotes = {
    positive: `${influencer} demonstrates authentic passion for ${brand}, creating compelling content that drives genuine audience engagement and brand loyalty.`,
    negative: `${influencer}'s content with ${brand} feels forced and misaligned, potentially damaging both personal brand credibility and ${brand}'s reputation.`,
    neutral: `${influencer} maintains professional standards with ${brand} content but lacks the emotional connection needed for maximum impact.`,
  }
  return quotes[sentiment] || quotes.neutral
}

const generateEngagementTrend = (score: number) => {
  const baseEngagement = score * 200 // Scale score to engagement numbers
  const variance = 0.3

  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    engagement: Math.floor(baseEngagement * (1 + (Math.random() - 0.5) * variance)),
  }))
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  const handleAnalysis = async (influencer: string, brand: string) => {
    setIsAnalyzing(true)

    // Simulate realistic API call with proper delay
    setTimeout(() => {
      const mockData = getDemoData(influencer, brand)
      setAnalysisData(mockData)
      setActiveTab("analyze")
      setIsAnalyzing(false)
    }, 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "analyze":
        if (analysisData) {
          return (
            <div className="space-y-8">
              <ResultsSection data={analysisData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TrendingContent posts={analysisData.topPosts} />
                <BrandPerception quote={analysisData.aiQuote} sentiment={analysisData.overallSentiment} />
              </div>
              <AnalyticsCharts
                sentimentData={analysisData.sentimentDistribution}
                engagementData={analysisData.engagementTrend}
              />
            </div>
          )
        }
        return null
      case "tracker":
        return <InfluencerTracker />
      case "briefs":
        return <TrendBriefs />
      case "competitors":
        return <CompetitorAnalysis />
      default:
        return null
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {activeTab === "home" ? (
          <HeroSection onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} onTabChange={setActiveTab} />
        ) : (
          <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderContent()}
          </DashboardLayout>
        )}
        <Footer />
      </div>
    </ThemeProvider>
  )
}
