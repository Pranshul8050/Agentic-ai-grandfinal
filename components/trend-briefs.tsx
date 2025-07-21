"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Users, Eye, Download, Clock } from "lucide-react"

interface TrendBrief {
  id: string
  title: string
  date: string
  status: "completed" | "processing" | "scheduled"
  insights: number
  mentions: number
  sentiment: "positive" | "neutral" | "negative"
  summary: string
  keyTrends: string[]
}

export function TrendBriefs() {
  const briefs: TrendBrief[] = [
    {
      id: "1",
      title: "Nike x Tech Influencers - 48h Brief",
      date: "2024-01-15",
      status: "completed",
      insights: 24,
      mentions: 156,
      sentiment: "positive",
      summary:
        "Strong positive sentiment around Nike's tech collaborations. Tech influencers are driving authentic engagement with 34% above-average interaction rates.",
      keyTrends: ["Tech Integration", "Authentic Reviews", "High Engagement"],
    },
    {
      id: "2",
      title: "Fashion Week Competitor Analysis",
      date: "2024-01-13",
      status: "completed",
      insights: 18,
      mentions: 89,
      sentiment: "neutral",
      summary:
        "Mixed reactions to competitor fashion week campaigns. Opportunity identified in sustainable fashion messaging gap.",
      keyTrends: ["Sustainability Gap", "Mixed Reactions", "Opportunity Identified"],
    },
    {
      id: "3",
      title: "Fitness Influencer Landscape",
      date: "2024-01-11",
      status: "completed",
      insights: 31,
      mentions: 203,
      sentiment: "positive",
      summary:
        "Fitness influencers showing exceptional brand alignment. Recommendation: Increase investment in this vertical by 40%.",
      keyTrends: ["Exceptional Alignment", "Investment Opportunity", "Vertical Growth"],
    },
    {
      id: "4",
      title: "Q1 Brand Sentiment Overview",
      date: "2024-01-16",
      status: "processing",
      insights: 0,
      mentions: 0,
      sentiment: "neutral",
      summary: "Processing current quarter sentiment analysis across all tracked influencers and competitors...",
      keyTrends: ["Processing..."],
    },
    {
      id: "5",
      title: "Weekend Social Media Pulse",
      date: "2024-01-17",
      status: "scheduled",
      insights: 0,
      mentions: 0,
      sentiment: "neutral",
      summary: "Scheduled analysis of weekend social media activity and engagement patterns.",
      keyTrends: ["Scheduled Analysis"],
    },
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "processing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Eye className="w-4 h-4" />
      case "processing":
        return <Clock className="w-4 h-4 animate-spin" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Trend Briefs</h2>
          <p className="text-gray-600 dark:text-gray-300">Automated 48-hour intelligence reports for your brand</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          {briefs.filter((b) => b.status === "completed").length} Completed
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{briefs.length}</div>
          <div className="text-sm text-gray-500">Total Briefs</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {briefs.filter((b) => b.status === "completed").length}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">
            {briefs.filter((b) => b.status === "processing").length}
          </div>
          <div className="text-sm text-gray-500">Processing</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">
            {briefs.reduce((sum, brief) => sum + brief.insights, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Insights</div>
        </Card>
      </div>

      {/* Brief Cards */}
      <div className="space-y-4">
        {briefs.map((brief) => (
          <Card key={brief.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg">{brief.title}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(brief.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(brief.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(brief.status)}
                      <span className="capitalize">{brief.status}</span>
                    </div>
                  </Badge>
                  {brief.status === "completed" && (
                    <Badge className={getSentimentColor(brief.sentiment)}>{brief.sentiment} Sentiment</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <p className="text-gray-700 dark:text-gray-300">{brief.summary}</p>

              {/* Metrics */}
              {brief.status === "completed" && (
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{brief.insights} Insights</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{brief.mentions} Mentions</span>
                  </div>
                </div>
              )}

              {/* Key Trends */}
              <div className="flex flex-wrap gap-2">
                {brief.keyTrends.map((trend, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trend}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              {brief.status === "completed" && (
                <div className="flex items-center space-x-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Brief Schedule */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Next Automated Brief</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive brand intelligence report scheduled for tomorrow at 9:00 AM
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">18h 32m</div>
              <div className="text-sm text-gray-500">Until next brief</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
