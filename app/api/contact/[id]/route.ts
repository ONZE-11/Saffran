// app/api/contact/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const messageId = params.id;

  try {
    const [result]: any = await pool.query(
      "DELETE FROM contact_messages WHERE id = ?",
      [messageId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting message:", error.message);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
