import { prisma } from "../config/prisma.js";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepo {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  owner: { login: string };
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

async function githubFetch(url: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "tech-blog-aggregator",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(url, { headers });

  // Invalid/expired token — retry without auth
  if (res.status === 401 && GITHUB_TOKEN) {
    console.warn("[GitHub] Token returned 401 — retrying without auth. Check GITHUB_TOKEN in .env.");
    const { Authorization: _, ...noAuth } = headers;
    return fetch(url, { headers: noAuth });
  }

  return res;
}

export async function fetchAndSaveGitHubTrending(): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const dateStr = since.toISOString().split("T")[0];

  const url = `https://api.github.com/search/repositories?q=created:>${dateStr}+stars:>10&sort=stars&order=desc&per_page=10`;

  const res = await githubFetch(url);
  if (!res.ok) {
    console.error(`[GitHub] API error ${res.status}: ${res.statusText}`);
    return 0;
  }

  const data = (await res.json()) as GitHubSearchResponse;
  let saved = 0;

  for (const repo of data.items) {
    try {
      const existing = await prisma.news_articles_automation.findUnique({
        where: { link: repo.html_url },
        select: { id: true },
      });

      if (existing) {
        await prisma.news_articles_automation.update({
          where: { link: repo.html_url },
          data: {
            total_stars: repo.stargazers_count,
            total_forks: repo.forks_count,
          },
        });
      } else {
        await prisma.news_articles_automation.create({
          data: {
            title: repo.full_name,
            content: repo.description,
            link: repo.html_url,
            author: repo.owner.login,
            date: new Date(repo.pushed_at),
            categories: "GitHub",
            source: "GitHub Trending",
            total_stars: repo.stargazers_count,
            total_forks: repo.forks_count,
            language: repo.language,
          },
        });
        saved++;
      }
    } catch (err) {
      console.error(`[GitHub] Failed to save ${repo.full_name}:`, err);
    }
  }

  console.log(`[GitHub] Saved ${saved} new trending repos`);
  return saved;
}
