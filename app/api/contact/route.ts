import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";

// 📌 گرفتن ایمیل‌های ادمین از env
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
  : [];

// 🔒 بررسی اینکه کاربر ادمین است یا خیر
const isAdmin = (email: string | undefined | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

// =======================
// 📌 GET → فقط برای ادمین
// =======================
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      console.warn("🚫 Unauthorized access to GET /api/contact");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!isAdmin(email)) {
      console.warn("🚫 Access denied for:", email);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const [rows] = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );

    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("❌ Error in GET /api/contact:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch messages", details: err.message },
      { status: 500 }
    );
  }
}

// =======================
// 📌 POST → فقط برای لاگین‌ها
// =======================
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      console.warn("🚫 Unauthorized POST /api/contact");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("❌ Error in POST /api/contact:", err.message);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}

// =======================
// 📌 DELETE → فقط برای ادمین
// =======================
export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses[0]?.emailAddress;
    if (!isAdmin(email)) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { id } = await request.json();
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [result]: any = await pool.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (err: any) {
    console.error("❌ Error in DELETE /api/contact:", err.message);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
