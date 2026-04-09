import { Router } from "express";
import { authRouter } from "./auth/auth.routes";
import { userRouter } from "./user/user.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
