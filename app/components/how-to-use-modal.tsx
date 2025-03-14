"use client"

import { IoCloseOutline } from "react-icons/io5"
import { IoChevronDownOutline } from "react-icons/io5"
import { useState } from "react"

interface Section {
  title: string
  subtitle: string
  content: string
}

interface HowToUseModalProps {
  isOpen: boolean
  onClose: () => void
}

const sections: Section[] = [
  {
    title: "Getting started",
    subtitle: "How to import and chat with your first document",
    content:
      "Learn the basics of importing documents and starting your first chat conversation with Destructive AI. We'll guide you through the simple process of uploading files and initiating meaningful interactions.",
  },
  {
    title: "Chat with multiple documents & folders",
    subtitle: "How to chat and compare multiple documents/links at one time",
    content:
      "Discover how to engage with multiple documents simultaneously, making it easy to cross-reference information and maintain organized conversations across different files and folders.",
  },
  {
    title: "Making the most of chat",
    subtitle: "How to chat with your documents, notes and even access web results",
    content:
      "Maximize your chat experience by learning advanced features, including document analysis, note-taking integration, and web search capabilities all within your conversations.",
  },
  {
    title: "Creating and working with Notes",
    subtitle: "How to create notes with our AI-powered text editor",
    content:
      "Master our AI-powered text editor to create, edit, and organize your notes efficiently. Learn about smart formatting, auto-suggestions, and collaborative features.",
  },
  {
    title: "Using AI to assist your writing",
    subtitle: "How to make the most of AI drafts, outlines and edits",
    content:
      "Leverage AI capabilities to enhance your writing process. Get help with drafting documents, creating outlines, and receiving intelligent editing suggestions.",
  },
  {
    title: "Creating a Workflow automation",
    subtitle: "How to automate complex, repetitive research tasks",
    content:
      "Set up automated workflows to streamline your research process. Learn how to create custom automation rules that handle repetitive tasks efficiently.",
  },
  {
    title: "Web clipping with our Chrome extension",
    subtitle: "How to save and organize web content",
    content:
      "Learn to use our Chrome extension for seamless web content saving and organization. Capture important information from any webpage and integrate it into your workspace.",
  },
]

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col relative transform transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <IoCloseOutline className="text-xl" />
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Learn how to use Destructive AI</h2>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full px-4 py-4 text-left flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
                  </div>
                  <IoChevronDownOutline
                    className={`mt-1 text-gray-500 transform transition-transform duration-200 ${
                      expandedSection === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSection === index && <div className="px-4 pb-4 text-gray-600">{section.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

