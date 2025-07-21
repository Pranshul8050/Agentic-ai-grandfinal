"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, ExternalLink } from "lucide-react"

interface Post {
  id: number
  image: string
  caption: string
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  sentiment: string
  alignment: string
}

interface TrendingContentProps {
  posts: Post[]
}

export function TrendingContent({ posts }: TrendingContentProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  const getAlignmentColor = (alignment: string) => {
    if (alignment.includes("Well")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (alignment.includes("Misalignment")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Top Performing Posts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 space-y-4">
              {/* Post Image */}
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Caption */}
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{post.caption}</p>
              </div>

              {/* Engagement Metrics */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(post.engagement.likes)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(post.engagement.comments)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="w-4 h-4" />
                    <span>{formatNumber(post.engagement.shares)}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-2">
                <Badge className={getSentimentColor(post.sentiment)}>{post.sentiment} Sentiment</Badge>
                <Badge className={getAlignmentColor(post.alignment)}>{post.alignment}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
