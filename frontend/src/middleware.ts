import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/features",
  "/pricing",
  "/changelog",
  "/roadmap",
  "/about",
  "/blog",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/gdpr",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname === "/" ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return;
  }

  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  // Exclude api/auth, static files, images, and other non-page routes
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|fonts|js).*)",
  ],
};