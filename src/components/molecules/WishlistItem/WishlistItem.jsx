import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";

export function WishlistItem({ item, onRemove, onAddToCart }) {
  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div
        className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 ${item.bgColor || "bg-[#FDFBF7]"}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#6B4F3B]/40 font-serif italic text-sm text-center px-4">
            {item.imageAlt || "Product Image"}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center text-[#6B4F3B] hover:text-[#EC7F13] shadow-sm transition-colors z-10"
          aria-label="Remove from wishlist"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Badges */}
        {item.badge && (
          <span
            className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.badge === "SALE" ? "bg-[#EC7F13]" : "bg-[#412B1F]"}`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-base font-serif font-bold text-[#4A3525] truncate mr-2">{item.name}</h3>
        <div className="flex flex-col items-end">
          <span
            className={`text-sm font-bold ${item.salePrice ? "text-[#EC7F13]" : "text-[#4A3525]"}`}
          >
            {item.salePrice || item.price}
          </span>
          {item.salePrice && (
            <span className="text-xs text-[#6B4F3B]/50 line-through">{item.price}</span>
          )}
        </div>
      </div>

      <p className="text-xs font-sans text-[#6B4F3B]/60 mb-4">{item.material}</p>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(item)}
        className="w-full flex items-center justify-center gap-2 border border-[#E5D5C1] rounded-lg py-3 text-sm font-semibold text-[#A4550A] hover:border-[#A4550A] hover:bg-[#FDFBF7] transition-all"
      >
        <ShoppingBag size={16} />
        Add to Cart
      </button>
    </div>
  );
}
