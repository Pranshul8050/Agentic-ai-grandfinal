"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share, Target, Award, AlertTriangle } from "lucide-react"

interface Competitor {
  id: string
  name: string
  handle: string
  platform: string
  followers: number
  engagement: number
  postsLastWeek: number
  avgLikes: number
  avgComments: number
  avgShares: number
  sentimentScore: number
  topContent: string[]
  threats: string[]
  opportunities: string[]
}

export function CompetitorAnalysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days")
  const [selectedMetric, setSelectedMetric] = useState("engagement")

  const [competitors] = useState<Competitor[]>([
    {
      id: "1",
      name: "TechCorp",
      handle: "@techcorp",
      platform: "instagram",
      followers: 245000,
      engagement: 4.8,
      postsLastWeek: 12,
      avgLikes: 8500,
      avgComments: 340,
      avgShares: 120,
      sentimentScore: 78,
      topContent: ["Product launches", "Behind-the-scenes", "User testimonials"],
      threats: ["Aggressive pricing strategy", "Influencer partnerships increasing"],
      opportunities: ["Limited video content", "Weak LinkedIn presence"],
    },
    {
      id: "2",
      name: "InnovateBrand",
      handle: "@innovatebrand",
      platform: "youtube",
      followers: 189000,
      engagement: 6.2,
      postsLastWeek: 8,
      avgLikes: 12000,
      avgComments: 890,
      avgShares: 450,
      sentimentScore: 82,
      topContent: ["Educational tutorials", "Industry insights", "Live Q&As"],
      threats: ["High-quality video production", "Strong thought leadership"],
      opportunities: ["Inconsistent posting schedule", "Limited cross-platform presence"],
    },
    {
      id: "3",
      name: "FutureVision",
      handle: "@futurevision",
      platform: "linkedin",
      followers: 67000,
      engagement: 3.4,
      postsLastWeek: 15,
      avgLikes: 2100,
      avgComments: 180,
      avgShares: 95,
      sentimentScore: 71,
      topContent: ["Industry reports", "Company updates", "Thought leadership"],
      threats: ["Strong B2B network", "Regular industry insights"],
      opportunities: ["Low visual content", "Limited engagement with comments"],
    },
  ])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return "text-green-600"
    if (rate >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getSentimentColor = (score: number) => {
    if (score >= 75) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const totalFollowers = competitors.reduce((sum, comp) => sum + comp.followers, 0)
  const avgEngagement = competitors.reduce((sum, comp) => sum + comp.engagement, 0) / competitors.length
  const totalPosts = competitors.reduce((sum, comp) => sum + comp.postsLastWeek, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Competitor Intelligence</h2>
          <p className="text-gray-600 dark:text-gray-300">Real-time competitive analysis across all platforms</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="content">Content Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Competitors Tracked</p>
                <p className="text-2xl font-bold">{competitors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reach</p>
                <p className="text-2xl font-bold">{formatNumber(totalFollowers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</p>
                <p className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Posts</p>
                <p className="text-2xl font-bold">{totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-6">
        {competitors.map((competitor, index) => (
          <Card key={competitor.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{competitor.name}</span>
                    <Badge variant="outline">{competitor.platform}</Badge>
                    {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {competitor.handle} • {formatNumber(competitor.followers)} followers
                  </p>
                </div>
                <Badge className={getSentimentColor(competitor.sentimentScore)}>
                  {competitor.sentimentScore}% Sentiment
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engagement Rate</span>
                      <span className={`font-semibold ${getEngagementColor(competitor.engagement)}`}>
                        {competitor.engagement}%
                      </span>
                    </div>
                    <Progress value={competitor.engagement * 10} className="h-2" />

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Heart className="w-4 h-4 mx-auto mb-1 text-red-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Likes</p>
                        <p className="font-semibold text-sm">{formatNumber(competitor.avgLikes)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <MessageCircle className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Comments</p>
                        <p className="font-semibold text-sm">{formatNumber(competitor.avgComments)}</p>
                      </div>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Share className="w-4 h-4 mx-auto mb-1 text-green-500" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Avg Shares</p>
                        <p className="font-semibold text-sm">{formatNumber(competitor.avgShares)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Strategy */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Content Strategy</h4>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {competitor.postsLastWeek} posts this week
                    </p>

                    <div>
                      <p className="text-sm font-medium mb-2">Top Content Types:</p>
                      <div className="space-y-1">
                        {competitor.topContent.map((content, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Threats & Opportunities */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Strategic Analysis</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">Threats</span>
                      </div>
                      <div className="space-y-1">
                        {competitor.threats.map((threat, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded"
                          >
                            {threat}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Opportunities</span>
                      </div>
                      <div className="space-y-1">
                        {competitor.opportunities.map((opp, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded"
                          >
                            {opp}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Immediate Opportunities</h4>
              <div className="space-y-2">
                <p className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  Increase video content production - competitors showing 40% higher engagement
                </p>
                <p className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  Expand LinkedIn presence - FutureVision has weak visual content strategy
                </p>
                <p className="text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  Launch educational content series - InnovateBrand's tutorials performing well
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">Competitive Threats</h4>
              <div className="space-y-2">
                <p className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  TechCorp's aggressive pricing may impact market share
                </p>
                <p className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  InnovateBrand's thought leadership gaining industry recognition
                </p>
                <p className="text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  Monitor influencer partnership strategies across all competitors
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
