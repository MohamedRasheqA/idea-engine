"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { IoCloseOutline, IoArrowUpOutline } from "react-icons/io5"
import { RiCustomerService2Fill } from "react-icons/ri"

interface SupportMessage {
  id: string
  role: "user" | "support"
  content: string
  timestamp: Date
}

interface SupportChatProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "1",
      role: "support",
      content: "Hi there! How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: SupportMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate support agent typing
    setTimeout(() => {
      const supportResponses = [
        "I'll look into that for you right away.",
        "Thanks for reaching out. Let me check that for you.",
        "I understand your concern. Let me help you with that.",
        "We're here to help! Could you provide more details?",
        "I'm checking our resources to find the best solution for you.",
      ]

      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)]

      const supportMessage: SupportMessage = {
        id: (Date.now() + 1).toString(),
        role: "support",
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, supportMessage])
      setIsTyping(false)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 flex flex-col rounded-lg shadow-lg bg-white overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-purple-500 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <RiCustomerService2Fill className="mr-2 text-xl" />
          <div>
            <h3 className="font-medium">Support</h3>
            <p className="text-xs text-purple-100">We typically reply in a few minutes</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-purple-200">
          <IoCloseOutline className="text-xl" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-2 rounded-lg ${
                  message.role === "user" ? "bg-purple-500 text-white" : "bg-white border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-2 rounded-lg bg-white border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            type="submit"
            className={`ml-2 bg-purple-500 text-white rounded-full p-2 transition-opacity duration-300 ${
              input ? "opacity-100" : "opacity-50"
            }`}
            disabled={!input.trim()}
          >
            <IoArrowUpOutline className="text-sm" />
          </button>
        </div>
      </form>
    </div>
  )
}

