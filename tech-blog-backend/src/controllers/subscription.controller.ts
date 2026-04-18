import { Request, Response } from "express";
import { success, error } from "../utils/response.utils.js";
import { prisma } from "../config/prisma.js";

// POST /api/subscriptions — subscribe with email + topics + time
export const subscribe = async (req: Request, res: Response) => {
  const { email, topics, deliveryTime } = req.body;
  const userId = req.user.id;

  const sub = await prisma.subscription.create({
    data: { email, topics, deliveryTime, userId },
  });
  success(res, sub, 201);
};

// GET /api/subscriptions — admin: list all subscribers
export const getSubscriptions = async (req: Request, res: Response) => {
  const { topic, status, search } = req.query;
  const where: any = {};
  if (topic) where.topics = { has: topic as string };
  if (status) where.isActive = status === "active";
  if (search) where.email = { contains: search as string, mode: "insensitive" };
  const subs = await prisma.subscription.findMany({
    where,
    include: { user: true },
  });
  success(res, subs);
};

// PATCH /api/subscriptions/:id/pause
export const pauseSubscription = async (req: Request, res: Response) => {
  const sub = await prisma.subscription.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  success(res, sub);
};

// DELETE /api/subscriptions/:id
export const removeSubscription = async (req: Request, res: Response) => {
  await prisma.subscription.delete({ where: { id: req.params.id } });
  success(res, { message: "Subscription removed" });
};
