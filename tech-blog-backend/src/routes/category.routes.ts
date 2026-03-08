import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema.js";

const categoryRouter = Router();

// GET /api/categories — Public
categoryRouter.get("/", getCategories);

// POST /api/categories — Admin only
categoryRouter.post(
  "/",
  userAuthorize,
  requireAdmin,
  validateRequest(createCategorySchema),
  createCategory,
);

// PATCH /api/categories/:id — Admin only
categoryRouter.patch(
  "/:id",
  userAuthorize,
  requireAdmin,
  validateRequest(updateCategorySchema),
  updateCategory,
);

// DELETE /api/categories/:id — Admin only
categoryRouter.delete("/:id", userAuthorize, requireAdmin, deleteCategory);

export default categoryRouter;
