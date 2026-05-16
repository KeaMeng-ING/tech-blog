import express from "express";
import {
  getNews,
  getSearchNews,
  getSingleNews,
  triggerAggregation,
} from "../controllers/newsAutomation.controller.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const newsAutomationRouter = express.Router();

newsAutomationRouter.get("/", getNews);
newsAutomationRouter.get("/search", getSearchNews);
newsAutomationRouter.get("/:id", getSingleNews);

// Admin-only: manually trigger a news fetch
newsAutomationRouter.post(
  "/trigger",
  userAuthorize,
  requireAdmin,
  triggerAggregation
);

export default newsAutomationRouter;
