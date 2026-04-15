"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import Toast from "../../components/Toast"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const [error, setError] = useState("")
    const [error, setError] = useState<string | string[]>("")

    const handleLogin = async () => {
        try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!data.success) {
            setError(data.message)
            return
        }

        // Save auth
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))

        // Redirect to home page
        router.push("/")
        } catch (err) {
        console.error(err)
        alert("Login failed")
        }
    }

    return (
        <>
        {error && (
            <Toast message={error} onClose={() => setError("")} />
        )}
        
        <div className="min-h-screen grid md:grid-cols-2 bg-[#0B1120] text-white">

            {/* LEFT */}
            <div className="relative hidden md:flex items-center justify-center px-16 overflow-hidden">

                {/* Background image */}
                <div className="absolute inset-0">
                <img
                    src="/login-bg.jpg" 
                    className="w-full h-full object-cover opacity-20"
                />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 bg-indigo-600/20 blur-3xl opacity-30"></div>

                {/* Content */}
                <div className="relative z-10 max-w-md">
                <h1
                    className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6"
                    style={{ fontFamily: "var(--font-space)" }}
                >
                    Welcome Back<br />to Tech Blog!
                </h1>

                <p className="text-gray-400 text-lg">
                    Continue exploring insights, trends, and innovations.
                </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-center px-8 md:px-16">

                <div className="w-full max-w-md">

                    <h2
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ fontFamily: "var(--font-space)" }}
                    >
                        Sign In
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Access your personalized tech news feed
                    </p>

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
                        onClick={handleLogin}
                        className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition duration-300 hover:opacity-90 hover:-translate-y-0.5 font-medium text-black"
                    >
                        Sign In
                    </button>


                    {/* REGISTER LINK */}
                    <p className="text-gray-400 text-sm mt-6 text-center">
                        Don’t have an account?{" "}
                        <Link href="/register" className="text-purple-400 hover:underline">
                        Register Here
                        </Link>
                    </p>

                </div>
            </div>
        </div></>
  )
}