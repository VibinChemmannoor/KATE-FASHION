import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models/Order";
import { getPaymentProvider } from "@/lib/payment/payment.factory";

/**
 * POST /api/webhook/razorpay — Handle Razorpay webhook events
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider("razorpay");
    if (!provider.verifyWebhook(body, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    await connectToDatabase();

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        await Order.findOneAndUpdate(
          { razorpayOrderId: payment.order_id },
          {
            $set: {
              status: "PAID",
              razorpayPaymentId: payment.id,
              paidAt: new Date(),
            },
          }
        );
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        await Order.findOneAndUpdate(
          { razorpayOrderId: payment.order_id },
          { $set: { status: "CANCELLED" } }
        );
        break;
      }

      case "refund.processed": {
        const refund = event.payload.refund.entity;
        await Order.findOneAndUpdate(
          { razorpayPaymentId: refund.payment_id },
          { $set: { status: "REFUNDED" } }
        );
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Razorpay Webhook]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
