import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { Cart } from "@/lib/db/models/Cart";
import { Product } from "@/lib/db/models/Product";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";
import { generateOrderNumber } from "@/lib/utils/format";
import { rateLimit } from "@/lib/security/rateLimit";

const SHIPPING_FEE_STANDARD = 100;
const SHIPPING_FEE_EXPRESS = 250;
const FREE_SHIPPING_THRESHOLD = 1499;

const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().or(z.literal("")),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().optional().default(""),
    pincode: z.string().min(4),
    country: z.string().optional().default("India"),
  }),
  deliveryType: z.enum(["standard", "express"]).default("standard"),
  notes: z.string().max(500).optional().default(""),
});

/**
 * GET /api/orders — Get user's order history
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = orders.map((o) => ({
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      items: o.items.map((item) => ({
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      })),
      status: o.status,
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      discount: o.discount,
      totalAmount: o.totalAmount,
      deliveryType: o.deliveryType,
      shippingAddress: o.shippingAddress,
      paidAt: o.paidAt,
      createdAt: o.createdAt,
    }));

    return NextResponse.json({ data: serialized });
  } catch (error) {
    console.error("[Orders GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders — Create order from cart (prepares for payment)
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const limit = await rateLimit(request, { max: 5, window: "1m" });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const sanitized = sanitizeInput(body);
    const validated = validateSchema(sanitized, createOrderSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ userId: user.id })
      .populate({
        path: "items.productId",
        select: "name price stock images isActive",
      })
      .lean();

    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      if (!item.productId || !item.productId.isActive) {
        return NextResponse.json(
          { error: `Product "${item.productId?.name || "unknown"}" is no longer available` },
          { status: 400 }
        );
      }

      if (item.productId.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.productId.name}"` },
          { status: 400 }
        );
      }

      const linePrice = item.productId.price * item.quantity;
      subtotal += linePrice;

      orderItems.push({
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.images?.[0]?.url || "",
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.productId.price,
      });
    }

    const shippingFee =
      subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : validated.data.deliveryType === "express"
          ? SHIPPING_FEE_EXPRESS
          : SHIPPING_FEE_STANDARD;

    const totalAmount = subtotal + shippingFee;

    const order = await Order.create({
      userId: user.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      subtotal,
      shippingFee,
      discount: 0,
      totalAmount,
      shippingAddress: validated.data.shippingAddress,
      deliveryType: validated.data.deliveryType,
      notes: validated.data.notes,
      status: "PENDING",
    });

    return NextResponse.json(
      {
        data: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          subtotal,
          shippingFee,
          totalAmount,
          currency: "INR",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Orders POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
