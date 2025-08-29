// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// فقط این مسیرها نیاز به محافظت دارن
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",       // صفحات ادمین
  "/api/admin(.*)",   // API ادمین
  "/api/contact(.*)", // پیام‌ها (GET/DELETE)
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // فقط اگر توی مسیرهای محافظت‌شده باشیم و یوزر لاگین نکرده باشه → ریدایرکت به Sign-in
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // همه‌ی مسیرها بجز sign-in و sign-up و فایل‌های استاتیک/next
    "/((?!_next|.*\\..*|sign-in|sign-up).*)",
  ],
};
