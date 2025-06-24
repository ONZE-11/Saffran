import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    const adminEmails = ["mahjoubia509@gmail.com", "mairesmaster@outlook.com"];

    if (!user || !adminEmails.includes(user.emailAddresses[0].emailAddress)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status, payment_status } = body;

    const validStatuses = ["new", "processing", "shipped", "cancelled"];
    const validPayments = ["paid", "unpaid"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (payment_status && !validPayments.includes(payment_status)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }

    const fieldsToUpdate = [];
    const values: any[] = [];

    if (status) {
      fieldsToUpdate.push("status = ?");
      values.push(status);
    }

    if (payment_status) {
      fieldsToUpdate.push("payment_status = ?");
      values.push(payment_status);
    }

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    values.push(params.id);
    const query = `UPDATE order_requests SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    await pool.query(query, values);

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("❌ PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser();
    const adminEmails = ["mahjoubia509@gmail.com", "admin2@example.com"];

    if (!user || !adminEmails.includes(user.emailAddresses[0].emailAddress)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const [result]: any = await pool.query("DELETE FROM order_requests WHERE id = ?", [orderId]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
