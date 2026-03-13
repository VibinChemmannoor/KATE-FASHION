import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { hashSessionToken } from "@/lib/security/session";
import { AUTH_COOKIE_NAME } from "@/lib/utils/constants";

/**
 * POST /api/auth/logout — Logout and clear session
 * @returns {Promise<NextResponse>}
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (sessionToken) {
      await connectToDatabase();
      const tokenHash = hashSessionToken(sessionToken);
      await User.updateOne(
        { sessionTokenHash: tokenHash },
        { $set: { sessionTokenHash: null, sessionExpiresAt: null } }
      );
    }

    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Auth Logout]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
