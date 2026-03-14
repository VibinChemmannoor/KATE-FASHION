"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { formatPrice } from "@/lib/utils/format";
import { useUiStore } from "@/store/uiStore";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useUiStore((state) => state.showToast);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products?limit=100&sort=newest");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load products");
      }
      setProducts(json.data || []);
    } catch (error) {
      showToast(error.message || "Failed to load products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete product");
      }
      showToast("Product deleted", "success");
      fetchProducts();
    } catch (error) {
      showToast(error.message || "Failed to delete product", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3525]">Products</h1>
          <p className="text-sm text-[#6B4F3B]/70">Manage your product catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#C28A5A] px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_4px_14px_rgba(194,138,90,0.35)] transition-colors hover:bg-[#B07848]"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#F5F0E6] rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#6B4F3B]/70 border-b border-[#F5F0E6]">
          <span className="col-span-2">Product</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {isLoading ? (
          <div className="px-6 py-8 text-sm text-[#6B4F3B]/70">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-8 text-sm text-[#6B4F3B]/70">No products found.</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#F5F0E6] text-sm text-[#4A3525]"
            >
              <div className="col-span-2">
                <p className="font-semibold">{product.name}</p>
                <p className="text-xs text-[#6B4F3B]/70">{product.slug}</p>
              </div>
              <span>{formatPrice(product.price)}</span>
              <span className="text-xs uppercase tracking-wider text-[#6B4F3B]/70">
                {product.stock > 0 ? "Active" : "Out of stock"}
              </span>
              <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                <Link
                  href={`/admin/products/${product.slug}/edit`}
                  className="text-[#A4550A] hover:text-[#EC7F13]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product.slug)}
                  className="text-[#C15C5C] hover:text-[#8B3F3F]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
