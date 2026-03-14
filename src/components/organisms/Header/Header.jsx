"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut, UserRound } from "lucide-react";

import { AuthLoginPage } from "@/components/templates/AuthLoginPage/AuthLoginPage";
import { AuthRegisterPage } from "@/components/templates/AuthRegisterPage/AuthRegisterPage";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const itemCount = useCartStore((state) => state.itemCount);
  const { isAuthenticated, user, logout, fetchUser, setUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData || null);
    setAuthModal(null);
  };

  const openLoginModal = () => setAuthModal("login");
  const openRegisterModal = () => setAuthModal("register");
  const closeAuthModal = () => setAuthModal(null);

  const handleRegisterSuccess = () => {
    setAuthModal("login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFBF7] border-b border-[#F5F0E6] shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>

        <Link href="/" className="text-3xl font-serif font-bold text-[#A4550A] tracking-wider">
          KATE
        </Link>

        <nav className="hidden md:flex items-center space-x-10">
          <Link
            href="/products"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            PRODUCTS
          </Link>
          <Link
            href="/category/boys"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            BOYS
          </Link>
          <Link
            href="/category/girls"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            GIRLS
          </Link>
          <Link
            href="/category/newborn"
            className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors"
          >
            NEWBORN
          </Link>
        </nav>

        <div className="flex items-center space-x-6 text-[#6B4F3B]">
          <button
            aria-label="Search"
            className="hover:text-[#EC7F13] transition-colors hidden sm:block"
          >
            <Search size={22} strokeWidth={1.5} />
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button
                aria-label="Profile"
                className="hover:text-[#EC7F13] transition-colors"
              >
                <UserRound size={22} strokeWidth={1.5} />
              </button>
              <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-[#EAE4DD] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-4 border-b border-[#F5F0E6]">
                  <p className="text-sm font-semibold text-[#4A3525] truncate">{user?.username}</p>
                  <p className="text-xs text-[#6B4F3B]/70 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2.5 text-sm text-[#6B4F3B] hover:bg-[#FAF9F6] hover:text-[#EC7F13]"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#6B4F3B] hover:bg-[#FAF9F6] hover:text-[#C15C5C] flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Account"
              onClick={openLoginModal}
              className="hover:text-[#EC7F13] transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
            </button>
          )}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hover:text-[#EC7F13] transition-colors"
          >
            <Heart size={22} strokeWidth={1.5} />
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative hover:text-[#EC7F13] transition-colors">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#B5651D] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#F5F0E6] bg-[#FDFBF7]">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors py-2"
            >
              PRODUCTS
            </Link>
            <Link
              href="/category/boys"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors py-2"
            >
              BOYS
            </Link>
            <Link
              href="/category/girls"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors py-2"
            >
              GIRLS
            </Link>
            <Link
              href="/category/newborn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wider text-[#6B4F3B] hover:text-[#EC7F13] transition-colors py-2"
            >
              NEWBORN
            </Link>
          </nav>
        </div>
      )}

      <AuthLoginPage
        isOpen={authModal === "login"}
        onClose={closeAuthModal}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={openRegisterModal}
      />
      <AuthRegisterPage
        isOpen={authModal === "register"}
        onClose={closeAuthModal}
        onRegistered={handleRegisterSuccess}
        onSwitchToLogin={openLoginModal}
      />
    </header>
  );
}
