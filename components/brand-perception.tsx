"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface BrandPerceptionProps {
  quote: string
  sentiment: string
}

export function BrandPerception({ quote, sentiment }: BrandPerceptionProps) {
  const getSentimentIcon = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <TrendingUp className="w-6 h-6 text-green-500" />
      case "negative":
        return <TrendingDown className="w-6 h-6 text-red-500" />
      default:
        return <Minus className="w-6 h-6 text-yellow-500" />
    }
  }

  const getSentimentColor = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      case "negative":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      default:
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    }
  }

  const getBadgeColor = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  const recommendations = {
    positive: [
      "Continue current collaboration strategy",
      "Increase content frequency during peak engagement",
      "Consider long-term partnership opportunities",
      "Leverage success for similar influencer outreach",
    ],
    negative: [
      "Review content alignment with brand values",
      "Consider audience demographic analysis",
      "Implement content approval process",
      "Explore alternative influencer partnerships",
    ],
    neutral: [
      "Enhance content creativity and authenticity",
      "Provide clearer brand guidelines",
      "Monitor engagement trends closely",
      "Test different content formats",
    ],
  }

  const currentRecommendations = recommendations[sentiment.toLowerCase()] || recommendations.neutral

  return (
    <Card className={`${getSentimentColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Quote className="w-5 h-5" />
          <span>AI Brand Perception</span>
          <div className="flex items-center space-x-2">
            {getSentimentIcon()}
            <Badge className={getBadgeColor()}>{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Impact</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* AI Quote */}
        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-gray-300 dark:border-gray-600 pl-4">
          "{quote}"
        </blockquote>

        {/* Recommendations */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Strategic Recommendations</h4>
          <ul className="space-y-2">
            {currentRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sentiment === "positive" ? "94%" : sentiment === "negative" ? "34%" : "67%"}
            </div>
            <div className="text-xs text-gray-500">Brand Alignment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sentiment === "positive" ? "8.9" : sentiment === "negative" ? "3.2" : "6.1"}
            </div>
            <div className="text-xs text-gray-500">Engagement Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
