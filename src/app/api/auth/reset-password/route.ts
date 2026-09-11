import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/session';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`reset-pass:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    const { token, password } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ message: 'Reset token is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const record = await db.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    // Update user password and verify email if unverified
    await db.user.update({
      where: { id: record.userId },
      data: {
        passwordHash: newPasswordHash,
        isEmailVerified: true,
      },
    });

    // Invalidate all reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: record.userId },
    });

    // Invalidate active sessions to force re-authentication with new credentials
    await db.session.deleteMany({
      where: { userId: record.userId },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: record.userId,
        actorEmail: record.user.email,
        action: 'PASSWORD_RESET_COMPLETED',
        resource: 'User',
        resourceId: record.userId,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Password reset failed' }, { status: 400 });
  }
}
