import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    console.log("🚀 API Called: /api/orders");
    const body = await req.json();
    console.log("📥 API Request Body:", JSON.stringify(body, null, 2));

    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      items,
    } = body;

    // ✅ Validation: بررسی اینکه همه فیلدها پر هستند
    if (
      !customer_name?.trim() ||
      !customer_email?.trim() ||
      !customer_phone?.trim() ||
      !address?.trim() ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      console.error("❌ Missing or invalid fields:", body);
      return NextResponse.json(
        { success: false, error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    console.log("📝 About to insert into `order_requests`...");
    const [orderResult]: any = await pool.query(
      `
      INSERT INTO order_requests
      (customer_name, customer_email, customer_phone, address, status, payment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [customer_name, customer_email, customer_phone, address, "new", "unpaid"]
    );

    const orderRequestId = orderResult.insertId;
    console.log("✅ Order inserted with ID:", orderRequestId);

    // ✅ ذخیره آیتم‌های سفارش
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        console.warn("⚠ Skipping invalid item:", item);
        continue; // 🚫 این آیتم را رد می‌کنیم
      }

      console.log("📦 Inserting item into `order_request_items`:", JSON.stringify(item));
      await pool.query(
        `
        INSERT INTO order_request_items
        (order_request_id, product_id, quantity)
        VALUES (?, ?, ?)
        `,
        [orderRequestId, item.product_id, item.quantity]
      );
    }

    console.log("🎉 Order and items saved successfully ✅");
    return NextResponse.json(
      { success: true, order_id: orderRequestId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("🔥 API Error:", err?.message, err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
