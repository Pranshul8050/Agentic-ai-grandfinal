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

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  const handleAnalysis = async (influencer: string, brand: string) => {
    setIsAnalyzing(true)

    // Simulate realistic API call with proper delay
    setTimeout(() => {
      const mockData = {
        influencer,
        brand,
        overallSentiment: "positive",
        impactScore: 78,
        summary: `${influencer} is positively impacting ${brand} with authentic content that resonates with their target audience. The influencer's engagement rates are 23% above industry average.`,
        tags: ["Boosting Awareness", "High Engagement", "Brand Aligned"],
        sentimentDistribution: {
          positive: 65,
          neutral: 25,
          negative: 10,
        },
        topPosts: [
          {
            id: 1,
            image: "/placeholder.svg?height=300&width=400&text=Post+1",
            caption:
              "Just tried the new @" +
              brand +
              " collection and I'm obsessed! 😍 The quality is amazing and the style is perfect for my aesthetic. Link in bio for 20% off! #sponsored #" +
              brand.toLowerCase(),
            engagement: { likes: 12500, comments: 340, shares: 89 },
            sentiment: "positive",
            alignment: "Promoting Brand Well",
          },
          {
            id: 2,
            image: "/placeholder.svg?height=300&width=400&text=Post+2",
            caption:
              "My honest review of " +
              brand +
              " - worth the hype? After using their products for 2 weeks, here's what I think... (swipe for details)",
            engagement: { likes: 8900, comments: 567, shares: 123 },
            sentiment: "positive",
            alignment: "Promoting Brand Well",
          },
          {
            id: 3,
            image: "/placeholder.svg?height=300&width=400&text=Post+3",
            caption:
              "Unboxing my " +
              brand +
              " haul! You guys asked for it so here it is 📦✨ The packaging alone is worth it! What should I try first?",
            engagement: { likes: 15600, comments: 234, shares: 67 },
            sentiment: "neutral",
            alignment: "Needs Re-alignment",
          },
        ],
        aiQuote: `${influencer} uses humor and authenticity that resonates with Gen Z, reinforcing ${brand}'s coolness factor and driving genuine engagement.`,
        engagementTrend: [
          { date: "2024-01-01", engagement: 8500 },
          { date: "2024-01-02", engagement: 12300 },
          { date: "2024-01-03", engagement: 15600 },
          { date: "2024-01-04", engagement: 11200 },
          { date: "2024-01-05", engagement: 18900 },
          { date: "2024-01-06", engagement: 14500 },
          { date: "2024-01-07", engagement: 16800 },
        ],
      }

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
