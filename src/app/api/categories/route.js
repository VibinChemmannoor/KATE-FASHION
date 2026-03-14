import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { AUTH_RATE_LIMIT_MAX, AUTH_RATE_LIMIT_WINDOW } from "@/lib/utils/constants";

const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  order: z.number().int().min(0).optional(),
  parentId: z.string().optional().nullable(),
});

/**
 * GET /api/categories — List all active categories
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

    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const serialized = categories.map((c) => ({
      id: c._id.toString(),
      slug: c.slug,
      name: c.name,
      description: c.description,
      image: c.image,
      order: c.order,
      parentId: c.parentId?.toString() || null,
    }));

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Categories GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories — Create category (admin only)
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

    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, categoryCreateSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const created = await Category.create({
      name: validated.data.name,
      slug: validated.data.slug,
      description: validated.data.description || "",
      image: validated.data.image || "",
      order: validated.data.order || 0,
      parentId: validated.data.parentId || null,
    });

    return NextResponse.json(
      { data: { id: created._id.toString(), slug: created.slug } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Categories POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
