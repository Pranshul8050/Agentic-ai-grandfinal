import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading AI Brand Intelligence...</h2>
        <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
