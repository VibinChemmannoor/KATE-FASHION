import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { Product } from "@/lib/db/models/Product";

/**
 * GET /api/categories/:slug — Get category with its products
 * @param {Request} request
 * @param {{ params: { slug: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const sort = searchParams.get("sort") || "newest";

    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      popular: { reviewCount: -1 },
    };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ categoryId: category._id, isActive: true })
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments({ categoryId: category._id, isActive: true }),
    ]);

    return NextResponse.json({
      data: {
        category: {
          id: category._id.toString(),
          slug: category.slug,
          name: category.name,
          description: category.description,
          image: category.image,
        },
        products: products.map((p) => ({
          id: p._id.toString(),
          slug: p.slug,
          name: p.name,
          price: p.price,
          comparePrice: p.comparePrice,
          images: p.images,
          sizes: p.sizes,
          colors: p.colors,
          badge: p.badge,
          avgRating: p.avgRating,
          reviewCount: p.reviewCount,
        })),
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("[Category Detail GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
