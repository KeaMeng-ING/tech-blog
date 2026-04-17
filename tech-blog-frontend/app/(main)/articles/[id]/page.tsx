import Link from "next/link"

async function getArticle(id: string) {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.data
}

export default async function ArticleDetail({
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
    <div className="px-10 md:px-20 py-12 max-w-4xl mx-auto">

      {/* BACK */}
      <Link href="/articles" className="text-purple-400 text-sm mb-6 inline-block">
        ← Back to Articles
      </Link>

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-heading mb-4">
        {article.title}
      </h1>

      {/* META */}
      <div className="text-gray-400 text-sm mb-8">
        {article.category?.name}
        {article.category && article.publishedAt && " • "}
        {article.publishedAt &&
          new Date(article.publishedAt).toLocaleDateString()}
      </div>

      {/* CONTENT */}
      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
        {article.content}
      </div>

    </div>
  )
}