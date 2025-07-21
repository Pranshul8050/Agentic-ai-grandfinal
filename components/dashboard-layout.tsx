"use client"

import type { ReactNode } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Eye, Bell, Target, BarChart3 } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function DashboardLayout({ children, activeTab = "analyze", onTabChange }: DashboardLayoutProps) {
  const handleBack = () => {
    if (onTabChange) {
      onTabChange("home")
    }
  }

  const tabs = [
    { id: "analyze", label: "Analysis", icon: BarChart3 },
    { id: "tracker", label: "Tracker", icon: Eye },
    { id: "briefs", label: "Trend Briefs", icon: Bell },
    { id: "competitors", label: "Competitors", icon: Target },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Brand Intelligence Platform
                </span>
              </div>
            </div>
            <ModeToggle />
          </div>

          {/* Navigation Tabs */}
          {onTabChange && (
            <div className="flex space-x-1 mt-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
