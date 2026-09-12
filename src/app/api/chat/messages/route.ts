import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await db.liveChatSession.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ messages: [], status: 'NEW' });
    }

    // Mark unread user as false
    if (session.unreadUser) {
      await db.liveChatSession.update({
        where: { sessionId },
        data: { unreadUser: false },
      });
    }

    return NextResponse.json({
      session,
      messages: session.messages,
      status: session.status,
    });
  } catch (error: any) {
    console.error('Fetch Chat Messages Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
