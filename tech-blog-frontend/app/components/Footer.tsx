"use client";

import { FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";

const FOOTER_CATEGORIES = [
  "Artificial Intelligence",
  "Cloud Computing",
  "Web Development",
  "Cyber Security",
] as const;

const FOOTER_RESOURCES = [
  "Articles",
  "Newsletter",
  "Github Repos",
  "About Us",
] as const;

const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaGithub, label: "GitHub" },
  { icon: HiOutlineMail, label: "Email" },
] as const;

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
                className="w-27.5 h-auto object-contain"
              />
            </Link>
          </div>

          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Your source for the latest <br />
            technology news and insights.
          </p>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            {FOOTER_CATEGORIES.map((category) => (
              <li
                key={category}
                className="hover:text-purple-400 cursor-pointer transition"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h3 className="font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            {FOOTER_RESOURCES.map((resource) => (
              <li
                key={resource}
                className="hover:text-purple-400 cursor-pointer transition"
              >
                {resource}
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h3 className="font-semibold text-white mb-4">Connect</h3>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-white/5 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition cursor-pointer"
                aria-label={label}
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10 text-center py-6 text-gray-500 text-sm">
        © 2026 Tech Blog. All rights reserved.
      </div>
    </footer>
  );
}
