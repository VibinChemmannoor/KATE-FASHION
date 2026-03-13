"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

/**
 * Custom hook for cart operations
 * @returns {Object} Cart state and actions
 */
export function useCart() {
  const {
    items,
    total,
    itemCount,
    isLoading,
    error,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const shippingFee = total >= 1499 ? 0 : 100;
  const grandTotal = total + shippingFee;

  return {
    items,
    total,
    itemCount,
    shippingFee,
    grandTotal,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  };
}
