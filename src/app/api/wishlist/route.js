import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Wishlist } from "@/lib/db/models/Wishlist";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const wishlistSchema = z.object({
  productId: z.string().min(1),
});

/**
 * GET /api/wishlist — Get user's wishlist
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const items = await Wishlist.find({ userId: user.id })
      .populate({
        path: "productId",
        select: "name slug price comparePrice images badge avgRating stock sizes colors",
      })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = items
      .filter((item) => item.productId)
      .map((item) => ({
        id: item._id.toString(),
        addedAt: item.createdAt,
        product: {
          id: item.productId._id.toString(),
          slug: item.productId.slug,
          name: item.productId.name,
          price: item.productId.price,
          comparePrice: item.productId.comparePrice,
          image: item.productId.images?.[0]?.url || "",
          badge: item.productId.badge,
          avgRating: item.productId.avgRating,
          stock: item.productId.stock,
          sizes: item.productId.sizes,
          colors: item.productId.colors,
        },
      }));

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Wishlist GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist — Add item to wishlist
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, wishlistSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Wishlist.findOne({
      userId: user.id,
      productId: validated.data.productId,
    });

    if (existing) {
      return NextResponse.json({ message: "Already in wishlist" });
    }

    await Wishlist.create({
      userId: user.id,
      productId: validated.data.productId,
    });

    return NextResponse.json(
      { message: "Added to wishlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Wishlist POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
