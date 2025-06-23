import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function GET(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  const { id } = context.params;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [parseInt(id, 10)]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
