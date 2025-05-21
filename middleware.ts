import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth/login") ||
    path.startsWith("/api/auth/register");

  // Define protected API paths that require authentication
  const isProtectedApiPath =
    path.startsWith("/api/") &&
    !path.startsWith("/api/auth/login") &&
    !path.startsWith("/api/auth/register");

  // Check for authentication token
  const token =
    request.cookies.get("authToken")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  // Handle API authentication
  if (isProtectedApiPath && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For pages, redirect to login if not authenticated and trying to access protected route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if ((path === "/login" || path === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  // Match all routes except for static files, images, etc.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
