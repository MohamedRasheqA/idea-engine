"use client"

import type React from "react"

import { useState } from "react"
import { IoCloseOutline } from "react-icons/io5"
import { BiUser } from "react-icons/bi"
import { BsCreditCard, BsPalette } from "react-icons/bs"
import { MdOutlineSettings } from "react-icons/md"
import { HiOutlineDatabase } from "react-icons/hi"
import { FaGoogle } from "react-icons/fa"
import { RiSparklingLine } from "react-icons/ri"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  userName?: string
}

type Tab = "Account" | "Billing" | "Personalization" | "Appearance" | "Data"

export function SettingsModal({
  isOpen,
  onClose,
  userEmail = "rasheq@klmsolutions.in",
  userName = "Rasheq Mohamed",
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Account")
  const [aiModel, setAiModel] = useState("GPT-4o Mini")
  const [language, setLanguage] = useState("Auto-detect")
  const [customInstructions, setCustomInstructions] = useState("")
  const [responsePreferences, setResponsePreferences] = useState("")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [upgradeModalAnimation, setUpgradeModalAnimation] = useState("")

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

  if (!isOpen) return null

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "Account", icon: <BiUser className="w-5 h-5" />, label: "Account" },
    { id: "Billing", icon: <BsCreditCard className="w-5 h-5" />, label: "Billing" },
    { id: "Personalization", icon: <MdOutlineSettings className="w-5 h-5" />, label: "Personalization" },
    { id: "Appearance", icon: <BsPalette className="w-5 h-5" />, label: "Appearance" },
    { id: "Data", icon: <HiOutlineDatabase className="w-5 h-5" />, label: "Data" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "Account":
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-semibold">{userName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
                <p className="text-gray-500">{userEmail}</p>
              </div>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Log out</button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Connected Apps</h3>
              <p className="text-sm text-gray-500 mb-4">Connected apps will be used to access your information.</p>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FaGoogle className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Google Drive</h4>
                    <p className="text-sm text-gray-500">
                      Import Google Docs, Sheets, Slides and other supported files.
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Connect</button>
              </div>
            </div>
          </div>
        )

      case "Billing":
        return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-gray-500">Coming Soon</p>
            <button
              onClick={openUpgradeModal}
              className="py-2 px-6 bg-purple-500 text-white rounded-full flex items-center hover:bg-purple-600"
            >
              <RiSparklingLine className="mr-2" />
              Upgrade to Pro
            </button>
          </div>
        )

      case "Personalization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Choose your AI model</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a default base model to be used across chat & notes</p>
              <div className="relative">
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full p-3 border rounded-lg appearance-none bg-white pr-10"
                >
                  <option>GPT-4o Mini</option>
                  <option>GPT-4</option>
                  <option>GPT-3.5</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">AI response language</h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose the language you want AI to respond in chat and link summaries.
              </p>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border rounded-lg appearance-none bg-white pr-10"
                >
                  <option>Auto-detect</option>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">Custom instructions</h3>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">23</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                What would you like AI to know about you to provide better responses?
              </p>
              <div className="relative">
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Enter your instructions here..."
                  className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                  maxLength={1500}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">{customInstructions.length}/1500</div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">How would you like AI to respond?</h3>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">23</span>
              </div>
              <div className="relative">
                <textarea
                  value={responsePreferences}
                  onChange={(e) => setResponsePreferences(e.target.value)}
                  placeholder="Enter your instructions here..."
                  className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
                  maxLength={1500}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">{responsePreferences.length}/1500</div>
              </div>
            </div>
          </div>
        )

      case "Appearance":
        return (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Theme</h3>
            <p className="text-sm text-gray-500 mb-4">Customise the appearance of AI</p>

            <div className="grid grid-cols-3 gap-4">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={(e) => setTheme("light")}
                  className="sr-only"
                />
                <div
                  className={`border-2 rounded-lg p-2 ${theme === "light" ? "border-purple-500" : "border-gray-200"}`}
                >
                  <div className="bg-white border rounded-lg p-4 space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <p className="mt-2 text-sm text-center font-bold">Light Mode</p>
                </div>
                {theme === "light" && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={(e) => setTheme("dark")}
                  className="sr-only"
                />
                <div
                  className={`border-2 rounded-lg p-2 ${theme === "dark" ? "border-purple-500" : "border-gray-200"}`}
                >
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <p className="mt-2 text-sm text-center font-bold">Dark Mode</p>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={theme === "system"}
                  onChange={(e) => setTheme("system")}
                  className="sr-only"
                />
                <div
                  className={`border-2 rounded-lg p-2 ${theme === "system" ? "border-purple-500" : "border-gray-200"}`}
                >
                  <div className="bg-gradient-to-r from-white to-gray-900 border rounded-lg p-4 space-y-2">
                    <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-400 rounded w-1/2"></div>
                  </div>
                  <p className="mt-2 text-sm text-center font-bold">System Preference</p>
                </div>
              </label>
            </div>
          </div>
        )

      case "Data":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Chat Histories</h3>
              <p className="text-sm text-gray-500 mb-4">Remove all your chat history data</p>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Delete Chat Histories
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Account</h3>
              <p className="text-sm text-gray-500 mb-4">Permanently delete your account and associated data</p>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        )
    }
  }

  // Upgrade Modal
  const renderUpgradeModal = () => {
    if (!isUpgradeModalOpen) return null

    return (
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-all duration-300">
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
                  id="upgrade-toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="upgrade-toggle"
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
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left ${
                    activeTab === tab.id ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
          </div>
        </div>
      </div>
      {renderUpgradeModal()}
    </>
  )
}

