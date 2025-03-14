"use client"

import type React from "react"

import { useState } from "react"
import { IoCloseOutline } from "react-icons/io5"
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa"
import { MdContentCopy } from "react-icons/md"
import { RiCoupon3Fill } from "react-icons/ri"
import { FaGift } from "react-icons/fa"
import { IoCheckmarkCircle } from "react-icons/io5"

interface ShareAndGetPaidProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareAndGetPaid({ isOpen, onClose }: ShareAndGetPaidProps) {
  const [activeTab, setActiveTab] = useState<"share" | "rewards">("share")
  const [linkCopied, setLinkCopied] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [inviteSent, setInviteSent] = useState(false)

  if (!isOpen) return null

  const shareLink = "https://destructive.ai/invite/u123456"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput) {
      setInviteSent(true)
      setTimeout(() => {
        setInviteSent(false)
        setEmailInput("")
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative bg-purple-500 text-white p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-purple-200">
            <IoCloseOutline className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold">Share & Get Paid</h2>
          <p className="mt-1 text-purple-100">Invite friends and earn rewards</p>

          {/* Tabs */}
          <div className="flex mt-6 bg-purple-600 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "share" ? "bg-white text-purple-600" : "text-white hover:bg-purple-700"
              }`}
              onClick={() => setActiveTab("share")}
            >
              Share
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "rewards" ? "bg-white text-purple-600" : "text-white hover:bg-purple-700"
              }`}
              onClick={() => setActiveTab("rewards")}
            >
              Rewards
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "share" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Share your invite link</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Share this link with friends and you'll both get rewards when they sign up.
                </p>

                <div className="flex items-center">
                  <div className="flex-1 bg-gray-100 rounded-l-lg p-3 text-sm text-gray-600 truncate">{shareLink}</div>
                  <button
                    onClick={handleCopyLink}
                    className={`p-3 rounded-r-lg ${
                      linkCopied ? "bg-green-500 text-white" : "bg-purple-500 text-white"
                    }`}
                  >
                    {linkCopied ? <IoCheckmarkCircle /> : <MdContentCopy />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Share via</h3>
                <div className="grid grid-cols-4 gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent("Check out Destructive AI - an amazing AI assistant!")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter className="text-xl mb-1" />
                    <span className="text-xs">Twitter</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebook className="text-xl mb-1" />
                    <span className="text-xs">Facebook</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <FaLinkedin className="text-xl mb-1" />
                    <span className="text-xs">LinkedIn</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out Destructive AI - an amazing AI assistant! " + shareLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="text-xl mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invite via email</h3>
                <form onSubmit={handleSendInvite} className="flex items-center">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="friend@example.com"
                    className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    className={`py-2 px-4 rounded-r-lg ${inviteSent ? "bg-green-500" : "bg-purple-500"} text-white`}
                  >
                    {inviteSent ? "Sent!" : "Send"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <FaGift className="text-3xl text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Earn while sharing</h3>
                <p className="text-gray-500 mt-2">Invite friends and earn credits for both of you</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-4 text-white">
                <div className="flex items-center mb-2">
                  <RiCoupon3Fill className="text-2xl mr-2" />
                  <h4 className="text-lg font-bold">Your Referral Stats</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm opacity-80">Total Invites</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm opacity-80">Credits Earned</p>
                    <p className="text-2xl font-bold">150</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How it works</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3 mt-0.5">
                      1
                    </div>
                    <p className="text-gray-600">Share your unique invite link with friends</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3 mt-0.5">
                      2
                    </div>
                    <p className="text-gray-600">They sign up using your link</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3 mt-0.5">
                      3
                    </div>
                    <p className="text-gray-600">You both get 50 credits (worth $5)</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Redeem Credits</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Use your credits for premium features or cash out when you reach 500 credits.
                </p>
                <button className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
                  Redeem Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

