import { fetchAndSaveFeeds } from "./feedFetcher.service.js";
import { fetchAndSaveGitHubTrending } from "./githubTrending.service.js";
import { prisma } from "../config/prisma.js";

const RETENTION_DAYS = 30;

export interface AggregationResult {
  articles: number;
  repos: number;
  errors: string[];
  startedAt: Date;
  completedAt: Date;
}

export async function runNewsAggregation(): Promise<AggregationResult> {
  const startedAt = new Date();
  const errors: string[] = [];

  console.log("[Aggregator] Starting news aggregation...");

  const [feedResult, githubResult] = await Promise.allSettled([
    fetchAndSaveFeeds(),
    fetchAndSaveGitHubTrending(),
  ]);

  const articles = feedResult.status === "fulfilled" ? feedResult.value : 0;
  const repos = githubResult.status === "fulfilled" ? githubResult.value : 0;

  if (feedResult.status === "rejected") {
    errors.push(`Feed fetcher: ${feedResult.reason}`);
    console.error("[Aggregator] Feed fetcher failed:", feedResult.reason);
  }
  if (githubResult.status === "rejected") {
    errors.push(`GitHub fetcher: ${githubResult.reason}`);
    console.error("[Aggregator] GitHub fetcher failed:", githubResult.reason);
  }

  const completedAt = new Date();
  const durationMs = completedAt.getTime() - startedAt.getTime();

  console.log(
    `[Aggregator] Done in ${durationMs}ms — ${articles} new articles, ${repos} new GitHub repos`
  );

  return { articles, repos, errors, startedAt, completedAt };
}

export async function cleanupOldArticles(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const { count } = await prisma.news_articles_automation.deleteMany({
    where: { created_at: { lt: cutoff } },
  });

  console.log(`[Cleanup] Deleted ${count} articles older than ${RETENTION_DAYS} days`);
  return count;
}
