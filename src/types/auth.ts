export type Role = "CUSTOMER" | "VIP_CLIENT" | "CONCIERGE" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: Role;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  expiresAt: Date | number;
}
