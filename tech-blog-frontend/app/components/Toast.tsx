"use client"

import { XCircle } from "lucide-react"

export default function Toast({
  message,
  onClose,
}: {
  message: string[] | string
  onClose: () => void
}) {
  const messages = Array.isArray(message) ? message : [message]

  return (
    <div className="fixed left-1/2 top-[30%] -translate-x-1/2 z-50 animate-fade-in">

      <div className="flex items-start gap-3 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-4 shadow-xl min-w-[320px]">

        <XCircle className="text-red-400 mt-0.5" size={20} />

        <div className="text-sm text-gray-200">
          <p className="text-red-400 font-medium mb-1">
            Please check your input
          </p>

          {messages.map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-white"
        >
          ✕
        </button>

      </div>
    </div>
  )
}