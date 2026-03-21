import { NextResponse } from "next/server";
import { z } from "zod";
import { Buffer } from "buffer";

import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";
import { Review } from "@/lib/db/models/Review";
import { Category } from "@/lib/db/models/Category";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW } from "@/lib/utils/constants";

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(1).optional(),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().min(3).optional(),
  brand: z.string().optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  images: z.array(imageSchema).optional(),
  colors: z.array(z.object({ name: z.string().min(1), swatchClass: z.string().min(1) })).optional(),
  sizes: z.array(z.object({ size: z.string().min(1), stock: z.number().int().min(0) })).optional(),
  tags: z.array(z.string()).optional(),
  material: z.string().optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().optional(),
  materialInfo: z
    .object({
      description: z.string().optional(),
      bullets: z.array(z.string()).optional(),
    })
    .optional(),
  sizeChart: z
    .array(
      z.object({
        size: z.string().optional(),
        age: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
      })
    )
    .optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/products/:slug — Get single product with reviews
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
      categoryId: product.categoryId?._id,
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
      shortDescription: product.shortDescription || product.description?.slice(0, 140) || "",
      price: product.price,
      comparePrice: product.comparePrice,
      stock: product.stock,
      sku: product.sku,
      brand: product.brand,
      images: (product.images || []).map((img) => ({
        url: img.url || img.src || "",
        alt: img.alt || product.name,
      })),
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
      materialInfo: product.materialInfo,
      sizeChart: product.sizeChart,
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
        image: rp.images?.[0]?.url || rp.images?.[0]?.src || "",
        badge: rp.badge,
        avgRating: rp.avgRating,
      })),
    };

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Product Detail GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/products/:slug — Update product (admin only)
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

    let productData = null;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const parseJson = (key, fallback) => {
        const value = formData.get(key);
        if (!value) return fallback;
        try {
          return JSON.parse(value);
        } catch {
          return fallback;
        }
      };
      const parseNumber = (key, fallback = null) => {
        const value = formData.get(key);
        if (value === null || value === undefined || value === "") return fallback;
        const num = Number(value);
        return Number.isNaN(num) ? fallback : num;
      };
      const parseBoolean = (key) => {
        const value = formData.get(key);
        return value === "true" || value === "1";
      };

      const files = formData.getAll("images").filter((file) => file instanceof File);
      const existingImages = parseJson("existingImages", []);
      const imageAlts = parseJson("imageAlts", []);

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          if (!["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
            throw new Error("Only PNG, JPG, or SVG images are allowed");
          }
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("Image size must be 5MB or less");
          }
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const url = `data:${file.type};base64,${base64}`;
          return {
            url,
            alt: imageAlts[index] || file.name || "Product image",
          };
        })
      );

      productData = {
        name: formData.get("name") || "",
        description: formData.get("description") || "",
        shortDescription: formData.get("shortDescription") || "",
        price: parseNumber("price", 0),
        comparePrice: parseNumber("comparePrice", null),
        stock: parseNumber("stock", 0),
        sku: formData.get("sku") || "",
        brand: formData.get("brand") || "",
        categorySlug: formData.get("categorySlug") || "",
        material: formData.get("material") || "",
        badge: formData.get("badge") || "",
        isFeatured: parseBoolean("isFeatured"),
        colors: parseJson("colors", []),
        sizes: parseJson("sizes", []),
        tags: parseJson("tags", []),
        materialInfo: parseJson("materialInfo", {}),
        sizeChart: parseJson("sizeChart", []),
        images: [...existingImages, ...uploadedImages],
      };
    } else {
      const body = await request.json();
      productData = sanitizeInput(body);
    }

    const sanitized = sanitizeInput(productData);
    const validated = validateSchema(sanitized, productUpdateSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const { slug } = await params;
    const validatedData = validated.data;

    if (validatedData.categoryId || validatedData.categorySlug) {
      const categoryDoc = validatedData.categoryId
        ? await Category.findById(validatedData.categoryId).lean()
        : await Category.findOne({ slug: validatedData.categorySlug }).lean();

      if (!categoryDoc) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      validatedData.categoryId = categoryDoc._id;
      validatedData.categorySlug = categoryDoc.slug;
    }

    if (validatedData.images) {
      validatedData.images = validatedData.images.map((img) => ({ url: img.url, alt: img.alt }));
    }

    const updated = await Product.findOneAndUpdate({ slug }, validatedData, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { id: updated._id.toString(), slug: updated.slug } });
  } catch (error) {
    console.error("[Product PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/products/:slug — Delete product (admin only)
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
    const deleted = await Product.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("[Product DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
