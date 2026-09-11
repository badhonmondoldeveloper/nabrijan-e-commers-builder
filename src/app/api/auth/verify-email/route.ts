import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`verify:${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    const { token, email } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ message: 'Verification token is required' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await db.verificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token. Please request a new one.' },
        { status: 400 }
      );
    }

    if (email && record.user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ message: 'Token does not match specified user' }, { status: 400 });
    }

    // Mark email as verified
    await db.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    });

    // Invalidate/delete all verification tokens for this user
    await db.verificationToken.deleteMany({
      where: { userId: record.userId },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: record.userId,
        actorEmail: record.user.email,
        action: 'EMAIL_VERIFIED',
        resource: 'User',
        resourceId: record.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your email address has been successfully verified.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 400 });
  }
}
