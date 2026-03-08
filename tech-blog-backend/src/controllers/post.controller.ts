import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { error, success } from "../utils/response.utils.js";

// GET /api/posts — with filter & pagination
export const getPosts = async (req: Request, res: Response) => {
  const { category, status, search, page = 1, limit = 10 } = req.query;

  const where: any = {};
  if (category) where.category = { slug: category };
  if (status) where.status = status;
  if (search) where.title = { contains: search as string, mode: "insensitive" };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  success(res, { posts, total, page: Number(page), limit: Number(limit) });
};

// GET /api/posts/:id
export const getPost = async (req: Request, res: Response) => {
  console.log("Fetching post with ID:", req.params.id);
  const post = await prisma.post.findUnique({
    where: { id: String(req.params.id) },
    include: { category: true },
  });
  if (!post) return error(res, "Post not found", 404);
  success(res, post);
};

// POST /api/posts (admin)
export const createPost = async (req: Request, res: Response) => {
  const {
    title,
    slug,
    shortDesc,
    content,
    thumbnailUrl,
    source,
    status,
    scheduledAt,
    categoryId,
  } = req.body;

  const existing = await prisma.post.findUnique({ where: { slug } });

  const post = await prisma.post.create({
    data: {
      title,
      slug: existing ? `${slug}-${Date.now()}` : slug,
      shortDesc,
      content,
      thumbnailUrl,
      source,
      status,
      scheduledAt,
      categoryId,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  success(res, post, 201);
};

// PATCH /api/posts/:id (admin)
export const updatePost = async (req: Request, res: Response) => {
  const data = { ...req.body };

  if (data.status === "PUBLISHED") data.publishedAt = new Date();
  const post = await prisma.post.update({
    where: { id: String(req.params.id) },
    data,
  });

  success(res, post);
};

// DELETE /api/posts/:id (admin)
export const deletePost = async (req: Request, res: Response) => {
  await prisma.post.delete({ where: { id: String(req.params.id) } });
  success(res, { message: "Post deleted" });
};
