import Link from "next/link"

async function getArticle(id: string) {
    const res = await fetch(`http://localhost:3000/api/news-automation/${id}`, {
        cache: "no-store",
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.data
    }

export default async function NewsDetail({
    params,
}: {
    params: Promise<{ id: string }>
    }) {
    const { id } = await params
    const article = await getArticle(id)

    if (!article) {
        return <div className="p-10 text-gray-400">Article not found</div>
    }

return (
    <div>

        {/* HERO HEADER */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">

            {/* IMAGE */}
            <img
            src={article.image || "/news-placeholder.jpg"}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent" />

            {/* TEXT */}
            <div className="relative z-10 h-full flex flex-col justify-end px-10 md:px-20 pb-10 max-w-4xl">

            <h1 className="text-3xl md:text-5xl font-heading mb-4">
                {article.title}
            </h1>

            <div className="text-gray-300 text-sm">
                {article.source}
                {article.source && article.date && " • "}
                {article.date &&
                new Date(article.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
                {article.author && ` • ${article.author}`}
            </div>

            </div>
        </section>

        {/* CONTENT */}
        <div className="px-10 md:px-10 py-12 max-w-4xl mx-auto">

            {/* BACK */}
            <Link href="/articles" className="text-blue-400 text-sm mb-6 inline-block">
            ← Back to Articles
            </Link>

            {/* CONTENT */}
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {article.content}
            </div>

            {/* ORIGINAL LINK */}
            {article.link && (
            <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block text-blue-400 text-sm hover:underline"
            >
                Read original source →
            </a>
            )}

        </div>

    </div>
  )
}