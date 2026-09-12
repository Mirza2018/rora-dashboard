import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string;
  exp?: number;
}

const ACCESS_TOKEN_COOKIE = "rora_dashboard_accessToken";

const PUBLIC_ROUTES = ["/sign-in", "/otp", "/new-password", "/forgot-password"];

const PROTECTED_ROUTES = [
  "/dashboard/overview",
  "/dashboard/report",
  "/dashboard/analytics",
  "/dashboard/calls",
  "/dashboard/operator",
  "/dashboard/customers",
  "/dashboard/disputes",
  "/dashboard/payouts",
  "/dashboard/pricing",
  "/dashboard/legal",
  "/dashboard/notification",
  "/dashboard/settings",
];

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Proxy:", pathname);

  // Public routes don't need authentication
  if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (!isRouteMatch(pathname, PROTECTED_ROUTES)) {
    return NextResponse.next();
  }

  // Get token
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  console.log("Access Token:", accessToken ? "FOUND" : "NOT FOUND");

  // No token → sign in
  if (!accessToken) {
    return redirectToSignIn(request);
  }

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);

    console.log("Decoded token:", decoded);

    // Token expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return redirectToSignIn(request);
    }

    // Only SUPER_ADMIN
    if (decoded.role !== "SUPER_ADMIN") {
      return redirectToSignIn(request);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);

    return redirectToSignIn(request);
  }
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/sign-in", request.url);

  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
