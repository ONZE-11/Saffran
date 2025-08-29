import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(req: Request) {
  const rawEnv = process.env.ADMIN_EMAILS || "";

  const ADMIN_EMAILS = rawEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const { userId } = getAuth(req as any);
  if (!userId) {
    return NextResponse.json(
      { ok: false, reason: "no-userId", rawEnv, adminList: ADMIN_EMAILS },
      { status: 401 }
    );
  }

  const user = await clerkClient.users.getUser(userId);

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  const email = (primaryEmail || user.emailAddresses[0]?.emailAddress || "").toLowerCase();

  const isAdmin = ADMIN_EMAILS.includes(email);

  return NextResponse.json(
    {
      ok: isAdmin,
      email,
      rawEnv,
      adminList: ADMIN_EMAILS,
      comparison: `${email} ∈ ${JSON.stringify(ADMIN_EMAILS)} → ${isAdmin}`,
    },
    { status: isAdmin ? 200 : 200 } // 👈 موقتاً همیشه 200 بدیم برای دیدن جزئیات
  );
}
