import { NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Clean up expired rate limit records periodically
 */
if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { _rateLimitInterval?: NodeJS.Timeout };
  if (!g._rateLimitInterval) {
    g._rateLimitInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of tracker.entries()) {
        if (now > record.resetAt) {
          tracker.delete(key);
        }
      }
    }, 60000);
  }
}

export interface RateLimitOptions {
  limit?: number; // max requests per window, default 5
  windowMs?: number; // window size in ms, default 60,000 (1 min)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetMs: number } {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 60000;
  const now = Date.now();

  const record = tracker.get(identifier);

  if (!record || now > record.resetAt) {
    tracker.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetMs: record.resetAt - now };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetMs: record.resetAt - now };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function rateLimitResponse(resetMs: number) {
  const retryAfterSeconds = Math.ceil(resetMs / 1000);
  return NextResponse.json(
    {
      error: 'TOO_MANY_REQUESTS',
      message: `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}
