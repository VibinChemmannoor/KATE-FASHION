import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";

/**
 * GET /api/categories — List all active categories
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
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
