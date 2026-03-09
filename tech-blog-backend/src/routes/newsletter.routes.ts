import { Router } from "express";
import {
  getDashboardStats,
  getNewsletterHistory,
  manualSend,
} from "../controllers/newsletter.controller.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const newsRouter = Router();

// GET /api/admin/stats
newsRouter.get("/stats", userAuthorize, requireAdmin, getDashboardStats);

// GET /api/admin/newsletter/history
newsRouter.get(
  "/newsletter/history",
  userAuthorize,
  requireAdmin,
  getNewsletterHistory,
);

// POST /api/admin/newsletter/send
newsRouter.post("/newsletter/send", userAuthorize, requireAdmin, manualSend);

export default newsRouter;
