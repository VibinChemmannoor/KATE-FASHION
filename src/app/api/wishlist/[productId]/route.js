import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Wishlist } from "@/lib/db/models/Wishlist";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * DELETE /api/wishlist/:productId — Remove item from wishlist
 * @param {Request} request
 * @param {{ params: { productId: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await params;

    await connectToDatabase();

    await Wishlist.deleteOne({ userId: user.id, productId });

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("[Wishlist DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
