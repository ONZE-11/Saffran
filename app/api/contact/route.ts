import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { getUserEmail, isAdmin } from "@/lib/auth";

// =======================
// 📌 GET → فقط برای ادمین
// =======================
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = await getUserEmail(userId);
    if (!isAdmin(email)) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const [rows] = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("❌ Error in GET /api/contact:", err.message);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// =======================
// 📌 POST → فقط برای لاگین‌ها
// =======================
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, subject || "", message]
    );

    return NextResponse.json({ message: "Message received" });
  } catch (err: any) {
    console.error("❌ Error in POST /api/contact:", err.message);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
