import { CartPage } from "@/components/templates/CartPage/CartPage";

export const dynamic = "force-dynamic";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "Cart | KATERI",
    description: "Review items in your KATERI cart before checkout.",
    robots: { index: false, follow: false },
  };
}

export default function CartRoutePage() {
  return <CartPage />;
}
