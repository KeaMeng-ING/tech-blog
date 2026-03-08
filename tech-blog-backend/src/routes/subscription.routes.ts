import { Router } from "express";
import {
  subscribe,
  getSubscriptions,
  pauseSubscription,
  removeSubscription,
} from "../controllers/subscription.controller.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createSubscriptionSchema,
  getSubscriptionsQuerySchema,
  pauseSubscriptionSchema,
  deleteSubscriptionSchema,
} from "../schema/subscription.schema.js";

const subscriptionRouter = Router();

// POST /api/subscription — Public
subscriptionRouter.post(
  "/",
  userAuthorize,
  validateRequest(createSubscriptionSchema),
  subscribe,
);

// GET /api/subscription — Admin only
subscriptionRouter.get(
  "/",
  userAuthorize,
  requireAdmin,
  validateRequest(getSubscriptionsQuerySchema),
  getSubscriptions,
);

// PATCH /api/subscription/:id/pause — Admin only
subscriptionRouter.patch(
  "/:id/pause",
  userAuthorize,
  requireAdmin,
  validateRequest(pauseSubscriptionSchema),
  pauseSubscription,
);

// DELETE /api/subscription/:id — Admin only
subscriptionRouter.delete(
  "/:id",
  userAuthorize,
  requireAdmin,
  validateRequest(deleteSubscriptionSchema),
  removeSubscription,
);

export default subscriptionRouter;
