// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/admin(.*)",       // Admin pages
//   "/api/admin(.*)",   // Admin APIs
//   "/api/contact(.*)", // Contact messages (GET/DELETE)
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   if (isProtectedRoute(req) && !userId) {
//     return redirectToSignIn({ returnBackUrl: req.url });
//   }
//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*|sign-in|sign-up).*)",
//   ],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // اگر درخواست بدون www بود
  if (req.nextUrl.hostname === "elororojo.es") {
    url.hostname = "www.elororojo.es";
    return NextResponse.redirect(url, 301); // 301 واقعی
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // همه مسیرها را پوشش می‌دهد
};
