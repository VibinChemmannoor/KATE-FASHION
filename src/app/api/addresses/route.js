import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Address } from "@/lib/db/models/Address";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(15),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().optional().default(""),
  pincode: z.string().min(4).max(10),
  country: z.string().optional().default("India"),
  isDefault: z.boolean().optional().default(false),
  label: z.enum(["home", "work", "other"]).optional().default("home"),
});

/**
 * GET /api/addresses — Get user's saved addresses
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const addresses = await Address.find({ userId: user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    const serialized = addresses.map((a) => ({
      id: a._id.toString(),
      fullName: a.fullName,
      phone: a.phone,
      email: a.email,
      street: a.street,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      country: a.country,
      isDefault: a.isDefault,
      label: a.label,
    }));

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Addresses GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/addresses — Create new address
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
    const validated = validateSchema(sanitized, addressSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    if (validated.data.isDefault) {
      await Address.updateMany(
        { userId: user.id },
        { $set: { isDefault: false } }
      );
    }

    const address = await Address.create({
      userId: user.id,
      ...validated.data,
    });

    return NextResponse.json(
      {
        data: {
          id: address._id.toString(),
          ...validated.data,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Addresses POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
