"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, Download, Mail, Clock, Sparkles } from "lucide-react"

interface TrendBrief {
  id: string
  date: string
  title: string
  summary: string
  keyTrends: string[]
  alerts: string[]
  topPerformers: Array<{
    handle: string
    platform: string
    metric: string
    change: number
  }>
  competitorInsights: string[]
  recommendations: string[]
  status: "delivered" | "pending" | "draft"
}

export function TrendBriefs() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [briefs] = useState<TrendBrief[]>([
    {
      id: "1",
      date: "2024-01-15",
      title: "Weekly Brand Intelligence Brief - Tech Niche",
      summary:
        "Significant uptick in AI-related content across tracked influencers. Competitor XYZ launched new campaign with 340% engagement increase.",
      keyTrends: [
        "AI and automation content up 45%",
        "Video format preference increased 23%",
        "Sustainability messaging trending",
        "Micro-influencer engagement outperforming macro",
      ],
      alerts: ["Competitor ABC gained 15K followers in 48h", "Negative sentiment spike around privacy concerns"],
      topPerformers: [
        { handle: "@techguru", platform: "youtube", metric: "engagement", change: 34 },
        { handle: "@innovator", platform: "instagram", metric: "reach", change: 28 },
        { handle: "@futuretech", platform: "linkedin", metric: "shares", change: 67 },
      ],
      competitorInsights: [
        "Competitor XYZ focusing heavily on educational content",
        "Brand ABC shifting to younger demographic targeting",
        "New player DEF entering market with aggressive pricing",
      ],
      recommendations: [
        "Increase AI-related content production",
        "Partner with micro-influencers for better ROI",
        "Address privacy concerns proactively",
        "Invest in video content creation",
      ],
      status: "delivered",
    },
    {
      id: "2",
      date: "2024-01-13",
      title: "Bi-weekly Competitive Analysis - Fashion Niche",
      summary:
        "Fashion week drove significant engagement. Sustainable fashion messaging dominated conversations with 67% positive sentiment.",
      keyTrends: [
        "Sustainable fashion content up 67%",
        "Behind-the-scenes content performing well",
        "Collaboration posts increased engagement by 45%",
        "Stories format gaining traction",
      ],
      alerts: [
        "Influencer @fashionista controversy affecting brand mentions",
        "Supply chain concerns trending negatively",
      ],
      topPerformers: [
        { handle: "@styleicon", platform: "instagram", metric: "engagement", change: 56 },
        { handle: "@fashionforward", platform: "youtube", metric: "views", change: 43 },
        { handle: "@trendsetter", platform: "linkedin", metric: "comments", change: 89 },
      ],
      competitorInsights: [
        "Brand X launching sustainable line next month",
        "Competitor Y partnering with eco-influencers",
        "New brand Z targeting Gen-Z with TikTok strategy",
      ],
      recommendations: [
        "Accelerate sustainable product line",
        "Create behind-the-scenes content series",
        "Develop influencer collaboration framework",
        "Monitor supply chain messaging",
      ],
      status: "delivered",
    },
    {
      id: "3",
      date: "2024-01-17",
      title: "Upcoming Brief - Health & Wellness Trends",
      summary: "Analysis in progress for health and wellness niche tracking...",
      keyTrends: [],
      alerts: [],
      topPerformers: [],
      competitorInsights: [],
      recommendations: [],
      status: "pending",
    },
  ])

  const deliveredBriefs = briefs.filter((brief) => brief.status === "delivered")
  const pendingBriefs = briefs.filter((brief) => brief.status === "pending")

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <TrendingUp className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">AI Trend Briefs</h2>
          <p className="text-gray-600 dark:text-gray-300">Automated intelligence reports delivered every 48 hours</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Briefs</p>
                <p className="text-2xl font-bold">{briefs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold">{deliveredBriefs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold">{pendingBriefs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Next Brief</p>
                <p className="text-2xl font-bold">18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brief Cards */}
      <div className="space-y-6">
        {briefs.map((brief) => (
          <Card key={brief.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{brief.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(brief.date).toLocaleDateString()} •
                    <Badge
                      variant={
                        brief.status === "delivered" ? "default" : brief.status === "pending" ? "secondary" : "outline"
                      }
                      className="ml-2"
                    >
                      {brief.status}
                    </Badge>
                  </p>
                </div>
                {brief.status === "delivered" && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </CardHeader>

            {brief.status === "delivered" && (
              <CardContent className="p-6 space-y-6">
                {/* Summary */}
                <div>
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-gray-700 dark:text-gray-300">{brief.summary}</p>
                </div>

                {/* Key Trends */}
                {brief.keyTrends.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Key Trends</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {brief.keyTrends.map((trend, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded"
                        >
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {brief.alerts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Alerts & Risks</h4>
                    <div className="space-y-2">
                      {brief.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Performers */}
                {brief.topPerformers.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Top Performers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {brief.topPerformers.map((performer, index) => (
                        <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{performer.handle}</span>
                            {getTrendIcon(performer.change)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {performer.platform} • {performer.metric}
                          </p>
                          <p className="text-sm font-semibold text-green-600">+{performer.change}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {brief.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">AI Recommendations</h4>
                    <div className="space-y-2">
                      {brief.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                        >
                          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}

            {brief.status === "pending" && (
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Brief generation in progress...</p>
                  <p className="text-sm text-gray-500 mt-2">Expected completion in 18 hours</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
