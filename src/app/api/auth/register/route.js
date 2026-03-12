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
  BABY_NAME_MAX,
  BCRYPT_SALT_ROUNDS,
  MILLISECONDS_IN_SECOND,
  PHONE_MIN,
  PASSWORD_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@/lib/utils/constants";

const registerSchema = z.object({
  username: z.string().min(USERNAME_MIN).max(USERNAME_MAX),
  email: z.string().email(),
  phone: z.string().min(PHONE_MIN),
  password: z.string().min(1),
  babyName: z.string().max(BABY_NAME_MAX).optional(),
  babyDob: z.string().optional(),
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

    const validated = validateSchema(sanitized, registerSchema);
    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    const decryptedPassword = decryptPassword(validated.data.password);
    if (decryptedPassword.length < PASSWORD_MIN) {
      return NextResponse.json({ error: "Password does not meet requirements" }, { status: 400 });
    }

    await connectToDatabase();

    const email = validated.data.email.toLowerCase();
    const username = validated.data.username;
    const phone = validated.data.phone;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (existingUser) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(decryptedPassword, BCRYPT_SALT_ROUNDS);

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);
    const sessionExpiresAt = new Date(Date.now() + AUTH_COOKIE_MAX_AGE * MILLISECONDS_IN_SECOND);

    const user = await User.create({
      username,
      email,
      phone,
      passwordHash,
      babyName: validated.data.babyName || "",
      babyDob: validated.data.babyDob ? new Date(validated.data.babyDob) : null,
      sessionTokenHash,
      sessionExpiresAt,
    });

    const response = NextResponse.json(
      {
        data: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("[Auth Register]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
