"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import Head from "next/head"
import { useChat } from "@ai-sdk/react"
import { IoArrowUpOutline, IoAttachOutline, IoSearchOutline } from "react-icons/io5"
import { FaWandMagicSparkles } from "react-icons/fa6"
import { IoHomeOutline } from "react-icons/io5"
import { BiLibrary } from "react-icons/bi"
import { MdOutlineWork } from "react-icons/md"
import { IoInformationCircleOutline } from "react-icons/io5"
import { MdSettingsApplications } from "react-icons/md"
import { MdSupport } from "react-icons/md"
import { IoShareSocialOutline } from "react-icons/io5"
import { RiSparklingLine } from "react-icons/ri"
import { BsThreeDots } from "react-icons/bs"
import { IoCloseOutline } from "react-icons/io5"
import ReactMarkdown from "react-markdown"
import { HowToUseModal } from "./components/how-to-use-modal"
import { SettingsModal } from "./components/settings-modal"
import { SupportChat } from "./components/support-chat"
import { ShareAndGetPaid } from "./components/share-and-get-paid"
import { Library } from "./components/library"
import { WorkflowModal } from "./components/workflow-modal"

interface Annotation {
  sources?: { url: string; title?: string }[] // Define the structure of sources
}

interface Message {
  id: string
  role: string
  content: string
  annotations?: Annotation // Use the defined interface
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [upgradeModalAnimation, setUpgradeModalAnimation] = useState("")
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false)
  const [workflowContent, setWorkflowContent] = useState("")

  useEffect(() => {
    // Check if screen is mobile size
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    // Initial check
    checkMobileView()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobileView)
  }, [])

  useEffect(() => {
    // Update typing indicator based on loading state
    setIsTyping(isLoading)

    // Scroll to the bottom when messages change, only if user is at the bottom
    if (messagesEndRef.current) {
      const isAtBottom = messagesEndRef.current.getBoundingClientRect().bottom <= window.innerHeight
      if (isAtBottom) {
        ;(messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [messages, isLoading])

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleButtonClick = (action: string) => {
    if (action === "Rewrite") {
      // Logic to pass the previous query to the LLM
      handleInputChange({ target: { value: input } } as React.ChangeEvent<HTMLInputElement>)
      const submitEvent = new Event("submit", { bubbles: true })
      document.querySelector("form")?.dispatchEvent(submitEvent)
    } else if (action === "Take Notes") {
      // Logic to download the previous query and response as a text file
      // Find the last user message (query) and the last assistant message (response)
      let userMessage = ""
      let assistantMessage = ""

      // Loop from the end to find the last user and assistant messages
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user" && !userMessage) {
          userMessage = messages[i].content
        }
        if (messages[i].role === "assistant" && !assistantMessage) {
          assistantMessage = messages[i].content
        }
        if (userMessage && assistantMessage) break // Stop once we have both
      }

      // Create content with both the query and response
      const notesContent = `Query: ${userMessage}

Response: ${assistantMessage}`

      // Create and download the file
      const blob = new Blob([notesContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "notes.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (action === "Create Workflow") {
      // Find the last assistant message to use as initial content
      let assistantMessage = ""
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant") {
          assistantMessage = messages[i].content
          break
        }
      }
      setWorkflowContent(assistantMessage)
      setIsWorkflowOpen(true)
    } else {
      // For action buttons like Research, Brainstorm, etc.
      // Set the input value and immediately submit
      handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLInputElement>)

      // Immediately submit the form after setting the input
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
      }, 0)
    }
  }

  // Function to open the upgrade modal with animation
  const openUpgradeModal = () => {
    setIsUpgradeModalOpen(true)
    setTimeout(() => {
      setUpgradeModalAnimation("translate-y-0 opacity-100")
    }, 10)
  }

  // Function to close the upgrade modal with animation
  const closeUpgradeModal = () => {
    setUpgradeModalAnimation("translate-y-4 opacity-0")
    setTimeout(() => {
      setIsUpgradeModalOpen(false)
    }, 300)
  }

  // Toggle support chat
  const toggleSupportChat = () => {
    setIsSupportChatOpen(!isSupportChatOpen)
  }

  // Toggle library
  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen)
  }

  // Toggle workflow
  const toggleWorkflow = () => {
    setIsWorkflowOpen(!isWorkflowOpen)
  }

  // Mobile View Layout
  if (isMobileView) {
    return (
      <>
        <Head>
          <style>{`
            .toggle-checkbox:checked {
              right: 0;
              border-color: #805AD5;
            }
            .toggle-checkbox:checked + .toggle-label {
              background-color: #805AD5;
            }
          `}</style>
        </Head>
        <div className="flex flex-col h-screen bg-gray-50">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    What can I help you with, Rasheq?
                  </h1>

                  <div className="flex items-center justify-between w-full mb-2 px-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1">1/10 monthly credits used</span>
                    </div>
                    <button
                      className="flex items-center justify-center py-1 px-4 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:text-white"
                      onClick={openUpgradeModal}
                    >
                      <RiSparklingLine className="mr-1" />
                      Upgrade
                    </button>
                  </div>

                  <div className="w-full mb-2 px-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-purple-500 h-1 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm w-full mb-4 p-3">
                    <div className="flex mb-2">
                      <button className="flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-sm mr-1">
                        <span className="inline-block w-5 h-5 mr-1 bg-green-500 rounded-md flex items-center justify-center text-white text-xs">
                          G
                        </span>
                        GPT-4o Mini
                      </button>
                      <button className="flex-1 flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-sm ml-1">
                        <span className="inline-block w-5 h-5 mr-1 bg-black rounded-md flex items-center justify-center text-white text-xs">
                          A
                        </span>
                        Auto-detect
                      </button>
                    </div>

                    <div className="text-gray-600 mb-2 text-center">Chat with Videos</div>

                    <form className="flex items-center mb-2 gap-1">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center py-2 px-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <IoAttachOutline className="mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Attach</span>
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center py-2 px-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <IoSearchOutline className="mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Search</span>
                      </button>
                      <button
                        type="button"
                        className="w-10 flex items-center justify-center py-2 px-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <RiSparklingLine />
                      </button>
                    </form>

                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Message Idea Generation Engine..."
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    />

                    <button type="button" className="p-2 text-gray-500 absolute right-8 bottom-28">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full px-2">
                    <button
                      className="flex-1 min-w-[45%] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                      onClick={() => handleButtonClick("Research")}
                    >
                      <IoSearchOutline className="mr-1 flex-shrink-0" />
                      <span className="truncate">Research</span>
                    </button>
                    <button
                      className="flex-1 min-w-[45%] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                      onClick={() => handleButtonClick("Brainstorm")}
                    >
                      <FaWandMagicSparkles className="mr-1 flex-shrink-0" />
                      <span className="truncate">Brainstorm</span>
                    </button>
                    <button
                      className="flex-1 min-w-[45%] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                      onClick={() => handleButtonClick("Summarize")}
                    >
                      <IoSearchOutline className="mr-1 flex-shrink-0" />
                      <span className="truncate">Summarize</span>
                    </button>
                    <button
                      className="flex-1 min-w-[45%] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                      onClick={() => handleButtonClick("Create Workflow")}
                    >
                      <MdOutlineWork className="mr-1 flex-shrink-0" />
                      <span className="truncate">Create Workflow</span>
                    </button>
                  </div>

                  <button
                    className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-full text-sm mt-2"
                    onClick={openUpgradeModal}
                  >
                    More
                  </button>

                  <div className="mt-auto px-2 py-4 w-full text-xs text-gray-400 text-center fixed bottom-12 left-0 right-0">
                    Idea generation Engine can make mistakes. Consider checking important information.
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-lg ${
                          message.role === "user" ? "bg-purple-500 text-white" : "bg-white border border-gray-200"
                        }`}
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="break-words" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-3/4 p-4 rounded-lg bg-white border border-gray-200">
                        <div className="flex space-x-2">
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
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                      onClick={() => handleButtonClick("Rewrite")}
                    >
                      <IoArrowUpOutline className="mr-1" />
                      Rewrite
                    </button>
                    <button
                      className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                      onClick={() => handleButtonClick("Take Notes")}
                    >
                      <IoShareSocialOutline className="mr-1" />
                      Take Notes
                    </button>
                    <button
                      className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                      onClick={() => handleButtonClick("Create Workflow")}
                    >
                      <MdOutlineWork className="mr-1" />
                      Workflow
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Only show when there are messages */}
            {messages.length > 0 && (
              <div className="bg-white p-4 border-t border-gray-200">
                <form onSubmit={onSubmit} className="flex items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Message Idea Generation Engine..."
                      className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <IoAttachOutline />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className={`ml-2 bg-purple-500 text-white rounded-full p-3 transition-opacity duration-300 ${input ? "opacity-100" : "opacity-50"}`}
                    disabled={!input.trim()}
                  >
                    <IoArrowUpOutline />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-gray-200 py-2 px-4 flex justify-around">
            <button className="flex flex-col items-center justify-center text-purple-500">
              <IoHomeOutline className="text-xl" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center text-gray-500" onClick={toggleLibrary}>
              <BiLibrary className="text-xl" />
              <span className="text-xs mt-1">Library</span>
            </button>
            <button className="flex flex-col items-center justify-center text-gray-500" onClick={toggleWorkflow}>
              <MdOutlineWork className="text-xl" />
              <span className="text-xs mt-1">Workflow</span>
            </button>
            <button className="flex flex-col items-center justify-center text-gray-500" onClick={toggleSupportChat}>
              <MdSupport className="text-xl" />
              <span className="text-xs mt-1">Support</span>
            </button>
          </div>
        </div>
        <HowToUseModal isOpen={isHowToUseModalOpen} onClose={() => setIsHowToUseModalOpen(false)} />
        <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />
        <ShareAndGetPaid isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
        <Library isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        <WorkflowModal
          isOpen={isWorkflowOpen}
          onClose={() => setIsWorkflowOpen(false)}
          initialContent={workflowContent}
        />
      </>
    )
  }

  // Desktop Layout (Original)
  return (
    <>
      <Head>
        <style>{`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #805AD5;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #805AD5;
          }
        `}</style>
      </Head>
      <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          <div className="mb-6">
            <button className="w-full bg-purple-500 text-white rounded-full py-2 px-4 flex items-center justify-center">
              <span className="mr-2">+</span> Add
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md">
                  <IoHomeOutline className="mr-3" />
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleLibrary()
                  }}
                >
                  <BiLibrary className="mr-3" />
                  Library
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleWorkflow()
                  }}
                >
                  <MdOutlineWork className="mr-3" />
                  Workflows
                </a>
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsHowToUseModalOpen(true)
                  }}
                >
                  <IoInformationCircleOutline className="mr-3" />
                  How to use 
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsSettingsModalOpen(true)
                  }}
                >
                  <MdSettingsApplications className="mr-3" />
                  AI settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleSupportChat()
                  }}
                >
                  <MdSupport className="mr-3" />
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsShareModalOpen(true)
                  }}
                >
                  <IoShareSocialOutline className="mr-3" />
                  Share & get paid
                </a>
              </li>
              <li className="px-4 py-2 text-xs text-gray-500">
                1/10 monthly credits used
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-purple-500 h-1 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </li>
              <li>
                <button
                  className="w-full flex items-center justify-center py-2 px-6 text-lg bg-purple-500 text-white rounded-full hover:bg-purple-600"
                  onClick={openUpgradeModal}
                >
                  <RiSparklingLine className="mr-2" />
                  Upgrade
                </button>
              </li>
            </ul>

            <div className="flex items-center mt-4 pt-4 border-t">
              <div className="w-6 h-6 rounded-md bg-gray-700 flex items-center justify-center text-white text-xs">
                R
              </div>
              <span className="ml-2 text-sm">Rasheq...</span>
              <div className="ml-auto flex">
                <IoCloseOutline className="text-gray-500 mx-1" />
                <BsThreeDots className="text-gray-500 mx-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
            <div></div>
            <button
              className="py-2 px-6 text-lg bg-purple-500 text-white rounded-full flex items-center hover:bg-purple-600"
              onClick={openUpgradeModal}
            >
              <RiSparklingLine className="mr-1" />
              Upgrade
            </button>
          </header>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-12">What can I help you with, Rasheq?</h1>

                <div className="bg-white rounded-lg shadow-sm w-full max-w-2xl p-2 mb-6">
                  <div className="text-gray-600 mb-4 text-center">
                    Chat with <span className="font-bold text-purple-500 animate-pulse">Idea Generation Engine</span>
                  </div>

                  <form onSubmit={onSubmit} className="flex flex-col md:flex-row space-x-0 md:space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Message Idea Generation Engine..."
                      className="flex-1 border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      className="flex items-center py-1 px-4 border border-gray-300 rounded-full text-sm mt-2 md:mt-0 hover:bg-purple-500 hover:text-white"
                    >
                      <IoAttachOutline className="mr-2" />
                      Attach
                    </button>
                    <button
                      type="submit"
                      className={`ml-2 bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center transition-opacity duration-300 ${input ? "opacity-100" : "opacity-50"}`}
                    >
                      <IoArrowUpOutline />
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-3 w-full max-w-2xl">
                  <button
                    className="flex-1 min-w-[calc(25%-12px)] md:min-w-[calc(25%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Research")}
                  >
                    <IoSearchOutline className="mr-1 flex-shrink-0" />
                    <span className="truncate">Research</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(25%-12px)] md:min-w-[calc(25%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Brainstorm")}
                  >
                    <FaWandMagicSparkles className="mr-1 flex-shrink-0" />
                    <span className="truncate">Brainstorm</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(25%-12px)] md:min-w-[calc(25%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Summarize")}
                  >
                    <IoSearchOutline className="mr-1 flex-shrink-0" />
                    <span className="truncate">Summarize</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(25%-12px)] md:min-w-[calc(25%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Create Workflow")}
                  >
                    <MdOutlineWork className="mr-1 flex-shrink-0" />
                    <span className="truncate">Create Workflow</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(33.333%-12px)] md:min-w-[calc(33.333%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Help me write")}
                  >
                    <IoSearchOutline className="mr-1 flex-shrink-0" />
                    <span className="truncate">Help me write</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(33.333%-12px)] md:min-w-[calc(33.333%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Code")}
                  >
                    <IoSearchOutline className="mr-1 flex-shrink-0" />
                    <span className="truncate">Code</span>
                  </button>
                  <button
                    className="flex-1 min-w-[calc(33.333%-12px)] md:min-w-[calc(33.333%-12px)] flex items-center justify-center py-2 px-3 border border-gray-300 rounded-full text-sm hover:bg-purple-500 hover:text-white"
                    onClick={() => handleButtonClick("Latest Discoveries")}
                  >
                    <IoSearchOutline className="mr-1 flex-shrink-0" />
                    <span className="truncate">Latest Discoveries</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex flex-col">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-lg ${
                        message.role === "user" ? "bg-purple-500 text-white" : "bg-white border border-gray-200"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="break-words" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-3/4 p-4 rounded-lg bg-white border border-gray-200">
                      <div className="flex space-x-2">
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
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleButtonClick("Rewrite")}
                  >
                    <IoArrowUpOutline className="mr-1" />
                    Rewrite
                  </button>
                  <button
                    className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleButtonClick("Take Notes")}
                  >
                    <IoShareSocialOutline className="mr-1" />
                    Take Notes
                  </button>
                  <button
                    className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                    onClick={() => handleButtonClick("Create Workflow")}
                  >
                    <MdOutlineWork className="mr-1" />
                    Create Workflow
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Only show when there are messages */}
          {messages.length > 0 && (
            <div className="bg-white p-4 border-t border-gray-200">
              <form onSubmit={onSubmit} className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Message Idea Generation Engine..."
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <IoAttachOutline />
                  </button>
                </div>
                <button
                  type="submit"
                  className={`ml-2 bg-purple-500 text-white rounded-full p-3 transition-opacity duration-300 ${input ? "opacity-100" : "opacity-50"}`}
                  disabled={!input.trim()}
                >
                  <IoArrowUpOutline />
                </button>
              </form>
              <div className="mt-2 text-xs text-gray-400 text-center">
                Idea Generation Engine can make mistakes. Consider checking important information.
              </div>
            </div>
          )}
        </div>
      </div>
      <HowToUseModal isOpen={isHowToUseModalOpen} onClose={() => setIsHowToUseModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <SupportChat isOpen={isSupportChatOpen} onClose={() => setIsSupportChatOpen(false)} />
      <ShareAndGetPaid isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <Library isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
      <WorkflowModal
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        initialContent={workflowContent}
      />
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div
            className={`bg-white rounded-xl max-w-md w-full p-6 relative transform transition-all duration-300 ${upgradeModalAnimation} translate-y-4 opacity-0`}
          >
            <button onClick={closeUpgradeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <IoCloseOutline className="text-xl" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <RiSparklingLine className="text-3xl text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upgrade to Pro</h3>
              <p className="text-gray-500 mt-2">Get unlimited access to all premium features</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Unlimited messages</p>
                  <p className="text-sm text-gray-500">Chat as much as you want</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Priority access</p>
                  <p className="text-sm text-gray-500">No waiting during peak times</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Advanced features</p>
                  <p className="text-sm text-gray-500">Access to all premium tools</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold">Monthly</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle-desktop"
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="toggle-desktop"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <span className="text-sm font-bold">
                  Yearly <span className="text-green-500">-20%</span>
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200">
              Upgrade Now
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">Cancel anytime. No questions asked.</p>
          </div>
        </div>
      )}
    </>
  )
}

