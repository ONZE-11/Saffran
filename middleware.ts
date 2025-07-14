import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🔒 مسیرهای محافظت‌شده
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)", // صفحات ادمین
  "/api/admin(.*)", // API های ادمین
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return Response.redirect("/sign-in"); // 🔥 ری‌دایرکت به SignIn
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(.*)",
  ],
};
