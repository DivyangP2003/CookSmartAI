"use client"

import { User, Bot } from "lucide-react"

export default function ChatMessage({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start space-x-2`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? "bg-orange-500 text-white ml-2" : "bg-green-500 text-white mr-2"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-orange-500 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
