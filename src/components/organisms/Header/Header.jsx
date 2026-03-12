import Link from "next/link";
import { Search, User, Heart, ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFBF7] border-b border-[#F5F0E6] shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-serif font-bold text-[#A4550A] tracking-wider">
          KATERI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link
            href="/about"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            ABOUT
          </Link>
          <Link
            href="/products"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            PRODUCTS
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            CONTACT US
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6 text-[#6B4F3B]">
          <button aria-label="Search" className="hover:text-[#EC7F13] transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <Link
            href="/login"
            aria-label="Account"
            className="hover:text-[#EC7F13] transition-colors"
          >
            <User size={22} strokeWidth={1.5} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hover:text-[#EC7F13] transition-colors"
          >
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative hover:text-[#EC7F13] transition-colors"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-[#B5651D] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
