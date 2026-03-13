import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";
import { Review } from "@/lib/db/models/Review";

/**
 * GET /api/products/:slug — Get single product with reviews
 * @param {Request} request
 * @param {{ params: { slug: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true })
      .populate("categoryId", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = await Review.find({ productId: product._id })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const relatedProducts = await Product.find({
      categoryId: product.categoryId._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    const serialized = {
      id: product._id.toString(),
      slug: product.slug,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      comparePrice: product.comparePrice,
      stock: product.stock,
      sku: product.sku,
      brand: product.brand,
      images: product.images,
      category: product.categoryId
        ? { id: product.categoryId._id.toString(), name: product.categoryId.name, slug: product.categoryId.slug }
        : null,
      tags: product.tags,
      sizes: product.sizes,
      colors: product.colors,
      material: product.material,
      ageGroup: product.ageGroup,
      gender: product.gender,
      attributes: product.attributes,
      isFeatured: product.isFeatured,
      avgRating: product.avgRating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        username: r.userId?.username || "Anonymous",
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt,
      })),
      relatedProducts: relatedProducts.map((rp) => ({
        id: rp._id.toString(),
        slug: rp.slug,
        name: rp.name,
        price: rp.price,
        comparePrice: rp.comparePrice,
        images: rp.images,
        badge: rp.badge,
        avgRating: rp.avgRating,
      })),
    };

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Product Detail GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
