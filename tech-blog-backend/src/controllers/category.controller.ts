import { Request, Response } from "express";
import { success } from "../utils/response.utils.js";
import { prisma } from "../config/prisma.js";

export const getCategories = async (_: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
  });
  success(res, categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  const category = await prisma.category.create({ data: { name, slug } });
  success(res, category, 201);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await prisma.category.update({
    where: { id: String(req.params.id) },
    data: req.body,
  });
  success(res, category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await prisma.category.delete({ where: { id: String(req.params.id) } });
  success(res, { message: "Category deleted" });
};
