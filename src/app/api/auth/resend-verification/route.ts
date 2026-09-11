import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mailer';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`resend-verify:${ip}`, { limit: 3, windowMs: 15 * 60 * 1000 }); // 3 per 15 min
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    let emailToVerify: string | null = null;
    let userId: string | null = null;
    let userName: string = 'Merchant';

    const currentUser = await getCurrentUser();
    if (currentUser) {
      emailToVerify = currentUser.email;
      userId = currentUser.id;
      userName = currentUser.name;
    } else {
      const body = await req.json().catch(() => ({}));
      if (body.email) {
        const targetUser = await db.user.findUnique({ where: { email: body.email } });
        if (targetUser) {
          emailToVerify = targetUser.email;
          userId = targetUser.id;
          userName = targetUser.name;
        }
      }
    }

    // Generic response to prevent email enumeration
    const genericResponse = NextResponse.json({
      success: true,
      message: 'If an unverified account exists, a new verification link has been sent to the email address.',
    });

    if (!userId || !emailToVerify) {
      return genericResponse;
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.isEmailVerified) {
      return genericResponse;
    }

    // Delete previous verification tokens for this user
    await db.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new hashed token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await sendVerificationEmail(emailToVerify, rawToken, userName);

    return genericResponse;
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to resend verification email' }, { status: 400 });
  }
}
