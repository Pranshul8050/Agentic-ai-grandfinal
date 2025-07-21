"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"

interface AnalyticsChartsProps {
  sentimentData: {
    positive: number
    neutral: number
    negative: number
  }
  engagementData: Array<{
    date: string
    engagement: number
  }>
}

export function AnalyticsCharts({ sentimentData, engagementData }: AnalyticsChartsProps) {
  const sentimentChartData = [
    { name: "Positive", value: sentimentData.positive, color: "#10b981" },
    { name: "Neutral", value: sentimentData.neutral, color: "#f59e0b" },
    { name: "Negative", value: sentimentData.negative, color: "#ef4444" },
  ]

  const chartConfig = {
    engagement: {
      label: "Engagement",
      color: "hsl(var(--chart-1))",
    },
    positive: {
      label: "Positive",
      color: "#10b981",
    },
    neutral: {
      label: "Neutral",
      color: "#f59e0b",
    },
    negative: {
      label: "Negative",
      color: "#ef4444",
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sentiment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Sentiment Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            {sentimentChartData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Engagement Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
                    return value.toString()
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--color-engagement)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-engagement)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "var(--color-engagement)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Peak</p>
              <p className="font-semibold">18.9K</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
              <p className="font-semibold">13.2K</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
              <p className="font-semibold text-green-600">+23%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
