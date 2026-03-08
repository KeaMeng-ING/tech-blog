import { Router } from "express";
import {
  changeRole,
  disableUser,
  getUsers,
} from "../controllers/user.controller.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { changeRoleSchema, disableUserSchema } from "../schema/user.schema.js";

const userRouter = Router();

// GET /api/users — Admin only
userRouter.get("/", userAuthorize, requireAdmin, getUsers);

// PATCH /api/users/:id/role — Admin only
userRouter.patch(
  "/:id/role",
  userAuthorize,
  requireAdmin,
  validateRequest(changeRoleSchema),
  changeRole,
);

// PATCH /api/users/:id/disable — Admin only
userRouter.patch(
  "/:id/disable",
  userAuthorize,
  requireAdmin,
  validateRequest(disableUserSchema),
  disableUser,
);

export default userRouter;
