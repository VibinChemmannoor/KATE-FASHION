import Link from "next/link";

/**
 * @returns {JSX.Element}
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-[#F5F0E6] rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-[#4A3525] mb-3">Admin Dashboard</h1>
        <p className="text-sm text-[#6B4F3B]/70 max-w-2xl">
          Manage products, categories, and merchandising content. Changes here update the
          storefront immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/products"
          className="bg-white border border-[#F5F0E6] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-serif font-bold text-[#4A3525] mb-2">Manage Products</h2>
          <p className="text-sm text-[#6B4F3B]/70">Create, update, and organize your catalog.</p>
        </Link>
        <Link
          href="/admin/categories"
          className="bg-white border border-[#F5F0E6] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-serif font-bold text-[#4A3525] mb-2">Manage Categories</h2>
          <p className="text-sm text-[#6B4F3B]/70">Keep category navigation up to date.</p>
        </Link>
      </div>
    </div>
  );
}
