import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * GET /api/orders/:id — Get single order details
 * @param {Request} request
 * @param {{ params: { id: string } }} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const order = await Order.findOne({ _id: id, userId: user.id }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        items: order.items.map((item) => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        status: order.status,
        paymentProvider: order.paymentProvider,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        deliveryType: order.deliveryType,
        notes: order.notes,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("[Order Detail GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
