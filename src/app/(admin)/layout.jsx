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
    <div className="min-h-screen bg-[#FDFBF7]">
      <header className="border-b border-[#F5F0E6] bg-white">
        <div className="container mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold text-[#A4550A]">
            KATE Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold tracking-wider text-[#6B4F3B]">
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
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 py-10">{children}</main>
    </div>
  );
}
