import { Router } from "express";
import { forgotPassword, login, logout, me, register, resetPassword } from "./auth.controller";
import { authenticate } from "../../shared/middleware/authenticate";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
