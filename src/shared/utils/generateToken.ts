import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";
import { PublicUser } from "../../types/auth";

export function generateToken(user: Pick<PublicUser, "id" | "email" | "role">): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    } as SignOptions
  );
}
