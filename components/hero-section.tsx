"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { Sparkles, TrendingUp, Users, BarChart3, Loader2, Instagram, Youtube, Twitter } from "lucide-react"

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

  const demoExamples = [
    { influencer: "techguru", brand: "nike", result: "Positive Impact (85/100)" },
    { influencer: "fashionista", brand: "zara", result: "Excellent Alignment (88/100)" },
    { influencer: "fitnessking", brand: "nike", result: "Perfect Synergy (94/100)" },
    { influencer: "techguru", brand: "samsung", result: "Neutral Impact (68/100)" },
    { influencer: "fitnessking", brand: "mcdonalds", result: "Brand Conflict (23/100)" },
    { influencer: "fashionista", brand: "gucci", result: "Misaligned (45/100)" },
  ]

  const quickFillExample = (influencer: string, brand: string) => {
    setInfluencer(influencer)
    setBrand(brand)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Brand Intelligence Platform
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Instagram API Connected
          </Badge>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
  <h2 className="text-5xl md:text-6xl font-bold leading-snug mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
    AI-Powered Brand Intelligence
  </h2>
  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-2">
    Track influencers, analyze competitors, and get automated trend briefs every 48 hours. Real-time social
    media intelligence for modern brands.
  </p>
</div>

              Track influencers, analyze competitors, and get automated trend briefs every 48 hours. Real-time social
              media intelligence for modern brands.
            </p>
          </div>

          {/* Quick Analysis Form */}
          <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Quick Analysis</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Influencer username (e.g., techguru)"
                      value={influencer}
                      onChange={(e) => setInfluencer(e.target.value)}
                      className="h-12 text-lg"
                      disabled={isAnalyzing}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Brand name (e.g., nike)"
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
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isAnalyzing || !influencer.trim() || !brand.trim()}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Impact
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Examples */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try these demo combinations:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {demoExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => quickFillExample(example.influencer, example.brand)}
                      className="text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      disabled={isAnalyzing}
                    >
                      <div className="font-medium text-sm">
                        @{example.influencer} × {example.brand}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{example.result}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0"
              onClick={() => onTabChange("tracker")}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold">Influencer Tracker</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor curated influencers and competitors across all platforms in real-time.
              </p>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0"
              onClick={() => onTabChange("briefs")}
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-semibold">AI Trend Briefs</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Get automated 48-hour trend summaries with actionable insights for your brand.
              </p>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0"
              onClick={() => onTabChange("competitors")}
            >
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="w-8 h-8 text-pink-600" />
                <h3 className="text-xl font-semibold">Competitor Analysis</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Track competitor brand mentions and analyze their influencer partnerships.
              </p>
            </Card>
          </div>

          {/* Platform Support */}
          <div className="flex items-center justify-center space-x-8 mt-12 opacity-60">
            <div className="flex items-center space-x-2">
              <Instagram className="w-6 h-6" />
              <span className="text-sm">Instagram</span>
            </div>
            <div className="flex items-center space-x-2">
              <Youtube className="w-6 h-6" />
              <span className="text-sm">YouTube</span>
            </div>
            <div className="flex items-center space-x-2">
              <Twitter className="w-6 h-6" />
              <span className="text-sm">Twitter</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
