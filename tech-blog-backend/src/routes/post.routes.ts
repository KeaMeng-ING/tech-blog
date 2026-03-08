import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { userAuthorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  createPostSchema,
  getPostsQuerySchema,
  updatePostSchema,
} from "../schema/post.schema.js";

const postRouter = Router();

// Get all Posts + Public
postRouter.get("/", getPosts);

// Get specific Post + Public
postRouter.get("/:id", validateRequest(getPostsQuerySchema), getPost);

// Create new Post + Admin only
postRouter.post(
  "/",
  validateRequest(createPostSchema),
  userAuthorize,
  requireAdmin,
  createPost,
);

// Update Post + Admin only
postRouter.patch(
  "/:id",
  validateRequest(updatePostSchema),
  userAuthorize,
  requireAdmin,
  updatePost,
);

// Delete Post + Admin only
postRouter.delete("/:id", userAuthorize, requireAdmin, deletePost);

export default postRouter;
