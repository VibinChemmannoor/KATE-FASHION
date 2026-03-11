import { CheckoutPage } from "@/components/templates/CheckoutPage/CheckoutPage";

export const dynamic = "force-dynamic";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "Checkout | KATERI",
    description: "Secure checkout for your KATERI order.",
    robots: { index: false, follow: false },
  };
}

export default function CheckoutRoutePage() {
  return <CheckoutPage />;
}
