import { prisma } from "../config/prisma.js";

export const getTrendingRepos = async () => {
  const repos = await prisma.news_articles_automation.findMany({
    where: {
      link: { not: null },
      OR: [
        { total_stars: { not: null } },
        { stars_today: { not: null } },
      ],
    },
    orderBy: [
      { stars_today: { sort: "desc", nulls: "last" } },
      { total_stars: { sort: "desc", nulls: "last" } },
    ],
    take: 10,
  });

  return repos.map((r) => ({
    name: r.title ?? "Unknown",
    url: r.link ?? "#",
    stars: r.total_stars ?? 0,
    description: r.content ?? r.full_content ?? null,
    publishedAt: r.date ?? r.created_at ?? new Date(),
    language: r.language,
  }));
};
