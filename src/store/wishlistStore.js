"use client";

import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/wishlist");
      const json = await res.json();
      if (res.ok) {
        set({ items: json.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ error: null });
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to add to wishlist");
      }

      await get().fetchWishlist();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      set({
        items: get().items.filter((item) => item.product.id !== productId),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.product.id === productId);
  },
}));
