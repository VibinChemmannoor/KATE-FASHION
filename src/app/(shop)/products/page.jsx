import { ProductsPage } from "@/components/templates/ProductsPage/ProductsPage";

export const revalidate = 1800;

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "All Products | KATERI",
    description: "Browse all baby girl dresses and essentials from KATERI.",
    alternates: { canonical: "https://yourdomain.com/products" },
  };
}

export default function ProductsRoutePage() {
  return <ProductsPage />;
}
