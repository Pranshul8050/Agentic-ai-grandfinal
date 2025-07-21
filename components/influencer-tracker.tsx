"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Trash2, Instagram, Youtube, Twitter, TrendingUp, Users } from "lucide-react"

interface TrackedInfluencer {
  id: string
  username: string
  platform: string
  followers: string
  engagement: string
  status: "active" | "paused"
  lastUpdate: string
  sentiment: "positive" | "neutral" | "negative"
}

export function InfluencerTracker() {
  const [trackedInfluencers, setTrackedInfluencers] = useState<TrackedInfluencer[]>([
    {
      id: "1",
      username: "techguru",
      platform: "instagram",
      followers: "2.4M",
      engagement: "8.2%",
      status: "active",
      lastUpdate: "2 hours ago",
      sentiment: "positive",
    },
    {
      id: "2",
      username: "fashionista",
      platform: "instagram",
      followers: "1.8M",
      engagement: "6.7%",
      status: "active",
      lastUpdate: "4 hours ago",
      sentiment: "positive",
    },
    {
      id: "3",
      username: "fitnessking",
      platform: "youtube",
      followers: "890K",
      engagement: "12.1%",
      status: "paused",
      lastUpdate: "1 day ago",
      sentiment: "neutral",
    },
    {
      id: "4",
      username: "foodieblogger",
      platform: "instagram",
      followers: "650K",
      engagement: "9.3%",
      status: "active",
      lastUpdate: "6 hours ago",
      sentiment: "positive",
    },
  ])

  const [newInfluencer, setNewInfluencer] = useState({ username: "", platform: "instagram" })

  const addInfluencer = () => {
    if (newInfluencer.username.trim()) {
      const newTracker: TrackedInfluencer = {
        id: Date.now().toString(),
        username: newInfluencer.username.trim(),
        platform: newInfluencer.platform,
        followers: "Loading...",
        engagement: "Loading...",
        status: "active",
        lastUpdate: "Just added",
        sentiment: "neutral",
      }
      setTrackedInfluencers([...trackedInfluencers, newTracker])
      setNewInfluencer({ username: "", platform: "instagram" })
    }
  }

  const removeInfluencer = (id: string) => {
    setTrackedInfluencers(trackedInfluencers.filter((inf) => inf.id !== id))
  }

  const toggleStatus = (id: string) => {
    setTrackedInfluencers(
      trackedInfluencers.map((inf) =>
        inf.id === id ? { ...inf, status: inf.status === "active" ? "paused" : "active" } : inf,
      ),
    )
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "youtube":
        return <Youtube className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      default:
        return <Instagram className="w-4 h-4" />
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Influencer Tracker</h2>
          <p className="text-gray-600 dark:text-gray-300">Monitor your curated list of influencers across platforms</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {trackedInfluencers.filter((inf) => inf.status === "active").length} Active
        </Badge>
      </div>

      {/* Add New Influencer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Influencer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter username (e.g., techguru)"
              value={newInfluencer.username}
              onChange={(e) => setNewInfluencer({ ...newInfluencer, username: e.target.value })}
              className="flex-1"
            />
            <select
              value={newInfluencer.platform}
              onChange={(e) => setNewInfluencer({ ...newInfluencer, platform: e.target.value })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
            </select>
            <Button onClick={addInfluencer} disabled={!newInfluencer.username.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tracker
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Influencers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trackedInfluencers.map((influencer) => (
          <Card key={influencer.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder-user.jpg`} />
                    <AvatarFallback>{influencer.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">@{influencer.username}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      {getPlatformIcon(influencer.platform)}
                      <span className="capitalize">{influencer.platform}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInfluencer(influencer.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Followers</span>
                  </div>
                  <div className="font-semibold">{influencer.followers}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Engagement</span>
                  </div>
                  <div className="font-semibold">{influencer.engagement}</div>
                </div>
              </div>

              {/* Sentiment & Status */}
              <div className="flex items-center justify-between">
                <Badge className={getSentimentColor(influencer.sentiment)}>{influencer.sentiment} Sentiment</Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{influencer.status === "active" ? "Active" : "Paused"}</span>
                  <Switch
                    checked={influencer.status === "active"}
                    onCheckedChange={() => toggleStatus(influencer.id)}
                  />
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-gray-400 text-center pt-2 border-t">
                Last updated: {influencer.lastUpdate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{trackedInfluencers.length}</div>
          <div className="text-sm text-gray-500">Total Tracked</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {trackedInfluencers.filter((inf) => inf.status === "active").length}
          </div>
          <div className="text-sm text-gray-500">Active Trackers</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">
            {trackedInfluencers.filter((inf) => inf.sentiment === "positive").length}
          </div>
          <div className="text-sm text-gray-500">Positive Sentiment</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-sm text-gray-500">Platforms</div>
        </Card>
      </div>
    </div>
  )
}
