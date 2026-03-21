import { redirect } from "next/navigation";

/**
 * @returns {JSX.Element}
 */
export default function AdminProductCreatePage() {
  redirect("/admin/products");
}
