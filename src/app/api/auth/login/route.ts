import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(validated.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

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
        action: 'USER_LOGIN',
        resource: 'User',
        resourceId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 400 });
  }
}
