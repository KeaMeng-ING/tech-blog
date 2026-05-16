import { runNewsAggregation, cleanupOldArticles } from "../services/newsAggregator.service.js";

const FETCH_INTERVAL_MS = 6 * 60 * 60 * 1000;   // 6 hours
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

let fetchTimer: NodeJS.Timeout | null = null;
let cleanupTimer: NodeJS.Timeout | null = null;

export function startNewsFetcherJob(): void {
  runNewsAggregation().catch((err) =>
    console.error("[Job] Initial aggregation failed:", err)
  );

  fetchTimer = setInterval(() => {
    runNewsAggregation().catch((err) =>
      console.error("[Job] Scheduled aggregation failed:", err)
    );
  }, FETCH_INTERVAL_MS);

  // Run first cleanup after 1 hour, then every 24 hours
  setTimeout(() => {
    cleanupOldArticles().catch((err) =>
      console.error("[Job] Initial cleanup failed:", err)
    );
    cleanupTimer = setInterval(() => {
      cleanupOldArticles().catch((err) =>
        console.error("[Job] Scheduled cleanup failed:", err)
      );
    }, CLEANUP_INTERVAL_MS);
  }, 60 * 60 * 1000);

  console.log("[Job] News fetcher scheduled every 6 hours, cleanup every 24 hours");
}

export function stopNewsFetcherJob(): void {
  if (fetchTimer) { clearInterval(fetchTimer); fetchTimer = null; }
  if (cleanupTimer) { clearInterval(cleanupTimer); cleanupTimer = null; }
}
