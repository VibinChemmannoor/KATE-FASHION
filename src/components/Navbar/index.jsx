"use client";
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-kate-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="text-3xl font-serif font-bold tracking-tighter text-kate-dark">
            KATE
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-10 text-sm uppercase tracking-widest font-medium">
            <Link href="/" className="hover:text-kate-medium transition">Home</Link>
            <Link href="/about" className="hover:text-kate-medium transition">About Us</Link>
            <Link href="/products" className="hover:text-kate-medium transition">Products</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5 text-gray-700">
            <Search className="w-5 h-5 cursor-pointer hover:text-kate-medium" />
            <Link href="/account"><User className="w-5 h-5" /></Link>
            <Link href="/wishlist"><Heart className="w-5 h-5" /></Link>
            <Link href="/cart" className="relative group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-kate-dark text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <Menu className="md:hidden w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
} 