import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * GET /api/auth/me — Get current logged in user
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[Auth Me]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
