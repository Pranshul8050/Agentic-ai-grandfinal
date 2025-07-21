"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, Sparkles, TrendingUp, Users, Heart } from "lucide-react"

interface BrandPerceptionProps {
  quote: string
  sentiment: string
}

export function BrandPerception({ quote, sentiment }: BrandPerceptionProps) {
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

  const insights = [
    {
      icon: TrendingUp,
      label: "Engagement Trend",
      value: "+23%",
      description: "Above industry average",
      color: "text-green-600",
    },
    {
      icon: Users,
      label: "Audience Reach",
      value: "2.4M",
      description: "Potential impressions",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      label: "Brand Affinity",
      value: "High",
      description: "Strong positive sentiment",
      color: "text-purple-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>AI Brand Perception</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Quote */}
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200 dark:text-blue-800" />
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 pl-6 border-l-4 border-blue-500">
            {quote}
          </blockquote>
          <div className="mt-3 flex justify-end">
            <Badge className={getSentimentColor(sentiment)}>AI Analysis: {sentiment}</Badge>
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Key Insights</h4>
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`p-2 rounded-full bg-white dark:bg-gray-700 ${insight.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{insight.label}</span>
                      <span className={`font-bold ${insight.color}`}>{insight.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Recommendations</h4>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Continue collaborating with this influencer for authentic brand advocacy
              </p>
            </div>
            <div className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Leverage their humor and authenticity in future campaigns
              </p>
            </div>
            <div className="flex items-start space-x-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Consider expanding partnership to include video content
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
