"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { CartItem } from "@/components/molecules/CartItem";
import { PriceDetails } from "@/components/molecules/PriceDetails";
import { useCart } from "@/hooks/useCart";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

export function CartPage() {
  const router = useRouter();
  const {
    items,
    total,
    itemCount,
    shippingFee,
    isLoading,
    updateQuantity,
    removeItem,
    refreshCart,
  } = useCart();

  const { addToWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleDelete = (productId) => {
    removeItem(productId);
  };

  const handleFavorite = async (productId) => {
    try {
      await addToWishlist(productId);
    } catch {
      // silently fail if not logged in
    }
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#6B4F3B]" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
        <div className="flex items-center text-xs text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/" className="hover:text-[#EC7F13]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1a1b26]">Cart</span>
        </div>

        <h1 className="text-3xl font-bold font-serif text-[#1a1b26] mb-10 flex items-baseline gap-2">
          Cart Items{" "}
          <span className="text-xl text-[#6B4F3B]/50 font-normal">
            ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
          <div className="flex-1">
            {items.length === 0 ? (
              <div className="py-12 border border-dashed border-[#EAE4DD] rounded-xl text-center">
                <p className="text-[#6B4F3B]/70 mb-4 font-sans max-w-md mx-auto">
                  Your shopping cart is empty. Add items to proceed.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-[#1a1b26] text-white px-8 py-3 rounded text-sm font-bold tracking-wider hover:bg-[#4A3525] transition-colors"
                >
                  BROWSE STORE
                </Link>
              </div>
            ) : (
              <div className="flex flex-col border-t border-[#F5F0E6]">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={{
                      id: item.product.id,
                      name: item.product.name,
                      color: item.color,
                      size: item.size,
                      price: item.price,
                      quantity: item.quantity,
                      image: item.product.image,
                      badge: item.product.badge,
                    }}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleDelete}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <PriceDetails
                orderValue={total}
                deliveryFee={shippingFee}
                discount={0}
                totalItems={itemCount}
                onPrimaryAction={handleProceedToCheckout}
                primaryActionText="CONTINUE TO CHECKOUT"
                showSignIn={!isAuthenticated}
                isCheckoutPage={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
