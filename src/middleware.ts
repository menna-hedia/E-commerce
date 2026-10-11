import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const isSecure = req.headers.get("x-forwarded-proto") === "https"
    || process.env.NEXTAUTH_URL?.startsWith("https://");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    // Send the visitor back to where they were going after they sign in.
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/allorders/:path*",
    "/wishlist/:path*",
  ],
};