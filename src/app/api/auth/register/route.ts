import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';
import { sendVerificationEmail } from '@/lib/mail/mailer';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`register:${ip}`, { limit: 5, windowMs: 60000 });
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existing = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        passwordHash,
        phone: validated.phone,
        role: 'MERCHANT',
        isEmailVerified: false,
      },
    });

    // Create secure hashed email verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Send transactional verification email
    try {
      await sendVerificationEmail(user.email, rawToken, user.name);
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
    }

    // Create session
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setSessionCookie(token);

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        action: 'USER_REGISTER',
        resource: 'User',
        resourceId: user.id,
        details: JSON.stringify({ name: user.name, role: user.role }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: false,
      },
      requiresVerification: true,
      message: 'Registration successful. A verification email has been sent to your address.',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 400 });
  }
}
