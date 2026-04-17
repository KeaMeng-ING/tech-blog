"use client"

import { useState } from "react"
import Link from "next/link"

export default function NewsList({ news }: { news: any[] }) {
    const [visible, setVisible] = useState(6)

    const handleLoadMore = () => {
        setVisible((prev) => prev + 6)
}

return (
    <section>
        <h2 className="text-2xl font-heading font-bold mb-6">Latest News</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, visible).map((article: any) => (
            <div
                key={article.id}
                className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 
                        rounded-2xl overflow-hidden flex flex-col
                        hover:scale-[1.02] hover:border-blue-400/30 transition"
            >

                {/* IMAGE */}
                <img
                src={article.image || "/news-placeholder.jpg"}
                alt={article.title}
                className="w-full h-[160px] object-cover"
                />

                <div className="p-5 flex flex-col justify-between flex-1">

                {/* META */}
                <div className="text-xs text-gray-400 mb-2">
                    {article.source}
                    {article.source && article.date && " • "}
                    {article.date &&
                    new Date(article.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                </h2>

                {/* PREVIEW */}
                <p className="text-gray-400 text-sm line-clamp-3">
                    {article.content
                    ?.replace(/<[^>]+>/g, "")
                    .slice(0, 100)}
                    ...
                </p>

                {/* BUTTON */}
                <Link
                    href={`/news/${article.id}`}
                    className="mt-5 text-sm text-blue-400 hover:underline"
                >
                    Read →
                </Link>
                </div>
            </div>
            ))}
        </div>

        {/* LOAD MORE BUTTON */}
        {visible < news.length && (
            <div className="flex justify-center mt-12">
            <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 
                        text-white text-sm font-medium 
                        rounded-md transition"
            >
                Load More
            </button>
            </div>
        )}
    </section>
  )
}