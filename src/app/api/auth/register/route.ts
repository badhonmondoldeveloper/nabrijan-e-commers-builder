import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validation/schemas';

export async function POST(req: Request) {
  try {
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
      },
    });

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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 400 });
  }
}
