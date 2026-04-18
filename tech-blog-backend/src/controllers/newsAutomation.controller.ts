import { Request, Response } from "express"
import { prisma } from "../config/prisma.js"


// GET all
export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news_articles_automation.findMany({
      orderBy: { date: "desc" },
      take: 50,
    })

    res.json({
      success: true,
      data: news,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch news" })
  }
}

// GET single
export const getSingleNews = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id

    const article = await prisma.news_articles_automation.findUnique({
      where: { id },
    })

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      })
    }

    res.json({
      success: true,
      data: article,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching article" })
  }
}

// Search
export const getSearchNews = async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    const news = await prisma.news_articles_automation.findMany({
      where: search
        ? {
            OR: [
              {
                title: {
                  contains: String(search),
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: String(search),
                  mode: "insensitive",
                },
              },
              {
                source: {
                  contains: String(search),
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      orderBy: { date: "desc" },
    })

    res.json({
      success: true,
      data: news,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}