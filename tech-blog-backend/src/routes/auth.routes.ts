import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import { userAuthorize } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), register);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.post("/logout", userAuthorize, logout);

export default authRouter;
