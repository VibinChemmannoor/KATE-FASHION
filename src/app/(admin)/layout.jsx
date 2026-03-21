import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * @param {{ children: React.ReactNode }} props
 */
export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      <aside className="w-64 bg-white border-r border-[#F5F0E6] px-6 py-8 flex flex-col gap-8">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B4F3B]/60">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-4 text-sm font-semibold text-[#6B4F3B]">
          <Link href="/admin/dashboard" className="hover:text-[#EC7F13] transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-[#EC7F13] transition-colors">
            Products
          </Link>
          <Link href="/admin/categories" className="hover:text-[#EC7F13] transition-colors">
            Categories
          </Link>
        </nav>
      </aside>
      <main className="flex-1 px-8 py-10">{children}</main>
    </div>
  );
}
