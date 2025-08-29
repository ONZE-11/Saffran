// app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function GET(req: Request) {
  const { userId } = getAuth(req as any);
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  const user = await clerkClient.users.getUser(userId);

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  const email = primaryEmail || user.emailAddresses[0]?.emailAddress || "";

  // 🔍 لاگ برای دیباگ در پروداکشن (Vercel Logs)
  console.log("👤 Clerk user email:", email);
  console.log("👮 Allowed admin emails:", ADMIN_EMAILS);
  console.log(
    "🔎 Comparison result:",
    ADMIN_EMAILS.includes(email.toLowerCase())
  );

  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  if (!isAdmin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  return NextResponse.json({ ok: true, email });
}
