"use client";

import { Share2, ShoppingCart } from "lucide-react";
import { WishlistItem } from "@/components/molecules/WishlistItem";

// Mock data matching the design
const WISHLIST_ITEMS = [
  {
    id: 1,
    name: "Organic Cotton Onesie",
    material: "Pure Sand Melange",
    price: "$45.00",
    bgColor: "bg-[#EAE4DD]",
    imageAlt: "Beige Onesie",
  },
  {
    id: 2,
    name: "Knitted Bear Bonnet",
    material: "Toasted Almond",
    price: "$32.00",
    bgColor: "bg-[#D6DCD4]",
    imageAlt: "Bear Hat",
  },
  {
    id: 3,
    name: "Velvet Trim Romper",
    material: "Deep Forest Velvet",
    price: "$58.00",
    salePrice: "$48.00",
    badge: "SALE",
    bgColor: "bg-[#F2EDEA]",
    imageAlt: "Green Romper",
  },
  {
    id: 4,
    name: "Soft Wool Booties",
    material: "Cream Wool",
    price: "$28.00",
    bgColor: "bg-[#8F745B]",
    imageAlt: "White Booties",
  },
  {
    id: 5,
    name: "Linen Jumpsuit",
    material: "Dusty Terracotta",
    price: "$65.00",
    bgColor: "bg-[#EDDECA]",
    imageAlt: "Orange Jumpsuit",
  },
  {
    id: 6,
    name: "Quilted Sleep Sack",
    material: "Pebble Grey",
    price: "$89.00",
    bgColor: "bg-[#F6F6F6]",
    imageAlt: "Grey Sleepsack",
  },
  {
    id: 7,
    name: "Silk Ribbon Headband",
    material: "Blush Rose",
    price: "$22.00",
    bgColor: "bg-[#EDEDED]",
    imageAlt: "Pink Headband",
  },
  {
    id: 8,
    name: "Cashmere Cardigan",
    material: "Charcoal Heather",
    price: "$110.00",
    bgColor: "bg-[#EBEBE8]",
    imageAlt: "Grey Cardigan",
  },
];

export function WishlistGrid() {
  const handleRemove = (id) => {
    console.log("Remove item", id);
    // Real implementation would call useWishlist hook
  };

  const handleAddToCart = (item) => {
    console.log("Add to cart", item);
    // Real implementation would call useCart hook
  };

  const handleAddAll = () => {
    console.log("Add all to bag");
  };

  return (
    <section className="container mx-auto px-4 md:px-8 py-10 md:py-16">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs font-bold uppercase tracking-widest text-[#6B4F3B]/60 mb-6 font-sans">
        <a href="/" className="hover:text-[#EC7F13] transition-colors">
          HOME
        </a>
        <span className="mx-2">/</span>
        <span className="text-[#EC7F13]">WISHLIST</span>
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1b26] mb-3 tracking-tight">
            My Favorites
          </h1>
          <p className="text-sm font-sans text-[#6B4F3B]/70 tracking-wide">
            You have <span className="font-semibold text-[#4A3525]">{WISHLIST_ITEMS.length}</span>{" "}
            timeless pieces saved in your collection.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 border border-[#E5D5C1] rounded-lg text-sm font-bold text-[#4A3525] hover:bg-[#FDFBF7] transition-all">
            <Share2 size={16} />
            Share Wishlist
          </button>

          <button
            onClick={handleAddAll}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#EE8925] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#D47112] transition-colors"
          >
            <ShoppingCart size={16} />
            Add All to Bag
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {WISHLIST_ITEMS.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
