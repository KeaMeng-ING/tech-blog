import { prisma } from "../config/prisma.js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Cache descriptions in memory — persists for the lifetime of the process
const descCache = new Map<string, string | null>();

async function fetchGithubDescription(repoPath: string): Promise<string | null> {
  if (descCache.has(repoPath)) return descCache.get(repoPath)!;

  try {
    const apiUrl = `https://api.github.com/repos/${repoPath}`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const res = await fetch(apiUrl, { headers });
    if (!res.ok) return null; // don't cache failures so it retries on next request

    const data = (await res.json()) as { description?: string | null };
    const desc = data.description ?? null;
    descCache.set(repoPath, desc); // only cache successes
    return desc;
  } catch {
    return null;
  }
}

function extractRepoPath(url: string): string | null {
  const match = url.match(/github\.com\/([^/]+\/[^/?#]+)/);
  return match ? match[1].replace(/\.git$/, "") : null;
}

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

  return Promise.all(
    repos.map(async (r) => {
      const repoPath = r.link ? extractRepoPath(r.link) : null;
      const description = repoPath ? await fetchGithubDescription(repoPath) : null;

      return {
        name: r.title ?? "Unknown",
        url: r.link ?? "#",
        stars: r.total_stars ?? 0,
        description,
        publishedAt: r.date ?? r.created_at ?? new Date(),
        language: r.language,
      };
    })
  );
};
