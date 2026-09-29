import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "velora_zaven_luxury_auth_secret_production_32_characters_minimum"
);

const CUSTOMER_COOKIE_NAME = "velora_customer_session";
const ADMIN_COOKIE_NAME = "velora_admin_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. ADMIN ROUTE PROTECTION
  if (pathname.startsWith("/admin")) {
    // Exclude admin login page and admin auth API routes from protection
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
      const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (adminToken && pathname === "/admin/login") {
        try {
          const { payload } = await jwtVerify(adminToken, SECRET_KEY);
          if (payload.type === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
          }
        } catch {
          // Token invalid, proceed to login page
        }
      }
      return NextResponse.next();
    }

    // Protect all other /admin routes
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(adminToken, SECRET_KEY);
      if (payload.type !== "admin") {
        const loginUrl = new URL("/admin/login", req.url);
        return NextResponse.redirect(loginUrl);
      }
      // Pass verified admin role in request headers for downstream server components
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-admin-id", payload.adminId as string);
      requestHeaders.set("x-admin-role", payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. CUSTOMER ACCOUNT ROUTE PROTECTION
  if (pathname.startsWith("/account")) {
    const customerToken = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    if (!customerToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(customerToken, SECRET_KEY);
      if (payload.type !== "customer") {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId as string);
      requestHeaders.set("x-user-role", payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. REDIRECT ALREADY LOGGED IN USERS AWAY FROM LOGIN/REGISTER
  if (pathname === "/login" || pathname === "/register") {
    const customerToken = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    if (customerToken) {
      try {
        const { payload } = await jwtVerify(customerToken, SECRET_KEY);
        if (payload.type === "customer") {
          return NextResponse.redirect(new URL("/account", req.url));
        }
      } catch {
        // Token invalid, allow view
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
