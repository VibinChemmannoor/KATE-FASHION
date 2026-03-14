import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { decryptPassword } from "@/lib/security/rsa";
import { generateSessionToken, hashSessionToken } from "@/lib/security/session";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
  AUTH_RATE_LIMIT_MAX,
  AUTH_RATE_LIMIT_WINDOW,
  MILLISECONDS_IN_SECOND,
} from "@/lib/utils/constants";

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

/**
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const limit = await rateLimit(request, {
      max: AUTH_RATE_LIMIT_MAX,
      window: AUTH_RATE_LIMIT_WINDOW,
    });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const sanitized = sanitizeInput(body);

    const validated = validateSchema(sanitized, loginSchema);
    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    const decryptedPassword = decryptPassword(validated.data.password);

    await connectToDatabase();

    const identifier = validated.data.identifier.toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: validated.data.identifier },
        { username: validated.data.identifier },
      ],
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(decryptedPassword, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);
    const sessionExpiresAt = new Date(Date.now() + AUTH_COOKIE_MAX_AGE * MILLISECONDS_IN_SECOND);

    user.sessionTokenHash = sessionTokenHash;
    user.sessionExpiresAt = sessionExpiresAt;
    await user.save();

    const response = NextResponse.json({
      data: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("[Auth Login]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
