import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';
import { sendPasswordResetEmail } from '@/lib/mail/mailer';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`forgot-pass:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 }); // 5 requests / 15 min
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    const { email } = await req.json();

    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an account exists with that email address, a password reset link has been sent.',
    });

    if (!email || typeof email !== 'string') {
      return genericResponse;
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return genericResponse;
    }

    // Invalidate existing reset tokens for user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate single-use random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await sendPasswordResetEmail(user.email, rawToken, user.name);

    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        action: 'PASSWORD_RESET_REQUESTED',
        resource: 'User',
        resourceId: user.id,
        ipAddress: ip,
      },
    });

    return genericResponse;
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Forgot password request failed' }, { status: 400 });
  }
}
