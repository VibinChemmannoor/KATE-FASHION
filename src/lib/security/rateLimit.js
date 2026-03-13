import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit = null;

/**
 * Get or create the rate limiter instance (lazy initialization)
 * @returns {Ratelimit|null}
 */
function getRateLimiter() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
  });

  return ratelimit;
}

/**
 * Apply rate limiting to an API request.
 * Returns success: true if rate limiting is not configured.
 * @param {Request} request
 * @param {{ max: number, window: string }} options
 * @returns {Promise<{ success: boolean }>}
 */
export async function rateLimit(request, options) {
  const limiter = getRateLimiter();

  if (!limiter) {
    return { success: true };
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  return limiter.limit(ip);
}
