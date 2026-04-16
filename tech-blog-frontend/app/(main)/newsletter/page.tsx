"use client"

import { useState, useEffect } from "react"

export default function NewsletterPage() {
  const [email, setEmail] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [deliveryTime, setDeliveryTime] = useState("08:00")
  const [message, setMessage] = useState("")

  // Load user email if logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user?.email) setEmail(user.email)
  }, [])

  const toggleTopic = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    )
  }

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setMessage("Please sign in to subscribe.")
        return
      }

      const res = await fetch("http://localhost:3000/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          topics,
          deliveryTime,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setMessage(data.message || "Subscription failed.")
        return
      }

      setMessage("Successfully subscribed!")
    } catch (err) {
      console.error(err)
      setMessage("Something went wrong.")
    }
  }

  const topicOptions = [
    { label: "Artificial Intelligence", value: "ai" },
    { label: "Cloud Computing", value: "cloud" },
    { label: "Web Development", value: "web" },
    { label: "Cyber Security", value: "security" },
    { label: "DevOps", value: "devops" },
    { label: "Data Science", value: "data-science" },
  ]

  return (
    <div className="px-10 md:px-16 py-12 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
            Stay Ahead with <br />
            <span className="text-purple-400">Tech Insights</span>
            </h1>

            <p className="text-gray-400 mb-6 max-w-md">
            Get curated updates on the latest trends in technology<br/> and get it delivered straight to your inbox.
            </p>

            <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
                src="/newsletter-1.png"
                alt="Newsletter"
                className="w-full h-[350px] object-cover"
            />
            </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">

            <h2 className="text-2xl font-heading font-bold mb-6">
            Subscribe to Newsletter
            </h2>

            {/* EMAIL */}
            <div className="mb-5">
            <label className="text-sm text-gray-400 block mb-2">
                Email
            </label>
            <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none"
            />
            </div>

        {/* TOPICS */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Topics</p>

          <div className="grid grid-cols-2 gap-3">
            {topicOptions.map((topic) => (
              <button
                key={topic.value}
                onClick={() => toggleTopic(topic.value)}
                className={`px-4 py-3 rounded-xl text-sm border transition
                  ${
                    topics.includes(topic.value)
                      ? "bg-purple-500/20 border-purple-400 text-purple-300"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* DELIVERY TIME */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 block mb-2">
            Delivery Time
          </label>
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubscribe}
          className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 font-medium hover:opacity-90 transition"
        >
          Subscribe
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}