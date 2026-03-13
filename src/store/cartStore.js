"use client";

import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/cart");
      const json = await res.json();
      if (res.ok) {
        set({
          items: json.data.items,
          total: json.data.total,
          itemCount: json.data.itemCount,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addItem: async ({ productId, quantity = 1, size = "", color = "" }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, size, color }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to add item");
      }

      await get().fetchCart();
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        throw new Error("Failed to update quantity");
      }

      await get().fetchCart();
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      await get().fetchCart();
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await fetch("/api/cart", { method: "DELETE" });
      set({ items: [], total: 0, itemCount: 0, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
