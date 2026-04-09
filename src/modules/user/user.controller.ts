import { Request, Response } from "express";
import { env } from "../../config/env";
import { getAuthCookieOptions } from "../../config/cookie";
import { UserRole } from "../../types/auth";
import {
  deleteUserById,
  findUserByEmail,
  getUserProfile,
  getUsers,
  updateUserProfile,
  updateUserRole,
} from "./user.service";

export async function getProfile(req: Request, res: Response): Promise<Response> {
  try {
    const user = await getUserProfile(req.user!.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to load profile.", error: message });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  void req;

  try {
    const users = await getUsers();
    return res.json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to load users.", error: message });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<Response> {
  const { name, email } = (req.body ?? {}) as { name?: string; email?: string };

  if (!name && !email) {
    return res.status(400).json({ message: "Name or email is required to update profile." });
  }

  try {
    if (email) {
      const existingUser = await findUserByEmail(email);

      if (existingUser && existingUser.id !== req.user!.sub) {
        return res.status(409).json({ message: "Another user already uses this email." });
      }
    }

    const user = await updateUserProfile(req.user!.sub, { name, email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to update profile.", error: message });
  }
}

export async function deleteProfile(req: Request, res: Response): Promise<Response> {
  try {
    const deleted = await deleteUserById(req.user!.sub);

    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }

    res.clearCookie(env.jwtCookieName, getAuthCookieOptions());

    return res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to delete profile.", error: message });
  }
}

export async function updateRole(req: Request, res: Response): Promise<Response> {
  const { role } = (req.body ?? {}) as { role?: UserRole };
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Valid user id is required." });
  }

  if (role !== "admin" && role !== "user") {
    return res.status(400).json({ message: "Role must be either 'admin' or 'user'." });
  }

  try {
    const user = await updateUserRole(userId, role);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to update user role.", error: message });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: "Valid user id is required." });
  }

  try {
    const deleted = await deleteUserById(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ message: "Failed to delete user.", error: message });
  }
}
