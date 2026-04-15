"use client"

import { FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa"
import { HiOutlineMail } from "react-icons/hi"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
    return (
        <footer className="bg-[#0B1120] text-gray-400 mt border-t border-white/10">

        <div className="max-w-7xl mx-auto px-10 md:px-16 py-16 grid md:grid-cols-4 gap-10">

            {/* LEFT */}
            <div>
            <div className="mb-4">
                <Link href="/" className="flex items-center gap-3">
                <Image
                    src="/unofficial_logo.png"
                    alt="Tech Blog Logo"
                    width={110}
                    height={110}
                    className="object-contain"
                />
                </Link>
            </div>

            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Your source for the latest <br/>technology news and insights.
            </p>
            </div>

            {/* CATEGORIES */}
            <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
                <li className="hover:text-purple-400 cursor-pointer transition">Artificial Intelligence</li>
                <li className="hover:text-purple-400 cursor-pointer transition">Cloud Computing</li>
                <li className="hover:text-purple-400 cursor-pointer transition">Web Development</li>
                <li className="hover:text-purple-400 cursor-pointer transition">Cyber Security</li>
            </ul>
            </div>

            {/* RESOURCES */}
            <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
                <li className="hover:text-purple-400 cursor-pointer transition">Articles</li>
                <li className="hover:text-purple-400 cursor-pointer transition">Newsletter</li>
                <li className="hover:text-purple-400 cursor-pointer transition">Github Repos</li>
                <li className="hover:text-purple-400 cursor-pointer transition">About Us</li>
            </ul>
            </div>

            {/* CONNECT */}
            <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>

            <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-white/5 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition cursor-pointer">
                <FaFacebookF size={18} />
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition cursor-pointer">
                <FaInstagram size={18} />
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition cursor-pointer">
                <FaGithub size={18} />
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition cursor-pointer">
                <HiOutlineMail size={18} />
                </div>
            </div>
            </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 text-center py-6 text-gray-500 text-sm">
            © 2026 Tech Blog. All rights reserved.
        </div>

        </footer>
    )
}