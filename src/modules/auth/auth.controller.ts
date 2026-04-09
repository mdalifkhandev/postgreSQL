import { Request, Response } from "express";
import { env } from "../../config/env";
import { getAuthCookieOptions } from "../../config/cookie";
import { createPasswordResetToken, getCurrentUser, loginUser, registerUser, resetPasswordWithToken } from "./auth.service";

export async function register(req: Request, res: Response): Promise<Response> {
  const { name, email, password } = (req.body ?? {}) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const result = await registerUser({ name, email, password });
    res.cookie(env.jwtCookieName, result.token, getAuthCookieOptions());
    res.setHeader("Authorization", `Bearer ${result.token}`);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "CONFLICT_USER") {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to register user.", error: message });
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await loginUser({ email, password });
    res.cookie(env.jwtCookieName, result.token, getAuthCookieOptions());
    res.setHeader("Authorization", `Bearer ${result.token}`);
    return res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to login.", error: message });
  }
}

export function logout(req: Request, res: Response): Response {
  void req;
  res.clearCookie(env.jwtCookieName, getAuthCookieOptions());
  return res.json({ message: "Logout successful." });
}

export async function forgotPassword(req: Request, res: Response): Promise<Response> {
  const { email } = (req.body ?? {}) as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const resetToken = await createPasswordResetToken(email);

    if (!resetToken) {
      return res.json({
        message: "If an account exists with this email, a reset token has been generated.",
      });
    }

    return res.json({
      message: "Password reset token generated successfully.",
      resetToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to generate reset token.", error: message });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<Response> {
  const { token, newPassword } = (req.body ?? {}) as { token?: string; newPassword?: string };

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and newPassword are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." });
  }

  try {
    const success = await resetPasswordWithToken(token, newPassword);

    if (!success) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to reset password.", error: message });
  }
}

export async function me(req: Request, res: Response): Promise<Response> {
  try {
    const user = await getCurrentUser(req.user!.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to fetch user profile.", error: message });
  }
}
