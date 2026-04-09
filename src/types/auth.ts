export type UserRole = "admin" | "user";

export interface JwtPayloadData {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  password_reset_token?: string | null;
  password_reset_expires_at?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: PublicUser;
}
