"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles, TrendingUp, Eye, Bell, Target, BarChart3, Zap, Shield, Clock } from "lucide-react"

interface HeroSectionProps {
  onAnalyze: (influencer: string, brand: string) => void
  isAnalyzing: boolean
  onTabChange: (tab: string) => void
}

export function HeroSection({ onAnalyze, isAnalyzing, onTabChange }: HeroSectionProps) {
  const [influencer, setInfluencer] = useState("")
  const [brand, setBrand] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (influencer.trim() && brand.trim()) {
      onAnalyze(influencer.trim(), brand.trim())
    }
  }

  const quickActions = [
    { id: "tracker", label: "Track Influencers", icon: Eye, description: "Monitor influencer activity" },
    { id: "briefs", label: "Trend Briefs", icon: Bell, description: "AI-generated reports" },
    { id: "competitors", label: "Competitor Analysis", icon: Target, description: "Track competitor moves" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Brand Intelligence Platform
              </span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Text */}
          <div className="space-y-6">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Brand Intelligence
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              Track What Influencers Say About Your Brand
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered insights on influencer sentiment, competitor moves, and trending content. Automated reports
              delivered every 48 hours to keep your brand ahead.
            </p>
          </div>

          {/* Analysis Form */}
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Influencer Handle
                    </label>
                    <Input
                      type="text"
                      placeholder="@techguru, @fashionista, @foodie..."
                      value={influencer}
                      onChange={(e) => setInfluencer(e.target.value)}
                      className="h-12 text-lg"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Nike, Apple, Tesla..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="h-12 text-lg"
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isAnalyzing || !influencer.trim() || !brand.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-3" />
                      Analyze Brand Impact
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try: @techguru + Nike, @fashionista + Zara, @foodie + McDonald's
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Or explore our platform features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Card
                    key={action.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
                    onClick={() => onTabChange(action.id)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{action.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor influencer content and competitor moves as they happen
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get intelligent analysis and actionable recommendations
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Automated Reports</h3>
              <p className="text-gray-600 dark:text-gray-400">Receive comprehensive trend briefs every 48 hours</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
