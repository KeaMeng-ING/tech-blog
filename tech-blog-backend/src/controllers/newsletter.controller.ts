import { Request, Response } from "express";
import { success, error } from "../utils/response.utils.js";
import { sendNewsletter } from "../services/email.service.js";
import { prisma } from "../config/prisma.js";

// GET /api/admin/stats
export const getDashboardStats = async (_: Request, res: Response) => {
  const [total, draft, scheduled, published, totalSubs, activeSubs] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.count({ where: { status: "SCHEDULED" } }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { isActive: true } }),
    ]);
  success(res, { total, draft, scheduled, published, totalSubs, activeSubs });
};

// GET /api/admin/newsletter/history
export const getNewsletterHistory = async (_: Request, res: Response) => {
  const logs = await prisma.newsletterLog.findMany({
    orderBy: { sentAt: "desc" },
  });
  success(res, logs);
};

// POST /api/admin/newsletter/send (manual send)
export const manualSend = async (req: Request, res: Response) => {
  try {
    const { topics } = req.body;

    // Get subscribers for selected topics (slugs match DB)
    const subs = await prisma.subscription.findMany({
      where: { isActive: true, topics: { hasSome: topics } },
    });

    // Get posts by category SLUG (not name)
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        category: { slug: { in: topics } },
      },
      take: 10,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    });

    // Send emails
    let sent = 0;
    for (const sub of subs) {
      await sendNewsletter(sub.email, posts);
      sent++;
    }

    // Log it
    await prisma.newsletterLog.create({
      data: { topics, totalSent: sent, status: "Success" },
    });
    success(res, {
      message: `Sent to ${sent} subscribers`,
      postsFound: posts.length,
    });
  } catch (err) {
    error(res, "Newsletter send failed", 500);
  }
};
