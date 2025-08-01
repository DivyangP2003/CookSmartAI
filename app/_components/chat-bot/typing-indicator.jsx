"use client"

import { Bot } from "lucide-react"

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-2 max-w-[80%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500 text-white">
          <Bot className="w-4 h-4" />
        </div>

        {/* Typing Animation */}
        <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
