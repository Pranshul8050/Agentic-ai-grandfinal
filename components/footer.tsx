"use client"

import { Sparkles, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Brand Intelligence
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time influencer tracking and competitive intelligence powered by AI.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Influencer Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Trend Briefs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Competitor Analysis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 AI Brand Intelligence Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
