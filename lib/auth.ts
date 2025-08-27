import { clerkClient } from "@clerk/clerk-sdk-node";

export const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const isAdmin = (email: string | undefined | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

export const getUserEmail = async (userId: string): Promise<string | null> => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user?.emailAddresses?.[0]?.emailAddress || null;
  } catch (err) {
    console.error("❌ Clerk error:", err);
    return null;
  }
};
