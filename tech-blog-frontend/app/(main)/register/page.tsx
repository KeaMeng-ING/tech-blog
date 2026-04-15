"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User } from "lucide-react"
import Toast from "../../components/Toast"

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | string[]>("")

    const handleRegister = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (!data.success) {
                setError(data.message)
                return
        }

        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))

        router.push("/")
    }   catch (err) {
        console.error(err)
        alert("Something went wrong")
    }
}

return (
    <>
    {error && (
        <Toast message={error} onClose={() => setError("")} />
    )}
    
    <div className="min-h-screen grid md:grid-cols-2 bg-[#0B1120] text-white">

        {/* LEFT Column */}
        <div className="relative hidden md:flex items-center justify-center px-10 overflow-hidden">

            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="/robot-hand.png" 
                    className="w-full h-full object-cover opacity-20"
                />
            </div>

            {/* Glow overlay, purple-ish hue */}
            <div className="absolute inset-0 bg-purple-600/20 blur-3xl opacity-30"></div>

            {/* Content */}
            <div className="relative z-10 max-w-md">
                <h1
                    className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6"
                    style={{ fontFamily: "var(--font-space)" }}
                >
                    Curated Tech News: <br />
                    Explore Tech Blog
                </h1>

                <p className="text-gray-400 text-lg">
                    Stay ahead with the latest insights across Artificial Intelligence, Cloud Computing, and many more.
                </p>
            </div>
        </div>

        {/* RIGHT Column */}
        <div className="flex items-center justify-center px-8 md:px-16">

            <div className="w-full max-w-md">
                <h2
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-space)" }}
                >
                    Create Account
                </h2>

                <p className="text-gray-400 mb-8">
                    Join us now and personalize your tech news feed.
                </p>

                {/* NAME */}
                <div className="flex items-center border-b border-white/20 mb-5 focus-within:border-purple-500 transition">
                    <User size={18} className="text-gray-400 mr-3" />
                    <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-transparent py-3 focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* EMAIL */}
                <div className="flex items-center border-b border-white/20 mb-5 focus-within:border-purple-500 transition">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full bg-transparent py-3 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* PASSWORD */}
                <div className="flex items-center border-b border-white/20 mb-8 focus-within:border-purple-500 transition">
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent py-3 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleRegister}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 hover:opacity-90 transition font-medium text-black"
                >
                    Register Now
                </button>

                {/* Login Link -> /login */}
                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-400 hover:underline">
                    Sign in
                    </Link>
                </p>

            </div>
        </div>
    </div></>
  )
}