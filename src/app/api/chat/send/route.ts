import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, visitorName, visitorPhone, message } = body;

    if (!sessionId || !visitorName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert session
    let session = await db.liveChatSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      session = await db.liveChatSession.create({
        data: {
          sessionId,
          visitorName: visitorName || 'Visitor',
          visitorPhone: visitorPhone || null,
          status: 'ACTIVE',
          unreadAdmin: true,
          unreadUser: false,
          lastMessage: message,
        },
      });
    } else {
      await db.liveChatSession.update({
        where: { sessionId },
        data: {
          visitorName: visitorName || session.visitorName,
          visitorPhone: visitorPhone || session.visitorPhone,
          status: 'ACTIVE',
          unreadAdmin: true,
          lastMessage: message,
          updatedAt: new Date(),
        },
      });
    }

    // Create visitor message
    const chatMsg = await db.liveChatMessage.create({
      data: {
        sessionId,
        senderType: 'VISITOR',
        senderName: visitorName || 'Visitor',
        message,
      },
    });

    return NextResponse.json({ success: true, session, message: chatMsg });
  } catch (error: any) {
    console.error('Chat Send Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
