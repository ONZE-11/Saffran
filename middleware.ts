// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // 🔒 مسیرهای محافظت‌شده
// const isProtectedRoute = createRouteMatcher([
//   "/admin(.*)", // صفحات ادمین
//   "/api/admin(.*)", // API های ادمین
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) {
//     const { userId } = await auth();
//     if (!userId) {
//       return Response.redirect("/sign-in"); // 🔥 ری‌دایرکت به SignIn
//     }
//   }
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/api/(.*)",
//   ],
// };

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      // گزینه ۱: ریدایرکت استاندارد Clerk (با returnBackUrl)
      return redirectToSignIn({ returnBackUrl: req.url });

      // یا گزینه ۲:
      // return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});

// فقط روی مسیرهای موردنیاز اجرا شود (به‌نفع سئو و پرفورمنس)
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
