import { redirect } from "next/navigation";

/**
 * @param {{ params: { slug: string } }} props
 * @returns {JSX.Element}
 */
export default function AdminProductEditPage({ params }) {
  redirect("/admin/products");
}
