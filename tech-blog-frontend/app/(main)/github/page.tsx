import Link from "next/link"

async function getTrendingRepos() {
    const res = await fetch("http://localhost:3000/api/github/trending", {
        cache: "no-store",
    })

    const json = await res.json()
    return json.data
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}


export default async function ReposPage() {
    const repos = await getTrendingRepos()

    return (
        <div className="px-10 md:px-16 py-10">

        {/* ╭┈➤ HERO SECTION */}
        <section className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-12">

            {/* Background Image */}
            <img
                src="/programming-bg.jpg" 
                alt="GitHub Repos Programming Image Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">

                {/* Tag */}
                <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                    TRENDING
                </span>
                <span className="text-sm text-gray-400">
                    GITHUB REPOSITORIES
                </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4">
                Open Source <br />
                <span className="text-purple-400">Intelligence</span>
                </h1>

                {/* Description */}
                <p className="text-gray-400 max-w-xl text-sm md:text-base">
                Explore the most impactful and trending repositories shaping<br/> 
                the future of development. Discover tools, frameworks, <br/> 
                and innovations from the global open-source community.
                </p>

            </div>
        </section>

        {/* ╭┈➤ REPOS GRID */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {repos.map((repo: any, index: number) => (
            <div
            key={index}
            className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[260px] hover:scale-[1.02] hover:border-purple-400/30 transition"
            >

            {/* TOP */}
            <div>

                <div className="flex justify-between items-start mb-4">

                {/* GitHub Icon */}
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center 
                    hover:bg-purple-500/20 hover:scale-105 
                    hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]
                    transition duration-300">

                    <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    className="w-5 h-5 invert brightness-200"
                    />
                </div>

                {/* Stars + Date */}
                <div className="text-right text-xs text-gray-400">
                    <div>⭐ {repo.stars}</div>
                    <div className="mt-1 text-gray-500">
                    {formatDate(repo.publishedAt)}
                    </div>
                </div>

                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                {repo.name}
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-sm line-clamp-3">
                {repo.description || "No description available."}
                </p>

            </div>

            {/* BUTTON */}
            <Link
                href={repo.url}
                target="_blank"
                className="mt-6 block text-center py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-sm font-medium hover:opacity-90 transition"
            >
                View Repository →
            </Link>

            </div>
        ))}

        </section>
    </div>    
    )
}