import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AdminRole, UserRole } from "@prisma/client";
import prisma from "./prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "velora_zaven_luxury_auth_secret_production_32_characters_minimum"
);

export const CUSTOMER_COOKIE_NAME = "velora_customer_session";
export const ADMIN_COOKIE_NAME = "velora_admin_session";

export interface CustomerSessionPayload {
  type: "customer";
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
}

export interface AdminSessionPayload {
  type: "admin";
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  expiresAt: number;
}

// -----------------------------------------------------------------------------
// PASSWORD SECURITY
// -----------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// -----------------------------------------------------------------------------
// CUSTOMER SESSIONS
// -----------------------------------------------------------------------------

export async function signCustomerToken(
  payload: Omit<CustomerSessionPayload, "expiresAt" | "type">
): Promise<string> {
  return new SignJWT({
    type: "customer",
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(SECRET_KEY);
}

export async function verifyCustomerToken(token: string): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ["HS256"] });
    if (payload.type !== "customer") return null;

    return {
      type: "customer",
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      expiresAt: (payload.exp ?? 0) * 1000,
    };
  } catch {
    return null;
  }
}

export async function setCustomerSession(userId: string, email: string, role: UserRole) {
  const token = await signCustomerToken({ userId, email, role });
  const cookieStore = await cookies();

  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}

// -----------------------------------------------------------------------------
// ADMIN SESSIONS & RBAC
// -----------------------------------------------------------------------------

export async function signAdminToken(
  payload: Omit<AdminSessionPayload, "expiresAt" | "type">
): Promise<string> {
  return new SignJWT({
    type: "admin",
    adminId: payload.adminId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ["HS256"] });
    if (payload.type !== "admin") return null;

    return {
      type: "admin",
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as AdminRole,
      expiresAt: (payload.exp ?? 0) * 1000,
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(
  adminId: string,
  email: string,
  name: string,
  role: AdminRole
) {
  const token = await signAdminToken({ adminId, email, name, role });
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Role hierarchy checker:
 * SUPER_ADMIN has access to everything.
 * ADMIN has access to standard administrative functions.
 * EDITOR can manage catalog, content, media.
 * CUSTOMER_SUPPORT can manage orders, inquiries, users.
 */
export function hasRequiredRole(userRole: AdminRole, allowedRoles: AdminRole[]): boolean {
  if (userRole === AdminRole.SUPER_ADMIN) return true;
  return allowedRoles.includes(userRole);
}

export async function requireAdminAuth(allowedRoles: AdminRole[] = [AdminRole.ADMIN, AdminRole.SUPER_ADMIN]): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Admin authentication required");
  }

  if (!hasRequiredRole(session.role, allowedRoles)) {
    throw new Error("FORBIDDEN: Insufficient administrative privileges");
  }

  return session;
}

export async function requireCustomerAuth(): Promise<CustomerSessionPayload> {
  const session = await getCustomerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Customer login required");
  }
  return session;
}
