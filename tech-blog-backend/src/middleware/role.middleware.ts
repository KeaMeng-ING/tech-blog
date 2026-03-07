import { Request, Response, NextFunction } from "express";
import { error } from "../utils/response.utils.js";

interface CustomRequest extends Request {
  user?: { role: string };
}

export const requireAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") return error(res, "Forbidden", 403);
  next();
};
