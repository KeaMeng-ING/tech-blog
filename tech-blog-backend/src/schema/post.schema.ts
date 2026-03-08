import * as z from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").trim(),
    slug: z
      .string()
      .min(3, "Slug must be at least 3 characters")
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
    shortDesc: z
      .string()
      .min(10, "Short description must be at least 10 characters")
      .max(300, "Short description cannot exceed 300 characters")
      .trim(),
    content: z.string().min(20, "Content must be at least 20 characters"),
    thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
    source: z.string().url("Invalid source URL").optional(),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("DRAFT"),
    scheduledAt: z
      .string()
      .datetime("Invalid date format")
      .optional()
      .nullable(),
    categoryId: z.string().min(1, "Category is required"),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Post ID is required"),
  }),
  body: z.object({
    title: z.string().min(3).trim().optional(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case")
      .optional(),
    shortDesc: z.string().min(10).max(300).trim().optional(),
    content: z.string().min(20).optional(),
    thumbnailUrl: z.string().url().optional().nullable(),
    source: z.string().url().optional().nullable(),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).optional(),
    scheduledAt: z.string().datetime().optional().nullable(),
    categoryId: z.string().optional(),
  }),
});

export const getPostsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});
