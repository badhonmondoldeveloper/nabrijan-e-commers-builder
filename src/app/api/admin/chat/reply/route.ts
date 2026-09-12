import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, message, status } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await db.liveChatSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    let chatMsg = null;
    if (message && message.trim().length > 0) {
      chatMsg = await db.liveChatMessage.create({
        data: {
          sessionId,
          senderType: 'ADMIN',
          senderName: 'Nabrijan Support',
          message,
        },
      });

      await db.liveChatSession.update({
        where: { sessionId },
        data: {
          unreadAdmin: false,
          unreadUser: true,
          lastMessage: message,
          status: status || 'ACTIVE',
          updatedAt: new Date(),
        },
      });
    } else if (status) {
      await db.liveChatSession.update({
        where: { sessionId },
        data: {
          status,
          unreadAdmin: false,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, message: chatMsg });
  } catch (error: any) {
    console.error('Admin Chat Reply Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
