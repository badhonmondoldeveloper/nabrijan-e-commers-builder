import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production');
    }
    return 'dev-only-secret-key-nabrijan-saas-2026-development-mode';
  }
  return secret;
};

const JWT_SECRET = new TextEncoder().encode(getJwtSecret());

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('nabrijan_session')?.value;

  // Protected paths
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedApiRoute =
    pathname.startsWith('/api/stores') ||
    pathname.startsWith('/api/billing/create-payment');

  if (isDashboardRoute || isAdminRoute || isProtectedApiRoute) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'UNAUTHORIZED: Session token required' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // Super Admin protection
      if (isAdminRoute && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Attach user header to request
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'UNAUTHORIZED: Invalid or expired session' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/admin', '/admin/:path*', '/api/stores/:path*', '/api/billing/create-payment'],
};
