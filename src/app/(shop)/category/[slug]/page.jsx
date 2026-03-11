import { CategoryPage } from "@/components/templates/CategoryPage/CategoryPage";

export const revalidate = 1800;

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "Newborn Essentials | KATERI",
    description: "Shop newborn essentials and baby girl dresses in soft organic fabrics.",
    alternates: { canonical: "https://yourdomain.com/category/newborn-essentials" },
  };
}

export default function CategoryRoutePage() {
  return <CategoryPage />;
}
