import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { Cart } from "@/lib/db/models/Cart";
import { Product } from "@/lib/db/models/Product";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getPaymentProvider } from "@/lib/payment/payment.factory";
import { sanitizeInput } from "@/lib/security/sanitize";
import { validateSchema } from "@/lib/utils/validation";

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

/**
 * POST /api/payment/razorpay/verify — Verify payment and complete order
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
    const validated = validateSchema(sanitized, verifySchema);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      validated.data;

    const provider = getPaymentProvider("razorpay");
    const isValid = provider.verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      console.warn("[Payment Fraud Attempt]", {
        razorpayOrderId,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findOne({
      razorpayOrderId,
      userId: user.id,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.status = "PAID";
    order.paidAt = new Date();
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    await Cart.deleteOne({ userId: user.id });

    return NextResponse.json({
      data: {
        success: true,
        orderNumber: order.orderNumber,
        orderId: order._id.toString(),
      },
    });
  } catch (error) {
    console.error("[Razorpay Verify]", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
