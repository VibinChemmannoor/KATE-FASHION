import { NextResponse } from "next/server";
import { z } from "zod";
import { Buffer } from "buffer";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";
import { Category } from "@/lib/db/models/Category";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW, PRODUCTS_PAGE_SIZE } from "@/lib/utils/constants";

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const productCreateSchema = z.object({
  slug: z.string().min(3),
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().min(1),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().min(3),
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
});

const DEFAULT_LIMIT = PRODUCTS_PAGE_SIZE;

/**
 * GET /api/products — List products with filtering, sorting, pagination
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const limitResult = await rateLimit(request, {
      max: AUTH_RATE_LIMIT_MAX,
      window: AUTH_RATE_LIMIT_WINDOW,
    });
    if (!limitResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10);
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category");
    const categorySlug = searchParams.get("categorySlug");
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
    if (categorySlug) {
      const categoryBySlug = await Category.findOne({ slug: categorySlug, isActive: true })
        .select("_id")
        .lean();
      if (!categoryBySlug) {
        return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0, hasMore: false } });
      }
      filter.categoryId = categoryBySlug._id;
    }
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
      filter["sizes.size"] = { $in: sizes.split(",") };
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
      shortDescription: p.shortDescription || p.description?.slice(0, 140) || "",
      price: p.price,
      comparePrice: p.comparePrice,
      stock: p.stock,
      sku: p.sku,
      brand: p.brand,
      images: (p.images || []).map((img) => ({
        url: img.url || img.src || "",
        alt: img.alt || p.name,
      })),
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

/**
 * POST /api/products â€” Create a product (admin only)
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
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

    let data = null;
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

      data = {
        slug: formData.get("slug") || "",
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
      data = sanitizeInput(body);
    }

    const sanitized = sanitizeInput(data);
    const validated = validateSchema(sanitized, productCreateSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const validatedData = validated.data;
    let resolvedCategoryId = validatedData.categoryId || null;

    if (!resolvedCategoryId && validatedData.categorySlug) {
      const category = await Category.findOne({ slug: validatedData.categorySlug }).select("_id").lean();
      resolvedCategoryId = category?._id?.toString() || null;
    }

    if (!resolvedCategoryId) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const categoryDoc = await Category.findById(resolvedCategoryId).lean();
    if (!categoryDoc) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const created = await Product.create({
      ...validatedData,
      categoryId: categoryDoc._id,
      categorySlug: categoryDoc.slug,
      images: (validatedData.images || []).map((img) => ({ url: img.url, alt: img.alt })),
    });

    return NextResponse.json(
      {
        data: {
          id: created._id.toString(),
          slug: created.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Products POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
