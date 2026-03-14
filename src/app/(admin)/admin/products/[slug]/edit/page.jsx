import { AdminProductFormPage } from "@/components/templates/AdminProductFormPage/AdminProductFormPage";

/**
 * @param {{ params: { slug: string } }} props
 * @returns {JSX.Element}
 */
export default function AdminProductEditPage({ params }) {
  return <AdminProductFormPage mode="edit" slug={params.slug} />;
}
