import { CookieOptions } from "express";
import { env } from "./env";

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: env.jwtCookieHttpOnly,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: 24 * 60 * 60 * 1000,
  };
}
