import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId } = await auth();

  const publicPaths = ["/", "/auth/sign-in", "/auth/sign-up"];
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith("/_next");

  if (!userId && !isPublic) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }



  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};