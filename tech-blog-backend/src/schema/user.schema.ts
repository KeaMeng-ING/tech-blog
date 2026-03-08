import * as z from "zod";

export const changeRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum(["USER", "ADMIN"], {
      error: "Role must be USER or ADMIN",
    }),
  }),
});

export const disableUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    isDisabled: z.boolean({
      error: "isDisabled must be a boolean",
    }),
  }),
});
