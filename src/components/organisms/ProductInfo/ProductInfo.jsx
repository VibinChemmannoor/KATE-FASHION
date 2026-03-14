"use client";

import { useState } from "react";
import { Heart, ShoppingBag, ShieldCheck, Truck, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils/format";

export function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const showToast = useUiStore((state) => state.showToast);

  const isWishlisted = product.id ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }
    setIsAddingToCart(true);
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
      showToast("Added to bag!", "success");
    } catch (err) {
      showToast(err.message || "Failed to add to bag", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        showToast("Removed from wishlist", "success");
      } else {
        await addToWishlist(product.id);
        showToast("Added to wishlist!", "success");
      }
    } catch {
      showToast("Please login to use wishlist", "error");
    }
  };

  return (
    <div className="flex flex-col h-full py-4 md:py-0 md:px-8 lg:px-12">
      {/* Label */}
      <div className="mb-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#A4550A] uppercase">
          New Collection
        </span>
      </div>

      {/* Title & Price */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3525] mb-4 leading-[1.1]">
        {product.name}
      </h1>
      <p className="text-xl text-[#6B4F3B] font-serif mb-6">{formatPrice(product.price)}</p>

      {/* Description */}
      <p className="text-sm font-sans text-[#6B4F3B]/80 leading-relaxed mb-10 max-w-lg">
        {product.description}
      </p>

      {/* Color Selection */}
      <div className="mb-8">
        <p className="text-xs font-bold font-sans text-[#4A3525] uppercase tracking-wider mb-3">
          Color: <span className="text-[#6B4F3B]/70">{selectedColor}</span>
        </p>
        <div className="flex gap-3">
          {(product.colors || []).map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                selectedColor === color.name ? "border-[#A4550A] p-[2px]" : "border-transparent"
              }`}
              aria-label={`Select color ${color.name}`}
            >
              <span
                className={`block w-full h-full rounded-full border border-black/10 shadow-sm ${color.swatchClass}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold font-sans text-[#4A3525] uppercase tracking-wider">
            Select Size
          </p>
          <button className="text-[10px] font-bold text-[#A4550A] uppercase tracking-wider hover:underline">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(product.sizes || []).map((sizeObj) => {
            const isOutOfStock = sizeObj.stock === 0;
            const isSelected = selectedSize === sizeObj.size;

            return (
              <button
                key={sizeObj.size}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(sizeObj.size)}
                className={`
                  py-3 text-xs font-bold font-sans border transition-all
                  ${
                    isOutOfStock
                      ? "border-[#EAE4DD] text-[#6B4F3B]/30 cursor-not-allowed bg-[#FDFBF7]/50 line-through"
                      : isSelected
                        ? "border-[#4A3525] bg-[#4A3525] text-white"
                        : "border-[#EAE4DD] text-[#4A3525] hover:border-[#6B4F3B] bg-white"
                  }
                `}
              >
                {sizeObj.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mb-12">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-[#C89B3C] text-white font-bold font-sans py-4 rounded hover:bg-[#B38A34] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <ShoppingBag size={18} />
          {isAddingToCart ? "Adding..." : "Add to Bag"}
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`w-full bg-white border font-bold font-sans py-4 rounded transition-colors flex items-center justify-center gap-2 ${
            isWishlisted
              ? "border-[#A4550A] text-[#A4550A]"
              : "border-[#EAE4DD] text-[#4A3525] hover:border-[#6B4F3B]"
          }`}
        >
          <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-3 gap-4 py-8 border-t border-[#F5F0E6]">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <Leaf size={24} className="text-[#A4550A]" strokeWidth={1.5} />
          <span className="text-[10px] font-bold font-sans text-[#6B4F3B] uppercase tracking-wider">
            100% Organic
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <Truck size={24} className="text-[#A4550A]" strokeWidth={1.5} />
          <span className="text-[10px] font-bold font-sans text-[#6B4F3B] uppercase tracking-wider">
            Free Shipping
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2">
          <ShieldCheck size={24} className="text-[#A4550A]" strokeWidth={1.5} />
          <span className="text-[10px] font-bold font-sans text-[#6B4F3B] uppercase tracking-wider">
            Ethical
          </span>
        </div>
      </div>
    </div>
  );
}
