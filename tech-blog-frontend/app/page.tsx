import Image from "next/image"
import { ChevronDown } from "lucide-react"

async function getTrendingRepos() {
  const res = await fetch("http://localhost:3000/api/github/trending", {
    cache: "no-store",
  })

  const json = await res.json()
  return json.data
}

export default async function Home() {

  const repos = await getTrendingRepos()

  const featured = repos[0]
  const others = repos.slice(1, 5)

  return (

    <main className="min-h-screen bg-[#0B0F19] text-white">

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


      {/* ╭┈➤ GITHUB REPOS */}
      <section className="px-10 md:px-20 py-20">

        {/* Header */}
        <div className="mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Trending Repositories
          </h2>
          <p className="text-gray-400 text-sm mt-1 tracking-wide">
            THE GITHUB PULSE
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8 ">

          {/* Left: Featured Column */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:-translate-y-1 transition duration-300 cursor-pointer">

            <div className="flex justify-between items-center mb-6">
              <div className="text-purple-400 text-2xl">⚡️</div>
              <span className="text-sm text-gray-300">
                ⭐ {featured.stars.toLocaleString()}
              </span>
            </div>

            <h3 className="text-2xl font-semibold mb-3">
              {featured.name}
            </h3>

            <p className="text-gray-400 mb-6">
              {featured.description}
            </p>

            <div className="flex gap-2 mb-6">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                React
              </span>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                TypeScript
              </span>
            </div>

            <a
              href={featured.url}
              target="_blank"
              className="block text-center bg-purple-500 hover:bg-purple-600 transition py-4 rounded-full font-medium"
            >
              View Repository
            </a>
          </div>

          {/* Right: List Column */}
          <div className="grid grid-cols-2 gap-6">

            {others.map((repo: any, index: number) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-[#0F172A] rounded-2xl p-5 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition cursor-pointer h-[200px] flex flex-col justify-between">

                  <div className="flex justify-between text-xs text-gray-400 mb-3">
                    <span>#{index + 2}</span>
                    <span>⭐ {repo.stars.toLocaleString()}</span>
                  </div>

                  <h4 className="font-semibold mb-2 group-hover:text-purple-400 transition">
                    {repo.name}
                  </h4>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {repo.description}
                  </p>

                  <span className="text-xs text-purple-400">
                    {repo.publishedAt}
                  </span>
                </div>
              </a>
            ))}

          </div>
        </div>

      </section>

    </main>
  )
}