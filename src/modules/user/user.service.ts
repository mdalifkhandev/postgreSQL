import { pool } from "../../database/pool";
import { PublicUser, UserRecord, UserRole } from "../../types/auth";

export async function getUserProfile(userId: number): Promise<PublicUser | null> {
  const result = await pool.query<PublicUser>(
    "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1",
    [userId]
  );

  return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
}

export async function getUsers(): Promise<PublicUser[]> {
  const result = await pool.query<PublicUser>(
    "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC"
  );

  return result.rows;
}

interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export async function updateUserProfile(
  userId: number,
  input: UpdateProfileInput
): Promise<PublicUser | null> {
  const fields: string[] = [];
  const values: Array<string | number> = [];

  if (input.name) {
    values.push(input.name);
    fields.push(`name = $${values.length}`);
  }

  if (input.email) {
    values.push(input.email.toLowerCase());
    fields.push(`email = $${values.length}`);
  }

  if (fields.length === 0) {
    return getUserProfile(userId);
  }

  values.push(userId);

  const result = await pool.query<PublicUser>(
    `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, name, email, role, created_at, updated_at;
    `,
    values
  );

  return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
}

export async function deleteUserById(userId: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  return (result.rowCount ?? 0) > 0;
}

export async function updateUserRole(userId: number, role: UserRole): Promise<PublicUser | null> {
  const result = await pool.query<PublicUser>(
    `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, name, email, role, created_at, updated_at;
    `,
    [role, userId]
  );

  return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await pool.query<UserRecord>("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
}
