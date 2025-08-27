import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { pool } from "@/lib/db";
import { ADMIN_EMAILS } from "@/lib/auth";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses[0]?.emailAddress.toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) {
      console.warn("🚨 Access denied for:", email);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const [rows] = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.address,
        o.created_at,
        o.status,
        o.payment_status,
        p.title_en AS product_name,
        i.quantity,
        p.price,
        (i.quantity * p.price) AS total_price
      FROM order_requests o
      JOIN order_request_items i ON o.id = i.order_request_id
      JOIN products p ON i.product_id = p.id
      ORDER BY o.created_at DESC;
    `);

    const grouped = new Map();
    for (const row of rows as any[]) {
      if (!grouped.has(row.order_id)) {
        grouped.set(row.order_id, {
          order_id: row.order_id,
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          customer_phone: row.customer_phone,
          address: row.address,
          created_at: row.created_at,
          status: row.status ?? "new",
          payment_status: row.payment_status ?? "unpaid",
          items: [],
        });
      }
      grouped.get(row.order_id).items.push({
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
        total_price: row.total_price,
      });
    }

    return NextResponse.json(Array.from(grouped.values()), { status: 200 });
  } catch (err: any) {
    console.error("❌ Error in GET /api/admin/orders:", err.message);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
