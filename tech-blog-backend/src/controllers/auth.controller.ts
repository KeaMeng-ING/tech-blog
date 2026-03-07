import { prisma } from "../config/prisma.js";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import { signToken } from "../utils/jwt.utils.js";
import { success, error } from "../utils/response.utils.js";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) return error(res, "Email already registered");

  const user = await prisma.user.create({
    data: { email, password: await hashPassword(password) },
  });

  const token = signToken({ id: user.id, role: user.role });
  success(
    res,
    { token, user: { id: user.id, email: user.email, role: user.role } },
    201,
  );
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.password)))
    return error(res, "Invalid credentials", 401);

  if (user.isDisabled) return error(res, "Account disabled", 403);
  const token = signToken({ id: user.id, role: user.role });

  success(res, {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
};
