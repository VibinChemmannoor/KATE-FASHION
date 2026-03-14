import { NextResponse } from "next/server";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { Product } from "@/lib/db/models/Product";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW, PRODUCTS_PAGE_SIZE } from "@/lib/utils/constants";

const categoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/categories/:slug — Get category with its products
 * @param {Request} request
 * @param {{ params: { slug: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    const limitResult = await rateLimit(request, {
      max: AUTH_RATE_LIMIT_MAX,
      window: AUTH_RATE_LIMIT_WINDOW,
    });
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await connectToDatabase();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || `${PRODUCTS_PAGE_SIZE}`, 10);
    const sort = searchParams.get("sort") || "newest";

    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
          images: (p.images || []).map((img) => ({
            url: img.url || img.src || "",
            alt: img.alt || p.name,
          })),
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/categories/:slug — Update category (admin only)
 * @param {Request} request
 * @param {{ params: { slug: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request, { params }) {
  try {
    const limitResult = await rateLimit(request, {
      max: AUTH_RATE_LIMIT_MAX,
      window: AUTH_RATE_LIMIT_WINDOW,
    });
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, categoryUpdateSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const { slug } = await params;
    const updated = await Category.findOneAndUpdate({ slug }, validated.data, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { id: updated._id.toString(), slug: updated.slug } });
  } catch (error) {
    console.error("[Category PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/categories/:slug — Delete category (admin only)
 * @param {Request} request
 * @param {{ params: { slug: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const limitResult = await rateLimit(request, {
      max: AUTH_RATE_LIMIT_MAX,
      window: AUTH_RATE_LIMIT_WINDOW,
    });
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { slug } = await params;
    const deleted = await Category.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("[Category DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
