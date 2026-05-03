"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  title: string;
  content: string;
  publishedAt?: string;
  category?: { name: string };
}

export default function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    params.then(({ id }) => {
      fetch(`http://localhost:3000/api/posts/${id}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setArticle(data?.data ?? null))
        .finally(() => setLoading(false));
    });
  }, [params, router]);

  if (loading) return null;

  if (!article) {
    return <div className="p-10 text-gray-400">Article not found</div>;
  }

  return (
    <div className="px-10 md:px-20 py-12 max-w-4xl mx-auto">
      <Link href="/articles" className="text-purple-400 text-sm mb-6 inline-block">
        ← Back to Articles
      </Link>

      <h1 className="text-3xl md:text-5xl font-heading mb-4">{article.title}</h1>

      <div className="text-gray-400 text-sm mb-8">
        {article.category?.name}
        {article.category && article.publishedAt && " • "}
        {article.publishedAt &&
          new Date(article.publishedAt).toLocaleDateString()}
      </div>

      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
