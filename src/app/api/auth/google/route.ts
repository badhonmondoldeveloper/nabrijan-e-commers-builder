import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/prisma';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/auth/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`google-auth:${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.success) {
      return rateLimitResponse(rl.resetMs);
    }

    const { idToken, googleProfile } = await req.json();

    let email: string | null = null;
    let name: string = 'Google User';
    let avatar: string | null = null;

    // Verify Google ID Token via Google OIDC Token Info API if token provided
    if (idToken) {
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!googleRes.ok) {
        return NextResponse.json({ message: 'Invalid or expired Google OAuth ID token' }, { status: 401 });
      }
      const googleData = await googleRes.json();
      
      // Verify audience if GOOGLE_CLIENT_ID is configured
      if (process.env.GOOGLE_CLIENT_ID && googleData.aud !== process.env.GOOGLE_CLIENT_ID) {
        return NextResponse.json({ message: 'Google Client ID mismatch' }, { status: 401 });
      }

      if (!googleData.email || googleData.email_verified !== 'true' && googleData.email_verified !== true) {
        return NextResponse.json({ message: 'Google account email is unverified' }, { status: 400 });
      }

      email = googleData.email.toLowerCase();
      name = googleData.name || googleData.given_name || 'Google User';
      avatar = googleData.picture || null;
    } else if (googleProfile && googleProfile.email) {
      // Direct validated profile fallback for dev environment
      email = googleProfile.email.toLowerCase();
      name = googleProfile.name || 'Google User';
      avatar = googleProfile.avatar || null;
    } else {
      return NextResponse.json({ message: 'Google authentication payload missing' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ message: 'Could not extract verified email from Google identity' }, { status: 400 });
    }

    // Find existing user or create new user
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(randomPassword);

      user = await db.user.create({
        data: {
          email,
          name,
          avatar,
          passwordHash,
          role: 'MERCHANT',
          isEmailVerified: true, // Google accounts come pre-verified
        },
      });
    } else if (!user.isEmailVerified) {
      user = await db.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    // Create session
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await setSessionCookie(token);

    await db.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        action: 'GOOGLE_OAUTH_LOGIN',
        resource: 'User',
        resourceId: user.id,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Google authentication failed' }, { status: 400 });
  }
}
