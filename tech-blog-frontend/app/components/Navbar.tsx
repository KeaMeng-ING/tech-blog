"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useCallback } from "react"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/types"

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/github", label: "Repos" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About Us" },
] as const;

export default function Navbar() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleSearch = useCallback(() => {
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query)}`)
        setQuery("")
    }, [query, router])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }, [handleSearch])

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        } catch (error) {
            console.error("Failed to parse user from storage", error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/login")
    }, [router])

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1120]/70 border-b border-white/10 flex items-center justify-between px-10 md:px-16 py-4">

            {/* Logo */}
            <Link href="/home" className="flex items-center gap-3">
                <Image
                src="/unofficial_logo.png"
                alt="Tech Blog Logo"
                width={140}
                height={140}
                className="h-10 w-auto object-contain"
                />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-8 text-gray-300 items-center">
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-white transition"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm"
                />

                {/* Auth */}
                {loading ? null : user ? (
                    <div className="relative">

                        {/* Profile button */}
                        <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                        >
                        <User size={18} />
                        </button>

                        {/* Dropdown */}
                        {open && (
                            <div className="absolute right-0 mt-3 w-40 bg-[#0F172A] border border-white/10 rounded-xl shadow-lg p-2">

                                <Link
                                href="/logout"
                                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition"
                                >
                                Logout
                                </Link>

                            </div>
                        )}
                    </div>
                    ) : (
                    <Link href="/login">
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition hover:opacity-90">
                        Sign In
                        </button>
                    </Link>
                )}
            </div>
        </header>
    )
}