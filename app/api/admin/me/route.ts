// app/api/admin/me/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
console.log("🔍 ADMIN_EMAILS ENV:", process.env.ADMIN_EMAILS);

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

  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  return NextResponse.json(
  {
    ok: isAdmin,
    email,
    adminList: ADMIN_EMAILS,
    rawEnv: process.env.ADMIN_EMAILS, // 👈 برای تست نهایی
  },
  { status: isAdmin ? 200 : 403 }
);

}
