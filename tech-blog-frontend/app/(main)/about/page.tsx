'use client';

export default function AboutPage() {
  return (
    <div className="px-10 md:px-16 py-10">

        {/* ╭┈➤ HERO SECTION */}
        <section className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-12">

            <img
            src="/about-bg.jpg" 
            alt="About Tech Blog"
            className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">

            <span className="text-sm text-purple-400 mb-4">
                ABOUT THIS PROJECT
            </span>

            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4">
                Building a Smarter <br />
                Tech News Feed 
            </h1>

            <p className="text-gray-400 text-sm md:text-base">
                A curated platform designed to simplify how you explore <br/>technology,
                trends, and open-source innovations.
            </p>

            </div>
        </section>

        {/* ╭┈➤ ABOUT CONTENT */}
        <section className="max-w-2xl mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-purple-400 mb-4">
            What is Tech Blog?
            </h2>

            <p className="text-gray-400 leading-relaxed mb-4">
            Tech Blog is a modern web platform that that centralizes the latest technology 
            news from multiple reputable sources into a single platform. Sources include the 
            Google Tech Blog, AWS Tech Blog, Microsoft Developer Blog, OpenAI Developer Blog, 
            others and trending open-source repositories from GitHub.
            </p>

            <p className="text-gray-400 leading-relaxed mb-4">
            The goal of this project is to help users stay updated with fast-moving
            technological trends without being overwhelmed by information. By combining
            multiple sources into one streamlined interface, users can quickly discover
            what matters most.
            </p>

            <p className="text-gray-400 leading-relaxed">
            This project also explores modern web development practices, including API
            integration, user authentication systems, and n8n automation flow.
            </p>
        </section>

        {/* ╭┈➤ FEATURES */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2 text-white">
                Curated Content
            </h3>
            <p className="text-gray-400 text-sm">
                Stay updated with relevant tech news without endless scrolling.
            </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2 text-white">
                GitHub Trends
            </h3>
            <p className="text-gray-400 text-sm">
                Discover trending repositories and open-source innovations.
            </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2 text-white">
                Automation
            </h3>
            <p className="text-gray-400 text-sm">
                Built with a focus on clarity, usability, and responsive design.
            </p>
            </div>

        </section>

        {/* ╭┈➤ PROJECT INFO */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/10">

            <h2 className="text-2xl font-heading font-bold mb-4">
            About the Project
            </h2>

            <p className="text-gray-400 mb-4">
            This project was developed as part of a university course assignment.
            </p>

            <div className="space-y-2 text-sm text-gray-300">
            <p><span className="text-gray-400">Course:</span> INFO-653 Web Development III </p>
            <p><span className="text-gray-400">Professor:</span> Prof. Monyrath Buntoun</p>
            <p><span className="text-gray-400">Project:</span> Tech Blog</p>
            </div>

            {/* TEAM */}
            <div className="mt-6">
            <p className="text-gray-400 mb-2">Team Members:</p>
            <ul className="text-gray-300 text-sm space-y-1">
                <li>• Ing Kea Meng</li>
                <li>• Ten Vattana</li>
                <li>• Bong Chan Bormey</li>
                <li>• Oul Kimhak</li>
                <li>• Khun Pungmonyratanak</li>
            </ul>
            </div>

            <p className="text-gray-500 text-xs mt-6 italic">
            Please be kind with the scores, professor.
            </p>

        </section>

    </div>
  )
}