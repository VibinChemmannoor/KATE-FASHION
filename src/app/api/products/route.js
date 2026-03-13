import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";

/**
 * GET /api/products — List products with filtering, sorting, pagination
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizes = searchParams.get("sizes");
    const colors = searchParams.get("colors");
    const material = searchParams.get("material");
    const gender = searchParams.get("gender");
    const ageGroup = searchParams.get("ageGroup");
    const featured = searchParams.get("featured");

    const filter = { isActive: true };

    if (category) filter.categoryId = category;
    if (gender) filter.gender = gender;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (material) filter.material = { $regex: material, $options: "i" };
    if (featured === "true") filter.isFeatured = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (sizes) {
      filter.sizes = { $in: sizes.split(",") };
    }

    if (colors) {
      filter["colors.name"] = { $in: colors.split(",") };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      popular: { reviewCount: -1, avgRating: -1 },
      rating: { avgRating: -1 },
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate("categoryId", "name slug")
        .lean(),
      Product.countDocuments(filter),
    ]);

    const serialized = products.map((p) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
      comparePrice: p.comparePrice,
      stock: p.stock,
      sku: p.sku,
      brand: p.brand,
      images: p.images,
      category: p.categoryId
        ? { id: p.categoryId._id.toString(), name: p.categoryId.name, slug: p.categoryId.slug }
        : null,
      tags: p.tags,
      sizes: p.sizes,
      colors: p.colors,
      material: p.material,
      ageGroup: p.ageGroup,
      gender: p.gender,
      isFeatured: p.isFeatured,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      badge: p.badge,
    }));

    return NextResponse.json({
      data: serialized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
    });
  } catch (error) {
    console.error("[Products GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
