import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Address } from "@/lib/db/models/Address";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const updateAddressSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(15).optional(),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().min(5).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
  state: z.string().optional(),
  pincode: z.string().min(4).max(10).optional(),
  isDefault: z.boolean().optional(),
  label: z.enum(["home", "work", "other"]).optional(),
});

/**
 * PUT /api/addresses/:id — Update address
 * @param {Request} request
 * @param {{ params: { id: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, updateAddressSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const address = await Address.findOne({ _id: id, userId: user.id });
    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    if (validated.data.isDefault) {
      await Address.updateMany(
        { userId: user.id, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }

    Object.assign(address, validated.data);
    await address.save();

    return NextResponse.json({ message: "Address updated" });
  } catch (error) {
    console.error("[Address PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/addresses/:id — Delete address
 * @param {Request} request
 * @param {{ params: { id: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const result = await Address.deleteOne({ _id: id, userId: user.id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("[Address DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
