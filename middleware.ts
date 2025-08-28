// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",      // صفحات ادمین
  "/api/admin(.*)",  // API ادمین
  "/api/contact",    // تماس (فقط لاگین کرده‌ها)
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req)) {
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/contact",
  ],
};
