import Link from "next/link"

// Note: the search results fetch from news_articles_automation table (or latest news section)
async function getSearchResults(query: string) {
  const res = await fetch(
    `http://localhost:3000/api/news-automation/search?search=${query}`,
    { cache: "no-store" }
  )

  const data = await res.json()
  return data.data || []
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""

  const articles = query ? await getSearchResults(query) : []

  return (
    <div className="px-6 md:px-16 py-12 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-12">
        <span className="text-xs text-purple-400 uppercase tracking-wider">
          Search Results
        </span>

        <h1 className="text-4xl md:text-6xl font-heading mt-2 mb-4">
          Results for{" "}
          <span className="text-purple-400">"{query}"</span>
        </h1>

        <p className="text-gray-400 max-w-2xl">
          Showing relevant articles based on your search query.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-10">
        <div className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-gray-400">
          {query}
        </div>
      </div>

      {/* RESULTS */}
      <div className="space-y-6">

        {articles.length === 0 ? (
          <p className="text-gray-400">No results found.</p>
        ) : (
          articles.map((article: any) => (
            <div
              key={article.id}
              className="flex gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 
                         hover:border-purple-400/30 transition"
            >

              {/* IMAGE */}
              <div className="w-[180px] h-[120px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                <img
                  src={article.thumbnailUrl || "/news-placeholder.jpg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="flex flex-col justify-between flex-1">

                {/* META */}
                <div className="text-xs text-gray-400 mb-1">
                  {article.publishedAt &&
                    new Date(article.publishedAt).toLocaleDateString()}{" "}
                  • {article.category?.name || "General"}
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold text-white mb-2">
                  {article.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-gray-400 text-sm line-clamp-2">
                  {article.shortDesc || article.content}
                </p>

                {/* ACTION */}
                <Link
                  href={`/news/${article.id}`}
                  className="mt-3 text-sm text-purple-400 hover:underline"
                >
                  Read Full Insight →
                </Link>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  )
}