import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Review } from "@/lib/db/models/Review";
import { Product } from "@/lib/db/models/Product";
import { Order } from "@/lib/db/models/Order";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional().default(""),
  comment: z.string().max(1000).optional().default(""),
});

/**
 * POST /api/reviews — Create a product review
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
    const validated = validateSchema(sanitized, reviewSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Review.findOne({
      productId: validated.data.productId,
      userId: user.id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const hasPurchased = await Order.findOne({
      userId: user.id,
      "items.productId": validated.data.productId,
      status: { $in: ["PAID", "DELIVERED"] },
    });

    await Review.create({
      productId: validated.data.productId,
      userId: user.id,
      rating: validated.data.rating,
      title: validated.data.title,
      comment: validated.data.comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    const stats = await Review.aggregate([
      { $match: { productId: validated.data.productId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(validated.data.productId, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    return NextResponse.json(
      { message: "Review submitted" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Reviews POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
