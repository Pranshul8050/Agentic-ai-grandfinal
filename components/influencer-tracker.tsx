"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Eye, EyeOff, Youtube, Instagram, Linkedin, TrendingUp, Users, Clock } from "lucide-react"

interface TrackedInfluencer {
  id: string
  handle: string
  platform: string
  category: "influencer" | "competitor"
  isActive: boolean
  lastUpdate: string
  followers: number
  engagementRate: number
  recentPosts: number
}

export function InfluencerTracker() {
  const [trackedList, setTrackedList] = useState<TrackedInfluencer[]>([
    {
      id: "1",
      handle: "@techguru",
      platform: "youtube",
      category: "influencer",
      isActive: true,
      lastUpdate: "2 hours ago",
      followers: 125000,
      engagementRate: 4.2,
      recentPosts: 3,
    },
    {
      id: "2",
      handle: "@competitor_brand",
      platform: "instagram",
      category: "competitor",
      isActive: true,
      lastUpdate: "1 hour ago",
      followers: 89000,
      engagementRate: 3.8,
      recentPosts: 5,
    },
    {
      id: "3",
      handle: "@industry_leader",
      platform: "linkedin",
      category: "competitor",
      isActive: false,
      lastUpdate: "6 hours ago",
      followers: 45000,
      engagementRate: 2.1,
      recentPosts: 1,
    },
  ])

  const [newHandle, setNewHandle] = useState("")
  const [newPlatform, setNewPlatform] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const addInfluencer = () => {
    if (newHandle && newPlatform && newCategory) {
      const newInfluencer: TrackedInfluencer = {
        id: Date.now().toString(),
        handle: newHandle.startsWith("@") ? newHandle : `@${newHandle}`,
        platform: newPlatform,
        category: newCategory as "influencer" | "competitor",
        isActive: true,
        lastUpdate: "Just added",
        followers: Math.floor(Math.random() * 100000) + 10000,
        engagementRate: Math.round((Math.random() * 5 + 1) * 10) / 10,
        recentPosts: Math.floor(Math.random() * 10) + 1,
      }
      setTrackedList([...trackedList, newInfluencer])
      setNewHandle("")
      setNewPlatform("")
      setNewCategory("")
    }
  }

  const removeInfluencer = (id: string) => {
    setTrackedList(trackedList.filter((item) => item.id !== id))
  }

  const toggleTracking = (id: string) => {
    setTrackedList(trackedList.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item)))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-500" />
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const activeInfluencers = trackedList.filter((item) => item.isActive && item.category === "influencer").length
  const activeCompetitors = trackedList.filter((item) => item.isActive && item.category === "competitor").length
  const totalPosts = trackedList.reduce((sum, item) => sum + item.recentPosts, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Influencers</p>
                <p className="text-2xl font-bold">{activeInfluencers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Competitors</p>
                <p className="text-2xl font-bold">{activeCompetitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recent Posts</p>
                <p className="text-2xl font-bold">{totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Next Brief</p>
                <p className="text-2xl font-bold">18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="@handle or username" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} />
            <Select value={newPlatform} onValueChange={setNewPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="influencer">Influencer</SelectItem>
                <SelectItem value="competitor">Competitor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addInfluencer} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Tracker
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracked List */}
      <Card>
        <CardHeader>
          <CardTitle>Tracked Accounts ({trackedList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackedList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(item.platform)}
                    <span className="font-medium">{item.handle}</span>
                  </div>
                  <Badge variant={item.category === "influencer" ? "default" : "secondary"}>{item.category}</Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(item.followers)} followers • {item.engagementRate}% engagement
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.recentPosts} posts • {item.lastUpdate}
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.isActive ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Switch checked={item.isActive} onCheckedChange={() => toggleTracking(item.id)} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInfluencer(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
