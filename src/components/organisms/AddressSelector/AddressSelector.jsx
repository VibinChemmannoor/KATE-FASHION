"use client";

import { Plus, Home, Briefcase, MapPin, Edit2, Truck } from "lucide-react";

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  deliveryType = "standard",
  onDeliveryTypeChange,
}) {
  const getLabelIcon = (label) => {
    switch (label) {
      case "work":
        return <Briefcase size={18} />;
      case "other":
        return <MapPin size={18} />;
      default:
        return <Home size={18} />;
    }
  };

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
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedId;
          return (
            <div
              key={addr.id}
              onClick={() => onSelect(addr.id)}
              className={`relative border-2 rounded-xl p-6 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#EF831D] bg-white"
                  : "border-[#EAE4DD] bg-[#FAF9F6] hover:border-[#D47112]/50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FDF0DF] text-[#EF831D] flex items-center justify-center shrink-0">
                    {getLabelIcon(addr.label)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-sans text-[#4A3525] leading-tight">
                      {addr.fullName}
                    </h3>
                    <p className="text-xs font-bold text-[#6B4F3B]/60 uppercase tracking-widest mt-1">
                      {addr.label || "Home"} Address
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
                  {addr.city}
                  {addr.state ? `, ${addr.state}` : ""} - {addr.pincode}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <span>+91 {addr.phone}</span>
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-[#EF831D] rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Address Card */}
        <button
          onClick={onAddNew}
          className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-[#EAE4DD] rounded-xl p-8 hover:bg-[#FAF9F6] hover:border-[#D47112]/50 transition-all text-center min-h-[220px]"
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
        <div
          onClick={() => onDeliveryTypeChange?.("standard")}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            deliveryType === "standard"
              ? "border-[#EF831D] bg-white"
              : "border-[#EAE4DD] bg-white hover:border-[#D47112]/30"
          }`}
        >
          <p className="text-sm font-bold font-sans text-[#4A3525] mb-1">
            Standard Delivery
          </p>
          <p className="text-xs font-sans text-[#6B4F3B]/60">
            5-7 Business Days
          </p>
        </div>
        <div
          onClick={() => onDeliveryTypeChange?.("express")}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            deliveryType === "express"
              ? "border-[#EF831D] bg-white"
              : "border-[#EAE4DD] bg-white hover:border-[#D47112]/30"
          }`}
        >
          <p className="text-sm font-bold font-sans text-[#4A3525] mb-1">
            Express Delivery
          </p>
          <p className="text-xs font-sans text-[#6B4F3B]/60">
            2-3 Business Days
          </p>
        </div>
      </div>
    </div>
  );
}
