"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Heart, Sparkles, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

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
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "negative":
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Exceptional Performance"
    if (score >= 80) return "Excellent Alignment"
    if (score >= 70) return "Strong Performance"
    if (score >= 60) return "Good Potential"
    if (score >= 40) return "Moderate Impact"
    if (score >= 25) return "Needs Improvement"
    return "Poor Alignment"
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
          <span className="font-semibold text-blue-600">@{data.influencer}</span> ×{" "}
          <span className="font-semibold text-purple-600">{data.brand}</span>
        </p>
      </div>

      {/* Main Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Sentiment */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">{getSentimentIcon(data.overallSentiment)}</div>
            <CardTitle className="text-lg">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`text-3xl font-bold capitalize ${getSentimentColor(data.overallSentiment)}`}>
                {data.overallSentiment}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Positive</span>
                  <span className="font-semibold">{data.sentimentDistribution.positive}%</span>
                </div>
                <Progress value={data.sentimentDistribution.positive} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600">Neutral</span>
                  <span className="font-semibold">{data.sentimentDistribution.neutral}%</span>
                </div>
                <Progress value={data.sentimentDistribution.neutral} className="h-2" />

                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Negative</span>
                  <span className="font-semibold">{data.sentimentDistribution.negative}%</span>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {getScoreDescription(data.impactScore)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
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
                <span className="font-semibold">
                  {data.impactScore >= 70 ? "12.5K" : data.impactScore >= 40 ? "8.2K" : "4.1K"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Trend Direction</span>
                </div>
                <span
                  className={`font-semibold ${data.impactScore >= 60 ? "text-green-600" : data.impactScore >= 40 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {data.impactScore >= 60 ? "↗ Rising" : data.impactScore >= 40 ? "→ Stable" : "↘ Declining"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {data.tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`px-3 py-1 ${
              data.overallSentiment === "positive"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : data.overallSentiment === "negative"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
