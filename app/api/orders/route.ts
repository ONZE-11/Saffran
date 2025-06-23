import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { ResultSetHeader } from "mysql2";



export async function POST(request: Request) {
  const { customer_name, customer_email, customer_phone, address, items } =
    await request.json();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // ثبت سفارش اصلی
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO order_requests (customer_name, customer_email, customer_phone, address)
   VALUES (?, ?, ?, ?)`,
      [customer_name, customer_email, customer_phone, address]
    );
    const orderId = result.insertId;

    // ثبت آیتم‌های سفارش
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_request_items (order_request_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [orderId, item.product_id, item.quantity]
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    await connection.rollback();
    return NextResponse.json(
      { error: "Order failed", details: error },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
