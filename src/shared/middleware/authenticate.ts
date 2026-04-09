import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { JwtPayloadData } from "../../types/auth";

export function authenticate(req: Request, res: Response, next: NextFunction): Response | void {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies ? (req.cookies[env.jwtCookieName] as string | undefined) : undefined;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

  if (!cookieToken && !headerToken) {
    return res.status(401).json({ message: "Authentication token missing." });
  }else{
    console.log('cccc',cookieToken,'hhhhhh',headerToken);
    
  }

  try {
    if (cookieToken) {
      req.user = jwt.verify(cookieToken, env.jwtSecret) as unknown as JwtPayloadData;
      return next();
    }
  } catch {}

  try {
    if (headerToken) {
      req.user = jwt.verify(headerToken, env.jwtSecret) as unknown as JwtPayloadData;
      return next();
    }
  } catch {}

  {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
