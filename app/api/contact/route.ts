import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim())
  : [];

const isAdmin = (email: string | undefined | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email);

const getUserEmail = async (userId: string): Promise<string | null> => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return user?.emailAddresses?.[0]?.emailAddress || null;
  } catch (err) {
    console.error("❌ Clerk error:", err);
    return null;
  }
};

// =======================
// 📌 GET → فقط برای ادمین
// =======================
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request) ?? {};
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = await getUserEmail(userId);
    if (!isAdmin(email)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const [rows]: any = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );

    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch messages", details: err.message },
      { status: 500 }
    );
  }
}

// =======================
// 📌 POST → عمومی (بدون لاگین)
// =======================
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, subject || "", message]
    );

    return NextResponse.json({ message: "Message received" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}

// =======================
// 📌 DELETE → فقط برای ادمین
// =======================
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = await getUserEmail(userId);
    if (!isAdmin(email))
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { id } = await request.json();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [result]: any = await pool.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
