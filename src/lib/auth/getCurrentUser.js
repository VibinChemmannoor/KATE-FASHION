import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { hashSessionToken } from "@/lib/security/session";
import { AUTH_COOKIE_NAME } from "@/lib/utils/constants";

/**
 * Get the current authenticated user from session cookie.
 * Works in API routes and Server Components.
 * @returns {Promise<{ id: string, username: string, email: string, phone: string, role: string } | null>}
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionToken) return null;

    const sessionTokenHash = hashSessionToken(sessionToken);

    await connectToDatabase();

    const user = await User.findOne({
      sessionTokenHash,
      sessionExpiresAt: { $gt: new Date() },
    }).lean();

    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  } catch (error) {
    console.error("[Auth] getCurrentUser error:", error);
    return null;
  }
}
