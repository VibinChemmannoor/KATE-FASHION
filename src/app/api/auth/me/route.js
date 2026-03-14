import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/security/rateLimit";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { hashSessionToken } from "@/lib/security/session";
import { AUTH_COOKIE_NAME, AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW } from "@/lib/utils/constants";

/**
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const limit = await rateLimit(request, { max: AUTH_RATE_LIMIT_MAX, window: AUTH_RATE_LIMIT_WINDOW });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const sessionTokenHash = hashSessionToken(sessionToken);

    const user = await User.findOne({
      sessionTokenHash,
      sessionExpiresAt: { $gt: new Date() },
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      data: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Auth Me]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
