import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../../database/pool";
import { generateToken } from "../../shared/utils/generateToken";
import { AuthResponse, PublicUser, UserRecord } from "../../types/auth";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const normalizedEmail = input.email.toLowerCase();
  const existingUser = await pool.query<{ id: number }>("SELECT id FROM users WHERE email = $1", [
    normalizedEmail,
  ]);

  if ((existingUser.rowCount ?? 0) > 0) {
    throw new Error("CONFLICT_USER");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const result = await pool.query<UserRecord>(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, name, email, password_hash, role, created_at, updated_at;
    `,
    [input.name, normalizedEmail, passwordHash]
  );

  const user = toPublicUser(result.rows[0]);

  return {
    message: "User registered successfully.",
    token: generateToken(user),
    user,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const result = await pool.query<UserRecord>("SELECT * FROM users WHERE email = $1", [
    input.email.toLowerCase(),
  ]);

  if ((result.rowCount ?? 0) === 0) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(input.password, user.password_hash);

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const publicUser = toPublicUser(user);

  return {
    message: "Login successful.",
    token: generateToken(publicUser),
    user: publicUser,
  };
}

export async function getCurrentUser(userId: number): Promise<PublicUser | null> {
  const result = await pool.query<PublicUser>(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
    [userId]
  );

  return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const result = await pool.query<UserRecord>("SELECT * FROM users WHERE email = $1", [normalizedEmail]);

  if ((result.rowCount ?? 0) === 0) {
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await pool.query(
    `
      UPDATE users
      SET password_reset_token = $1,
          password_reset_expires_at = CURRENT_TIMESTAMP + INTERVAL '15 minutes'
      WHERE email = $2
    `,
    [resetToken, normalizedEmail]
  );

  return resetToken;
}

export async function resetPasswordWithToken(resetToken: string, newPassword: string): Promise<boolean> {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const result = await pool.query(
    `
      UPDATE users
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires_at = NULL
      WHERE password_reset_token = $2
        AND password_reset_expires_at IS NOT NULL
        AND password_reset_expires_at > CURRENT_TIMESTAMP
    `,
    [passwordHash, resetToken]
  );

  return (result.rowCount ?? 0) > 0;
}
