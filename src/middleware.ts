import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: Request) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const { pathname } = new URL(request.url);
  const isAuthPage = pathname.startsWith("/auth");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|auth).*)"],
};