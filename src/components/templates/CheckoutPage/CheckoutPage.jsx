"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AddressForm } from "@/components/organisms/AddressForm";
import { AddressSelector } from "@/components/organisms/AddressSelector";
import { PriceDetails } from "@/components/molecules/PriceDetails";

export function CheckoutPage() {
  const [view, setView] = useState("form");
  const [addresses, setAddresses] = useState([]);

  const orderValue = 124.0;
  const deliveryFee = 0;
  const discountAmount = 12.4;
  const totalItems = 3;

  const handleAddAddress = (newAddress) => {
    setAddresses((prev) => [...prev, { ...newAddress, id: Date.now() }]);
    setView("selector");
  };

  const handleAddNewFromSelector = () => {
    setView("form");
  };

  const handleProceedToPayment = () => {
    alert("Proceeding to payment gateway...");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
        <div className="flex items-center text-xs text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/cart" className="hover:text-[#EF831D]">
            Cart
          </Link>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span className="text-[#1a1b26] font-bold">Shipping Address</span>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span className="opacity-50">Payment</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative items-start">
          <div className="flex-1 w-full max-w-3xl">
            {view === "form" ? (
              <AddressForm onAddAddress={handleAddAddress} />
            ) : (
              <AddressSelector addresses={addresses} onAddNew={handleAddNewFromSelector} />
            )}
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0">
            <PriceDetails
              orderValue={orderValue}
              deliveryFee={deliveryFee}
              discount={discountAmount}
              totalItems={totalItems}
              onPrimaryAction={handleProceedToPayment}
              primaryActionText="PROCEED TO PAYMENT"
              showSignIn={false}
              isCheckoutPage={true}
            />

            {view === "selector" && (
              <div className="mt-6 flex items-center justify-between border border-[#EAE4DD] bg-[#FAF9F6] rounded-lg p-5 cursor-pointer hover:border-[#EF831D]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#FDF0DF] rounded text-[#EF831D]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="8" width="18" height="14" rx="2"></rect>
                      <path d="M12 5a3 3 0 1 0-3 3"></path>
                      <path d="M15 8a3 3 0 1 0-3-3"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-sans text-[#4A3525] mb-0.5">
                      APPLY COUPON
                    </h4>
                    <p className="text-[10px] font-sans text-[#6B4F3B]/60 uppercase tracking-widest">
                      Check for available offers
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#EF831D]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
