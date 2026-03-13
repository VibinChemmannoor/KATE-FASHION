import { RazorpayProvider } from "./razorpay";

const PROVIDERS = {
  razorpay: RazorpayProvider,
};

/**
 * Get the payment provider by name
 * @param {'razorpay'} provider
 * @returns {RazorpayProvider}
 */
export function getPaymentProvider(provider = "razorpay") {
  const Provider = PROVIDERS[provider];
  if (!Provider) throw new Error(`Unknown payment provider: ${provider}`);
  return new Provider();
}
