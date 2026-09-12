import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessions = await db.liveChatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const unreadTotal = await db.liveChatSession.count({
      where: { unreadAdmin: true },
    });

    return NextResponse.json({ sessions, unreadTotal });
  } catch (error: any) {
    console.error('Admin Chat Sessions Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
