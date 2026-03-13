import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Cart } from "@/lib/db/models/Cart";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * DELETE /api/cart/:productId — Remove specific item from cart
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

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("[Cart Item DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
