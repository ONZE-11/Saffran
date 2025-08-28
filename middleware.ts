// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 🔒 مسیرهای محافظت‌شده
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",      // همه صفحات ادمین
  "/api/admin(.*)",  // APIهای ادمین
  "/api/contact",    // API تماس (باید Clerk رویش فعال باشه)
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req)) {
    if (!userId) {
      // کاربر لاگین نیست → ری‌دایرکت به صفحه SignIn
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  return NextResponse.next();
});

// 🔧 Config → تعیین مسیرهایی که Middleware باید روشون فعال باشه
export const config = {
  matcher: [
    "/admin/:path*",   // همه صفحات ادمین
    "/api/admin/:path*", // APIهای ادمین
    "/api/contact",    // API تماس
  ],
};
