"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CartItem } from "@/components/molecules/CartItem";
import { PriceDetails } from "@/components/molecules/PriceDetails";

const INITIAL_CART = [
  {
    id: 1,
    name: "Elegant brown girl dress",
    color: "Brown",
    size: "0-6 months",
    price: 500.0,
    quantity: 1,
    bgColor: "bg-[#5C7F59]",
    imageAlt: "Green Bottle Product",
  },
  {
    id: 2,
    name: "Blue coat design",
    color: "Light Blue",
    size: "1-2 years",
    price: 500.0,
    quantity: 2,
    bgColor: "bg-[#99A891]",
    imageAlt: "White Bottle Product",
  },
];

const SIMILAR_ITEMS = [
  {
    id: 1,
    name: "Design 1",
    brand: "KATERI",
    price: 500.0,
    bgColor: "bg-[#F2F2F2]",
    imageAlt: "Minimal Tube",
  },
  {
    id: 2,
    name: "Designers",
    brand: "NEW",
    price: 1000.0,
    bgColor: "bg-[#E6E6E6]",
    imageAlt: "Woman in Sweater",
  },
  {
    id: 3,
    name: "Dress Blue",
    brand: "TIARA",
    price: 400.0,
    bgColor: "bg-[#F2F2F2]",
    imageAlt: "Yellow Label Jar",
  },
  {
    id: 4,
    name: "Designeds",
    brand: "NEW",
    price: 2500.0,
    bgColor: "bg-[#D2DBD8]",
    imageAlt: "Woman holding paper",
  },
];

export function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const deliveryFee = 100;
  const discountAmount = 50;

  const orderValue = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleUpdateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleDelete = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFavorite = (id) => {
    console.log("Saved item to wishlist:", id);
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

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
          <span className="text-xl text-[#6B4F3B]/50 font-normal">({cartItems.length} Items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="py-12 border border-dashed border-[#EAE4DD] rounded-xl text-center">
                <p className="text-[#6B4F3B]/70 mb-4 font-sans max-w-md mx-auto">
                  Your shopping cart is empty. Add items to proceed.
                </p>
                <Link
                  href="/collections"
                  className="inline-block bg-[#1a1b26] text-white px-8 py-3 rounded text-sm font-bold tracking-wider hover:bg-[#4A3525] transition-colors"
                >
                  BROWSE STORE
                </Link>
              </div>
            ) : (
              <div className="flex flex-col border-t border-[#F5F0E6]">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onDelete={handleDelete}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="w-full lg:w-[400px] flex-shrink-0">
              <PriceDetails
                orderValue={orderValue}
                deliveryFee={deliveryFee}
                discount={discountAmount}
                totalItems={totalItems}
                onPrimaryAction={handleProceedToCheckout}
                primaryActionText="CONTINUE TO CHECKOUT"
                showSignIn={true}
                isCheckoutPage={false}
              />
            </div>
          )}
        </div>

        <div className="mt-24 mb-16 border-t border-[#F5F0E6] pt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-serif text-[#1a1b26]">Similar Items</h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-[#EAE4DD] flex items-center justify-center text-[#6B4F3B] hover:border-[#1a1b26] hover:text-[#1a1b26] transition-colors bg-white">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#EAE4DD] flex items-center justify-center text-[#6B4F3B] hover:border-[#1a1b26] hover:text-[#1a1b26] transition-colors bg-white">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {SIMILAR_ITEMS.map((item) => (
              <div key={item.id} className="group cursor-pointer flex flex-col">
                <div
                  className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 ${item.bgColor}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-[#6B4F3B]/30 font-serif italic text-sm text-center">
                      {item.imageAlt}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold tracking-[0.2em] text-[#D47112] uppercase mb-1">
                  {item.brand}
                </span>
                <h3 className="text-sm font-bold font-sans text-[#4A3525] group-hover:text-[#D47112] transition-colors mb-1">
                  {item.name}
                </h3>
                <p className="text-sm font-bold font-serif text-[#1a1b26]">INR {item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
