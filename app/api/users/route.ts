import { currentUser } from '@clerk/nextjs/server';
import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function POST() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, emailAddresses, firstName, lastName } = user;
  const email = emailAddresses[0]?.emailAddress ?? '';

  try {
    // بررسی وجود کاربر
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE clerk_id = ?',
      [id]
    );

    // اگر کاربر وجود ندارد، ثبت کن
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO users (clerk_id, name, email) VALUES (?, ?, ?)`,
        [id, `${firstName ?? ''} ${lastName ?? ''}`, email]
      );
    }

    return NextResponse.json({ success: true, clerk_id: id });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE clerk_id = ?',
      [user.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
