"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Eye, AlertTriangle } from "lucide-react"

interface Competitor {
  id: string
  name: string
  industry: string
  mentions: number
  sentiment: number
  trend: "up" | "down" | "stable"
  topInfluencers: string[]
  riskLevel: "low" | "medium" | "high"
  lastActivity: string
}

export function CompetitorAnalysis() {
  const competitors: Competitor[] = [
    {
      id: "1",
      name: "Adidas",
      industry: "Sportswear",
      mentions: 1247,
      sentiment: 72,
      trend: "up",
      topInfluencers: ["@sportsguru", "@runningqueen", "@gymlife"],
      riskLevel: "medium",
      lastActivity: "2 hours ago",
    },
    {
      id: "2",
      name: "Under Armour",
      industry: "Sportswear",
      mentions: 856,
      sentiment: 68,
      trend: "stable",
      topInfluencers: ["@fitnesscoach", "@athletelife", "@workoutking"],
      riskLevel: "low",
      lastActivity: "4 hours ago",
    },
    {
      id: "3",
      name: "Puma",
      industry: "Sportswear",
      mentions: 1089,
      sentiment: 75,
      trend: "up",
      topInfluencers: ["@streetstyle", "@sneakerhead", "@fashionfit"],
      riskLevel: "high",
      lastActivity: "1 hour ago",
    },
    {
      id: "4",
      name: "New Balance",
      industry: "Sportswear",
      mentions: 634,
      sentiment: 69,
      trend: "down",
      topInfluencers: ["@runnerworld", "@comfortfit", "@casualstyle"],
      riskLevel: "low",
      lastActivity: "6 hours ago",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-yellow-500 rounded-full" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600"
    if (sentiment >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Competitor Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor competitor brand mentions and influencer partnerships
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {competitors.filter((c) => c.riskLevel === "high").length} High Risk
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{competitors.length}</div>
          <div className="text-sm text-gray-500">Tracked Competitors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">
            {competitors.reduce((sum, comp) => sum + comp.mentions, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Mentions</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(competitors.reduce((sum, comp) => sum + comp.sentiment, 0) / competitors.length)}%
          </div>
          <div className="text-sm text-gray-500">Avg Sentiment</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">{competitors.filter((c) => c.trend === "up").length}</div>
          <div className="text-sm text-gray-500">Trending Up</div>
        </Card>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{competitor.name}</span>
                    {getTrendIcon(competitor.trend)}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{competitor.industry}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRiskColor(competitor.riskLevel)}>
                    {competitor.riskLevel === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {competitor.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Mentions (48h)</span>
                  </div>
                  <div className="text-xl font-bold">{competitor.mentions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Brand Sentiment</div>
                  <div className={`text-xl font-bold ${getSentimentColor(competitor.sentiment)}`}>
                    {competitor.sentiment}%
                  </div>
                </div>
              </div>

              {/* Sentiment Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sentiment Score</span>
                  <span>{competitor.sentiment}%</span>
                </div>
                <Progress value={competitor.sentiment} className="h-2" />
              </div>

              {/* Top Influencers */}
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Influencer Partners</div>
                <div className="flex flex-wrap gap-1">
                  {competitor.topInfluencers.map((influencer, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {influencer}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-400">Last activity: {competitor.lastActivity}</span>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Threat Analysis */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Competitive Threat Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">High Priority Threats</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Puma gaining traction with street-style influencers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Adidas increasing influencer partnership budget</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Opportunities</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>New Balance declining in running segment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Gap in sustainable sportswear messaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
