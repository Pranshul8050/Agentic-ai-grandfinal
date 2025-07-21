"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface APIStatus {
  name: string
  status: "connected" | "disconnected" | "error"
  message: string
  lastChecked: string
}

export function APIStatus() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([
    {
      name: "Instagram API",
      status: "connected",
      message: "App ID: 719637534164566 - Ready for access token",
      lastChecked: new Date().toLocaleTimeString(),
    },
    {
      name: "OpenAI API",
      status: "disconnected",
      message: "API key not configured",
      lastChecked: new Date().toLocaleTimeString(),
    },
    {
      name: "YouTube API",
      status: "disconnected",
      message: "API key not configured",
      lastChecked: new Date().toLocaleTimeString(),
    },
  ])

  const [isChecking, setIsChecking] = useState(false)

  const checkAPIStatus = async () => {
    setIsChecking(true)

    // Simulate API status check
    setTimeout(() => {
      setApiStatuses((prev) =>
        prev.map((api) => ({
          ...api,
          lastChecked: new Date().toLocaleTimeString(),
        })),
      )
      setIsChecking(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Disconnected</Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Status</CardTitle>
        <Button variant="outline" size="sm" onClick={checkAPIStatus} disabled={isChecking}>
          {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Check Status
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiStatuses.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                {getStatusIcon(api.status)}
                <div>
                  <div className="font-medium">{api.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{api.message}</div>
                  <div className="text-xs text-gray-400">Last checked: {api.lastChecked}</div>
                </div>
              </div>
              {getStatusBadge(api.status)}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Instagram API Configuration</h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <div>
              App ID: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">719637534164566</code>
            </div>
            <div>
              App Secret:{" "}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">a24fc80aeaa4771b746ad85c40b4ed22</code>
            </div>
            <div className="text-xs mt-2 text-blue-600 dark:text-blue-300">
              ✅ Instagram app is configured and ready. Add your access token in environment variables to activate.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
