"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";

export function CartItem({ item, onUpdateQuantity, onDelete, onFavorite }) {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-[#F5F0E6] gap-6 last:border-0 relative">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex-shrink-0 relative overflow-hidden bg-[#F2EDEA]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="text-[#6B4F3B]/30 font-serif italic text-xs text-center">
              {item.name}
            </span>
          </div>
        )}
        {item.badge && (
          <span className="absolute top-2 left-2 bg-[#EF831D] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col pt-1">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#D47112] uppercase mb-1">
          KATE FASHION
        </span>
        <h3 className="text-lg font-bold font-serif text-[#1a1b26] mb-2">
          {item.name}
        </h3>
        {item.color && (
          <p className="text-sm font-sans text-[#6B4F3B]/80 mb-1">
            Color: {item.color}
          </p>
        )}
        {item.size && (
          <p className="text-sm font-sans text-[#6B4F3B]/80 mb-4">
            Size: {item.size}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto w-full">
          <div className="flex items-center border border-[#EAE4DD] rounded divide-x divide-[#EAE4DD] bg-white h-9">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-9 h-full flex items-center justify-center text-[#6B4F3B] hover:text-[#D47112] hover:bg-[#FDFBF7] disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 h-full flex items-center justify-center text-sm font-bold font-sans text-[#4A3525]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-9 h-full flex items-center justify-center text-[#6B4F3B] hover:text-[#D47112] hover:bg-[#FDFBF7]"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col md:absolute md:right-0 md:top-6 items-end gap-2 text-right">
            <button
              onClick={() => onFavorite(item.id)}
              className="text-sm text-[#6B4F3B] hover:text-[#D47112] font-sans"
            >
              favorite
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-sm text-[#6B4F3B] hover:text-[#C15C5C] font-sans"
            >
              delete
            </button>
          </div>

          <div className="md:absolute md:right-0 md:bottom-6 text-xl font-bold font-serif text-[#4A3525]">
            &#8377;{itemTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
