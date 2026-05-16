import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { runNewsAggregation } from "../services/newsAggregator.service.js";

// GET all — paginated
export const getNews = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? "20"), 10)));
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      prisma.news_articles_automation.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.news_articles_automation.count(),
    ]);

    res.json({
      success: true,
      data: news,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch news" });
  }
};

// GET single
export const getSingleNews = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const article = await prisma.news_articles_automation.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    res.json({ success: true, data: article });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching article" });
  }
};

// GET search
export const getSearchNews = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const news = await prisma.news_articles_automation.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: String(search), mode: "insensitive" } },
              { content: { contains: String(search), mode: "insensitive" } },
              { source: { contains: String(search), mode: "insensitive" } },
              { categories: { contains: String(search), mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { created_at: "desc" },
      take: 50,
    });

    res.json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/news-automation/trigger — admin only, manually kick off aggregation
export const triggerAggregation = async (_req: Request, res: Response) => {
  try {
    // Run in background so we can return immediately
    runNewsAggregation()
      .then((result) =>
        console.log("[Trigger] Aggregation complete:", result)
      )
      .catch((err) =>
        console.error("[Trigger] Aggregation error:", err)
      );

    res.json({ success: true, message: "Aggregation started in background" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to start aggregation" });
  }
};
