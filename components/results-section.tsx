"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Heart, Sparkles } from "lucide-react"

interface ResultsSectionProps {
  data: {
    influencer: string
    brand: string
    overallSentiment: string
    impactScore: number
    summary: string
    tags: string[]
    sentimentDistribution: {
      positive: number
      neutral: number
      negative: number
    }
  }
}

export function ResultsSection({ data }: ResultsSectionProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      case "negative":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Analysis Results</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {data.influencer} × {data.brand}
        </p>
      </div>

      {/* Main Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Sentiment */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`text-4xl font-bold capitalize ${getSentimentColor(data.overallSentiment)}`}>
                {data.overallSentiment}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Positive</span>
                  <span>{data.sentimentDistribution.positive}%</span>
                </div>
                <Progress value={data.sentimentDistribution.positive} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Neutral</span>
                  <span>{data.sentimentDistribution.neutral}%</span>
                </div>
                <Progress value={data.sentimentDistribution.neutral} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span>Negative</span>
                  <span>{data.sentimentDistribution.negative}%</span>
                </div>
                <Progress value={data.sentimentDistribution.negative} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Score */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Brand Impact Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`text-4xl font-bold ${getScoreColor(data.impactScore)}`}>{data.impactScore}/100</div>
              <Progress value={data.impactScore} className="h-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.impactScore >= 70 ? "Excellent" : data.impactScore >= 40 ? "Good" : "Needs Improvement"} brand
                alignment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Posts Analyzed</span>
                </div>
                <span className="font-semibold">12</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Avg Engagement</span>
                </div>
                <span className="font-semibold">8.2K</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Trend Direction</span>
                </div>
                <span className="font-semibold text-green-600">↗ Rising</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {data.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
