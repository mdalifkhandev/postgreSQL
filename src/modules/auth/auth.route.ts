import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/signup", authController.usercreated);

authRouter.get("/user", authController.allUserGet);

export default authRouter;
