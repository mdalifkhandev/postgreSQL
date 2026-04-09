import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../types/auth";

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource." });
    }

    next();
  };
}
