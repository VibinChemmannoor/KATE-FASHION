import { NextResponse } from "next/server";

/**
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const key = process.env.AUTH_PUBLIC_KEY?.replace(/\\n/g, "\n");
    if (!key) {
      return NextResponse.json({ error: "Public key not configured" }, { status: 500 });
    }
    return NextResponse.json({ key });
  } catch (error) {
    console.error("[Auth Public Key]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
