import Parser from "rss-parser";
import { prisma } from "../config/prisma.js";

type MediaContent = { $?: { url?: string } };

type FeedItem = {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  "content:encoded"?: string;
  "media:content"?: MediaContent | MediaContent[];
  "media:thumbnail"?: { $?: { url?: string } };
  creator?: string;
  author?: string;
  isoDate?: string;
  enclosure?: { url?: string; type?: string };
};

const parser = new Parser<Record<string, unknown>, FeedItem>({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["content:encoded", "content:encoded"],
    ],
  },
});

interface FeedSource {
  name: string;
  url: string;
  category: string;
  limit?: number; // max items per fetch (default 20)
  imageOnly?: boolean; // skip items that have no image
}

const FEED_SOURCES: FeedSource[] = [
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "Tech News",
    imageOnly: true,
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "Tech News",
    imageOnly: true,
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "Tech News",
    imageOnly: true,
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "Tech News",
    imageOnly: true,
  },
  {
    name: "VentureBeat",
    url: "https://venturebeat.com/feed/",
    category: "Tech News",
    limit: 15,
    imageOnly: true,
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "AI",
    imageOnly: true,
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "AI",
    limit: 10,
    imageOnly: true,
  },
  {
    name: "AWS Blog",
    url: "https://aws.amazon.com/blogs/aws/feed/",
    category: "Cloud",
    imageOnly: true,
  },
  {
    name: "Microsoft Dev Blog",
    url: "https://devblogs.microsoft.com/feed/",
    category: "Development",
    imageOnly: false,
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    category: "Web Development",
    imageOnly: true,
  },
  {
    name: "Dev.to",
    url: "https://dev.to/feed",
    category: "Development",
    limit: 15,
    imageOnly: false,
  },
];

function extractImage(item: FeedItem): string | null {
  // 1. media:content (may be an array when multiple elements exist)
  const raw = item["media:content"];
  if (raw) {
    const arr = Array.isArray(raw) ? raw : [raw];
    const url = arr.find((m) => m.$?.url)?.$?.url;
    if (url) return url;
  }

  // 2. media:thumbnail
  if (item["media:thumbnail"]?.$?.url) return item["media:thumbnail"]!.$!.url!;

  // 3. enclosure (skip audio/video)
  const enc = item.enclosure;
  if (enc?.url) {
    const isImage =
      enc.type?.startsWith("image/") ||
      /\.(jpe?g|png|gif|webp)(\?|$)/i.test(enc.url);
    if (isImage) return enc.url;
  }

  // 4. First <img> in HTML content
  const html = item["content:encoded"] ?? item.content ?? "";
  if (html) {
    // Match http/https URLs (most common)
    const abs = html.match(/<img[^>]+src=["']?(https?:\/\/[^"'\s>]+)/i);
    if (abs) return abs[1];

    // Protocol-relative URLs
    const rel = html.match(/<img[^>]+src=["']?(\/\/[^"'\s>]+)/i);
    if (rel) return `https:${rel[1]}`;
  }

  return null;
}

export async function fetchAndSaveFeeds(): Promise<number> {
  let totalSaved = 0;

  for (const source of FEED_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, source.limit ?? 20);

      for (const item of items) {
        if (!item.link) continue;

        try {
          const image = extractImage(item);
          if (source.imageOnly && !image) continue;

          const existing = await prisma.news_articles_automation.findUnique({
            where: { link: item.link },
            select: { id: true },
          });
          if (existing) continue;

          await prisma.news_articles_automation.create({
            data: {
              title: item.title ?? null,
              content: item.contentSnippet ?? null,
              link: item.link,
              author: item.creator ?? item.author ?? null,
              date: item.isoDate ? new Date(item.isoDate) : null,
              categories: source.category,
              source: source.name,
              image,
            },
          });
          totalSaved++;
        } catch {
          // Skip duplicates / constraint violations
        }
      }

      console.log(`[Feed] ${source.name}: saved up to ${items.length} items`);
    } catch (err) {
      console.error(`[Feed] Failed to fetch ${source.name}:`, err);
    }
  }

  return totalSaved;
}
