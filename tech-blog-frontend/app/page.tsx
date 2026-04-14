import Image from "next/image"

export default function Home() {
  return (

    <main className="min-h-screen bg-[#0B0F19] text-white">

      {/* ╭┈➤ HEADER */}
      <header className="flex items-center justify-between px-10 md:px-16 py-4 border-b border-white/10">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* need to replace logo later */}
          <span className="text-xl font-bold text-purple-400 font-heading">TECH BLOG</span> 
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-gray-300">
          <a href="#" className="hover:text-white">AI</a>
          <a href="#" className="hover:text-white">Cloud</a>
          <a href="#" className="hover:text-white">Web</a>
          <a href="#" className="hover:text-white">Security</a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search articles..."
            className="hidden md:block px-4 py-2 rounded-full bg-white/10 text-sm focus:outline-none"
          />

          {/* Sign In */}
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
            Sign In
          </button>
        </div>
      </header>

      {/* ╭┈➤ HERO SECTION */}
      <section className="grid md:grid-cols-[1.4fr_1fr] gap-12 px-12 md:px-20 py-16 items-stretch">

        {/* LEFT: Llama Image */}
        <div className="relative w-full h-[600px] md:h-[400px] rounded-2xl overflow-hidden">

          {/* Glow (behind) */}
          <div className="absolute -inset-10 bg-purple-600/30 blur-[120px] opacity-30 z-0"></div>

          {/* Image */}
          <Image
            src="/llama-4.png"
            alt="Featured News"
            fill
            className="object-cover relative z-10"
          />

        </div>

        {/* RIGHT: Content */}
        <div>
          <span className="text-sm bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
            BREAKING NEWS
          </span>

          <p className="text-gray-400 mt-2 text-sm">
            Source: Meta AI
          </p>

          <h1
            className="text-3xl md:text-5xl font-bold leading-[1.15]"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Llama-4: The <br />
            <span className="text-purple-400">Autonomous</span> <br />
            Awakening.
          </h1>
          <p className="text-gray-400 mt-5 text-lg max-w-xl">
            Meta's latest architectural shift introduces self-correcting
            reasoning loops that outperform traditional transformer
            models by 40%. The era of passive AI is over.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600">
              Read More →
            </button>

            <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition">
              Save for Later
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}