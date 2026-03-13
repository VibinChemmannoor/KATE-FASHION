import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Cart } from "@/lib/db/models/Cart";
import { Product } from "@/lib/db/models/Product";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const addItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
  size: z.string().optional().default(""),
  color: z.string().optional().default(""),
});

const updateItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(10),
});

/**
 * GET /api/cart — Get current user's cart
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ userId: user.id })
      .populate({
        path: "items.productId",
        select: "name slug price comparePrice images stock sizes colors badge",
      })
      .lean();

    if (!cart || !cart.items.length) {
      return NextResponse.json({ data: { items: [], total: 0, itemCount: 0 } });
    }

    const items = cart.items
      .filter((item) => item.productId)
      .map((item) => ({
        id: item._id.toString(),
        product: {
          id: item.productId._id.toString(),
          slug: item.productId.slug,
          name: item.productId.name,
          price: item.productId.price,
          comparePrice: item.productId.comparePrice,
          image: item.productId.images?.[0]?.url || "",
          stock: item.productId.stock,
          badge: item.productId.badge,
        },
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        lineTotal: item.price * item.quantity,
      }));

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ data: { items, total, itemCount } });
  } catch (error) {
    console.error("[Cart GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart — Add item to cart
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
    const validated = validateSchema(sanitized, addItemSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(validated.data.productId).lean();
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < validated.data.quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
      cart = new Cart({ userId: user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === validated.data.productId &&
        item.size === validated.data.size &&
        item.color === validated.data.color
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += validated.data.quantity;
      if (cart.items[existingIndex].quantity > product.stock) {
        cart.items[existingIndex].quantity = product.stock;
      }
    } else {
      cart.items.push({
        productId: validated.data.productId,
        quantity: validated.data.quantity,
        size: validated.data.size,
        color: validated.data.color,
        price: product.price,
      });
    }

    await cart.save();

    return NextResponse.json(
      { message: "Item added to cart", itemCount: cart.items.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Cart POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart — Update item quantity in cart
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, updateItemSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (validated.data.quantity === 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== validated.data.productId
      );
    } else {
      const item = cart.items.find(
        (item) => item.productId.toString() === validated.data.productId
      );
      if (item) {
        item.quantity = validated.data.quantity;
      }
    }

    await cart.save();

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("[Cart PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart — Clear entire cart
 * @returns {Promise<NextResponse>}
 */
export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await Cart.deleteOne({ userId: user.id });

    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("[Cart DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
