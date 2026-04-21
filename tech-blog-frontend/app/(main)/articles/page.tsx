import Link from "next/link"
import NewsList from "../../components/NewsList"

// Featured (Post table)
async function getFeatured() {
    const res = await fetch(
        "http://localhost:3000/api/posts?status=PUBLISHED&limit=6",
        { cache: "no-store" }
    )

    const data = await res.json()
    return data.data.posts || []
}

// Latest News (news_articles_autmation table)
async function getNews() {
    const res = await fetch(
        "http://localhost:3000/api/news-automation",
        { cache: "no-store" }
    )

    const data = await res.json()
    return data.data || []
}

export default async function ArticlesPage() {
    const [featured, news] = await Promise.all([
        getFeatured(),
        getNews(),
    ])

    const shuffledNews = [...news].sort(() => 0.5 - Math.random())


    return (
        <div className="px-10 md:px-16 py-10">

        {/* HEADER */}
        <section className="relative w-full h-[420px] md:h-[520px] rounded-2xl overflow-hidden mb-16">
            <img
            src="/articles-bg.jpg"
            alt="Articles"
            className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/80 to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
            <span className="text-sm text-purple-400 mb-4">
                TECH INSIGHTS & NEWS
            </span>

            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
                Featured Articles<br/> & <span className="text-purple-400">Latest News</span>
            </h1>

            <p className="text-gray-400">
                Explore curated articles and automatically updated tech news from around the web.
            </p>
            </div>
        </section>

        {/* FEATURED ARTICLES */}
        <section className="mb-20">
            <h2 className="text-2xl font-heading font-bold mb-6">Featured Articles</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.map((article: any) => (
                <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10
                            rounded-2xl p-6 flex flex-col justify-between min-h-[240px]
                            hover:scale-[1.02] hover:border-purple-400/30 transition"
                >

                    {/* TOP */}
                    <div>

                        {/* CATEGORY */}
                        <div className="text-xs text-purple-400 mb-2">
                            {article.category?.name || "General"}
                        </div>

                        {/* TITLE */}
                        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {article.title}
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-gray-400 text-sm line-clamp-3">
                            {article.shortDesc}
                        </p>

                        </div>

                        {/* BOTTOM */}
                        <div className="flex items-center justify-between mt-6">

                        {/* DATE */}
                        <span className="text-xs text-gray-500">
                            {article.publishedAt &&
                            new Date(article.publishedAt).toLocaleDateString()}
                        </span>

                        <span className="text-sm text-purple-400">Read →</span>

                    </div>
                </Link>
                ))}
            </div>
        </section>

        {/* LATEST NEWS */}
        <NewsList news={shuffledNews}/>

        </div>
    )
}