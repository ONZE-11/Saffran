import { NextResponse } from "next/server"
import { pool } from "@/lib/db" // اتصال به MySQL

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name, email, subject || null, message]
    )

    return NextResponse.json({ success: true, message: "Message received. We will get back to you soon." })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contact API is running",
    timestamp: new Date().toISOString(),
  })
}

