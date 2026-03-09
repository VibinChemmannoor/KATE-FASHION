import Link from 'next/link';

export function PriceDetails({ 
  orderValue, 
  deliveryFee = 100, 
  discount = 50, 
  totalItems,
  onPrimaryAction,
  primaryActionText = "CONTINUE TO CHECKOUT",
  showSignIn = true,
  isCheckoutPage = false
}) {
  const total = orderValue + deliveryFee - discount;

  return (
    <div className="bg-white border border-[#EAE4DD] rounded-xl p-6 md:p-8 flex flex-col w-full h-auto sticky top-24">
      {/* Header */}
      <h3 className="text-sm font-bold tracking-[0.05em] text-[#4A3525] uppercase mb-6">
        {isCheckoutPage ? 'ORDER SUMMARY' : 'PRICE DETAILS'}
      </h3>

      {/* Row: Order Value */}
      <div className="flex justify-between items-center mb-4 text-sm font-sans text-[#6B4F3B]">
        <span>{isCheckoutPage ? `Price (${totalItems} items)` : 'Order Value'}</span>
        <span className="font-medium text-[#4A3525]">₹{orderValue.toFixed(2)}</span>
      </div>

      {/* Row: Delivery Fee */}
      <div className="flex justify-between items-center mb-4 text-sm font-sans text-[#6B4F3B]">
        <span>{isCheckoutPage ? 'Shipping' : 'Delivery Fee'}</span>
        <span className="font-medium text-[#4CAF50]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
      </div>

      {/* Row: Discount */}
      <div className="flex justify-between items-center mb-6 text-sm font-sans text-[#6B4F3B]">
        <span>Discount</span>
        <span className="font-medium text-[#4CAF50]">- ₹{discount.toFixed(2)}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-[#EAE4DD] mb-6"></div>

      {/* Total Area */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-base font-bold text-[#1a1b26]">TOTAL</span>
        <span className="text-xl font-bold font-serif text-[#1a1b26]">₹{total.toFixed(2)}</span>
      </div>

      {/* Savings Callout only for checkout page */}
      {isCheckoutPage && (
        <div className="bg-[#E8F5E9] text-[#2E7D32] px-4 py-3 rounded-lg text-xs font-medium text-center mb-6">
           <span className="inline-block mr-1">✓</span> You will save ₹{discount.toFixed(2)} on this order
        </div>
      )}

      {/* Primary Action */}
      <button 
        onClick={onPrimaryAction}
        className="w-full bg-[#C89B3C] hover:bg-[#B38A34] text-white font-bold text-sm tracking-wider py-4 rounded transition-colors"
      >
        {primaryActionText}
      </button>

      {/* Conditional Sign In */}
      {showSignIn && (
        <button className="w-full bg-white border border-[#1a1b26] text-[#1a1b26] font-bold text-sm tracking-wider py-4 rounded hover:bg-[#FDFBF7] transition-colors mt-4">
          SIGN IN
        </button>
      )}

      {/* Trust Badges section for Cart vs Checkout */}
      {isCheckoutPage ? (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-[#6B4F3B]/70 font-sans">
             <span className="text-[#6B4F3B]">✓</span> Secure Payment & Data Protection
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B4F3B]/70 font-sans">
             <span className="text-[#6B4F3B]">↺</span> 30 Days Easy Return Policy
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-2 justify-center pb-6 border-b border-[#EAE4DD]">
             {/* Payment Icons Placeholders */}
             <div className="w-8 h-5 bg-[#EAE4DD] rounded"></div>
             <div className="w-8 h-5 bg-[#6B4F3B]/30 rounded"></div>
             <div className="w-8 h-5 bg-[#C89B3C]/50 rounded"></div>
             <div className="w-10 h-5 border border-[#EAE4DD] rounded-full flex gap-0.5 items-center justify-center p-0.5">
               <div className="w-3 h-3 rounded-full border border-[#EAE4DD]"></div>
               <div className="w-3 h-3 rounded-full border border-[#EAE4DD] -ml-1.5"></div>
             </div>
          </div>
          <p className="text-[10px] text-[#6B4F3B]/60 text-center leading-relaxed">
            15 days return policy is available <a href="#" className="underline hover:text-[#D47112]">terms & conditions</a><br />
            Need help? In the our <a href="#" className="underline hover:text-[#D47112]">Customer Support</a> is available.
          </p>
        </div>
      )}
    </div>
  );
}
