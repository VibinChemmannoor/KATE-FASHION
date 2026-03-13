import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPaymentProvider } from "@/lib/payment/payment.factory";
import { rateLimit } from "@/lib/security/rateLimit";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const createPaymentSchema = z.object({
  orderId: z.string().min(1),
});

/**
 * POST /api/payment/razorpay/create-order — Create Razorpay payment order
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
    const validated = validateSchema(sanitized, createPaymentSchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOne({
      _id: validated.data.orderId,
      userId: user.id,
      status: "PENDING",
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const provider = getPaymentProvider("razorpay");
    const razorpayOrder = await provider.createOrder({
      amount: order.totalAmount,
      receipt: order.orderNumber,
    });

    order.razorpayOrderId = razorpayOrder.id;
    order.paymentProvider = "razorpay";
    await order.save();

    return NextResponse.json({
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderNumber: order.orderNumber,
        prefill: {
          name: order.shippingAddress.fullName,
          email: order.shippingAddress.email || user.email,
          contact: order.shippingAddress.phone,
        },
      },
    });
  } catch (error) {
    console.error("[Razorpay Create Order]", error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
