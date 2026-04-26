// ═══════════════════════════════════════════════════════
// Rate limiting
//
// Production: durable sliding-window limiter backed by Upstash Redis.
// Dev/preview (no Upstash env): in-memory fallback. Per-process, so the
// fallback is only safe for single-instance local dev — not for
// horizontally-scaled deployments.
// ═══════════════════════════════════════════════════════

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------
// Durable (Upstash) — lazy-initialised so build doesn't fail without env
// ---------------------------------------------------------------

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

let durableLimiter: Ratelimit | null = null;
let mediaLimiter: Ratelimit | null = null;

function getDurableLimiter(): Ratelimit | null {
  if (!hasUpstash) return null;
  if (durableLimiter) return durableLimiter;
  durableLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    // 60 messages per 15-minute sliding window, per identifier.
    limiter: Ratelimit.slidingWindow(60, "15 m"),
    analytics: true,
    prefix: "leah:rl",
  });
  return durableLimiter;
}

function getMediaLimiter(): Ratelimit | null {
  if (!hasUpstash) return null;
  if (mediaLimiter) return mediaLimiter;
  mediaLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    // 30 admin media uploads per 15-minute window. Single-admin so the
    // realistic value is far below this — limit is defense in depth.
    limiter: Ratelimit.slidingWindow(30, "15 m"),
    analytics: true,
    prefix: "media:rl",
  });
  return mediaLimiter;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number; // epoch ms when the window resets
}

/**
 * Leah-specific rate limit. Uses Upstash if configured, otherwise falls
 * back to the in-memory limiter below.
 */
export async function rateLimitLeah(userId: string): Promise<RateLimitResult> {
  const limiter = getDurableLimiter();
  if (limiter) {
    const { success, remaining, reset } = await limiter.limit(userId);
    return { success, remaining, resetTime: reset };
  }
  // Fallback — dev/preview only.
  return rateLimit(`leah:${userId}`, 60, 15 * 60_000);
}

/**
 * Admin media upload rate limit. Keyed by admin user id.
 */
export async function rateLimitMediaUpload(
  userId: string,
): Promise<RateLimitResult> {
  const limiter = getMediaLimiter();
  if (limiter) {
    const { success, remaining, reset } = await limiter.limit(userId);
    return { success, remaining, resetTime: reset };
  }
  return rateLimit(`media:${userId}`, 30, 15 * 60_000);
}

// ---------------------------------------------------------------
// In-memory fallback — preview / single-instance local dev only
// ---------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60_000,
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Prune expired entries
  rateLimitMap.forEach((v, k) => {
    if (now > v.resetTime) rateLimitMap.delete(k);
  });

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { success: true, remaining: limit - 1, resetTime };
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count++;
  return {
    success: true,
    remaining: limit - current.count,
    resetTime: current.resetTime,
  };
}
