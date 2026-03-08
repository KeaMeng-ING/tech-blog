import { Request, Response } from "express";
import { success } from "../utils/response.utils.js";
import { prisma } from "../config/prisma.js";

// GET /api/users — list all users with subscriptions
export const getUsers = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isDisabled: true,
      createdAt: true,
      subscriptions: true,
    },
  });
  success(res, users);
};

// PATCH /api/users/:id/role
export const changeRole = async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: String(req.params.id) },
    data: { role: req.body.role },
  });
  success(res, user);
};

// PATCH /api/users/:id/disable
export const disableUser = async (req: Request, res: Response) => {
  const user = await prisma.user.update({
    where: { id: String(req.params.id) },
    data: { isDisabled: req.body.isDisabled },
  });
  success(res, user);
};
