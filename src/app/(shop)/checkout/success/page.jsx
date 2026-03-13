"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={40} className="text-[#4CAF50]" />
      </div>

      <h1 className="text-3xl font-bold font-serif text-[#1a1b26] mb-4">
        Order Confirmed!
      </h1>

      <p className="text-[#6B4F3B]/70 font-sans mb-2">
        Thank you for shopping with KATE FASHION
      </p>

      {orderNumber && (
        <div className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-xl p-6 my-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#6B4F3B]/60 uppercase mb-2">
            Order Number
          </p>
          <p className="text-2xl font-bold font-serif text-[#1a1b26]">
            {orderNumber}
          </p>
        </div>
      )}

      <div className="space-y-3 text-sm text-[#6B4F3B]/70 font-sans mb-10">
        <div className="flex items-center justify-center gap-2">
          <Package size={16} className="text-[#EF831D]" />
          <span>You will receive an order confirmation email shortly</span>
        </div>
        <p>Your items will be shipped within 2-3 business days</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="inline-flex items-center justify-center gap-2 bg-[#1a1b26] text-white font-bold text-sm tracking-wider px-8 py-4 rounded hover:bg-[#4A3525] transition-colors"
          >
            VIEW ORDER
            <ArrowRight size={16} />
          </Link>
        )}
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 bg-white border border-[#1a1b26] text-[#1a1b26] font-bold text-sm tracking-wider px-8 py-4 rounded hover:bg-[#FDFBF7] transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center py-16">
            <p className="text-[#6B4F3B]/50 font-sans">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
