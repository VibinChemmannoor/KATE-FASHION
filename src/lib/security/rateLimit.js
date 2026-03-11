import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

/**
 * Apply rate limiting to an API request.
 * @param {Request} request
 * @param {{ max: number, window: string }} options
 */
export async function rateLimit(request, options) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  return ratelimit.limit(ip);
}
