import Razorpay from "razorpay";
import { createHmac } from "crypto";

let razorpayInstance = null;

/**
 * Get Razorpay SDK instance (singleton)
 * @returns {Razorpay}
 */
function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export class RazorpayProvider {
  /**
   * Create a Razorpay order — SERVER SIDE ONLY
   * @param {{ amount: number, currency: string, receipt: string }} options
   * @returns {Promise<Object>}
   */
  async createOrder({ amount, currency = "INR", receipt }) {
    const razorpay = getRazorpayInstance();
    return razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      payment_capture: 1,
    });
  }

  /**
   * Verify payment signature — ALWAYS verify before fulfillment
   * @param {{ orderId: string, paymentId: string, signature: string }} params
   * @returns {boolean}
   */
  verifySignature({ orderId, paymentId, signature }) {
    const body = `${orderId}|${paymentId}`;
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    return expected === signature;
  }

  /**
   * Verify webhook signature
   * @param {string} body - Raw request body string
   * @param {string} signature - X-Razorpay-Signature header
   * @returns {boolean}
   */
  verifyWebhook(body, signature) {
    const expected = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");
    return expected === signature;
  }
}
