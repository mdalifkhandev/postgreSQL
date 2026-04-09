import { Router } from "express";
import { deleteProfile, deleteUser, getAllUsers, getProfile, updateProfile, updateRole } from "./user.controller";
import { authenticate } from "../../shared/middleware/authenticate";
import { authorize } from "../../shared/middleware/authorize";

export const userRouter = Router();

userRouter.get("/profile", authenticate, getProfile);
userRouter.put("/profile", authenticate, updateProfile);
userRouter.delete("/profile", authenticate, deleteProfile);
userRouter.get("/", authenticate, authorize("admin"), getAllUsers);
userRouter.patch("/:id/role", authenticate, authorize("admin"), updateRole);
userRouter.delete("/:id", authenticate, authorize("admin"), deleteUser);
