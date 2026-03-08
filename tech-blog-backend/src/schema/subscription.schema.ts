import * as z from "zod";

export const createSubscriptionSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .toLowerCase()
      .trim(),
    topics: z
      .array(z.string().min(1, "Topic cannot be empty"))
      .min(1, "At least one topic is required"),
    deliveryTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
  }),
});

export const getSubscriptionsQuerySchema = z.object({
  query: z.object({
    topic: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
    search: z.string().optional(),
  }),
});

export const pauseSubscriptionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Subscription ID is required"),
  }),
});

export const deleteSubscriptionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Subscription ID is required"),
  }),
});

export type CreateSubscriptionInput = z.infer<
  typeof createSubscriptionSchema
>["body"];
