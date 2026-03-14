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
export async function POST(request) {
  try {
    const limit = await rateLimit(request, { max: AUTH_RATE_LIMIT_MAX, window: AUTH_RATE_LIMIT_WINDOW });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (sessionToken) {
      await connectToDatabase();
      const sessionTokenHash = hashSessionToken(sessionToken);
      await User.updateOne(
        { sessionTokenHash },
        { $set: { sessionTokenHash: null, sessionExpiresAt: null } }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Auth Logout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
