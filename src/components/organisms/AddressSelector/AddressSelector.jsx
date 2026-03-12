import { Plus, Home, Edit2, Truck } from "lucide-react";

export function AddressSelector({ addresses, onAddNew, onProceedToPayment }) {
  // Assume the first address is selected for this mock
  const selectedId = addresses.length > 0 ? addresses[0].id : null;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold font-serif text-[#1a1b26] mb-2 tracking-tight">
        Select Shipping Address
      </h2>
      <p className="text-sm font-sans text-[#6B4F3B]/70 mb-8">
        Choose your delivery destination or add a new one.
      </p>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Saved Addresses */}
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedId;
          return (
            <div
              key={addr.id}
              className={`relative border-2 rounded-xl p-6 transition-all ${
                isSelected
                  ? "border-[#EF831D] bg-white"
                  : "border-[#EAE4DD] bg-[#FAF9F6] hover:border-[#D47112]/50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FDF0DF] text-[#EF831D] flex items-center justify-center shrink-0">
                    <Home size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-sans text-[#4A3525] leading-tight">
                      {addr.fullName}
                    </h3>
                    <p className="text-xs font-bold text-[#6B4F3B]/60 uppercase tracking-widest mt-1">
                      Home Address
                    </p>
                  </div>
                </div>
                {addr.isDefault && (
                  <span className="bg-[#EF831D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>

              <div className="text-sm font-sans text-[#6B4F3B] leading-relaxed mb-6 ml-13">
                <p>{addr.street}</p>
                <p>
                  {addr.town}, {addr.pincode}
                </p>
                <p className="mt-2 flex items-center gap-2">📞 {addr.phone}</p>
              </div>

              {isSelected && (
                <div className="flex items-center gap-3 mt-auto">
                  <button className="flex-1 bg-[#EF831D] hover:bg-[#D47112] text-white font-bold text-sm tracking-wider py-3 rounded transition-colors shadow-sm">
                    Deliver Here
                  </button>
                  <button className="w-11 h-11 border border-[#EAE4DD] rounded flex items-center justify-center text-[#6B4F3B] hover:text-[#EF831D] hover:border-[#EF831D] transition-colors">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Address Card */}
        <button
          onClick={onAddNew}
          className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[#EAE4DD] rounded-xl p-8 hover:bg-[#FAF9F6] hover:border-[#D47112]/50 transition-all text-center min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-white border border-[#EAE4DD] flex items-center justify-center text-[#6B4F3B] shadow-sm">
            <Plus size={20} />
          </div>
          <div>
            <span className="block text-sm font-bold font-sans text-[#4A3525] mb-1">
              Add New Address
            </span>
            <span className="text-xs font-sans text-[#6B4F3B]/60">
              For gifts or secondary locations
            </span>
          </div>
        </button>
      </div>

      {/* Delivery Preferences */}
      <h3 className="text-sm font-bold font-sans text-[#4A3525] flex items-center gap-2 mb-4 shrink-0">
        <Truck size={16} className="text-[#EF831D]" />
        Delivery Preferences
      </h3>
      <div className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard */}
        <div className="border border-[#EF831D] bg-white rounded-lg p-4 cursor-pointer">
          <p className="text-sm font-bold font-sans text-[#4A3525] mb-1">Standard Delivery</p>
          <p className="text-xs font-sans text-[#6B4F3B]/60">3-5 Business Days • Free</p>
        </div>
        {/* Express */}
        <div className="border border-[#EAE4DD] bg-white rounded-lg p-4 cursor-pointer hover:border-[#D47112]/30 transition-colors">
          <p className="text-sm font-bold font-sans text-[#4A3525] mb-1">Express Delivery</p>
          <p className="text-xs font-sans text-[#6B4F3B]/60">Next Day • $12.99</p>
        </div>
      </div>
    </div>
  );
}
