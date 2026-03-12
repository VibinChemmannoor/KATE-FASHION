"use client";

import { useState } from "react";

export function AddressForm({ onAddAddress }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    town: "",
    pincode: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, validate here.
    onAddAddress(formData);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold font-serif text-[#1a1b26] mb-2 tracking-tight">
        Add New Address
      </h2>
      <p className="text-sm font-sans text-[#6B4F3B]/70 mb-8">
        Where should we deliver your order?
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#EAE4DD] rounded-xl p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-bold font-sans text-[#4A3525]">
              Full Name
            </label>
            <input
              required
              type="text"
              id="fullName"
              name="fullName"
              placeholder="e.g. Emily Thompson"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-bold font-sans text-[#4A3525]">
              Phone Number
            </label>
            <input
              required
              type="tel"
              id="phone"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="email" className="text-sm font-bold font-sans text-[#4A3525]">
            Email Address
          </label>
          <input
            required
            type="email"
            id="email"
            name="email"
            placeholder="emily@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors"
          />
        </div>

        {/* Street Address */}
        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="street" className="text-sm font-bold font-sans text-[#4A3525]">
            Street Address
          </label>
          <textarea
            required
            id="street"
            name="street"
            placeholder="Flat, House no., Building, Company, Apartment"
            rows={3}
            value={formData.street}
            onChange={handleChange}
            className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Town / City */}
          <div className="flex flex-col gap-2">
            <label htmlFor="town" className="text-sm font-bold font-sans text-[#4A3525]">
              Town / City
            </label>
            <input
              required
              type="text"
              id="town"
              name="town"
              placeholder="Your City"
              value={formData.town}
              onChange={handleChange}
              className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors"
            />
          </div>

          {/* Pincode / ZIP */}
          <div className="flex flex-col gap-2">
            <label htmlFor="pincode" className="text-sm font-bold font-sans text-[#4A3525]">
              Pincode / ZIP
            </label>
            <input
              required
              type="text"
              id="pincode"
              name="pincode"
              placeholder="6-digit ZIP code"
              value={formData.pincode}
              onChange={handleChange}
              className="bg-[#FAF9F6] border border-[#EAE4DD] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#D47112] focus:ring-1 focus:ring-[#D47112] transition-colors"
            />
          </div>
        </div>

        {/* Default Checkbox */}
        <div className="flex items-center gap-3 mb-8">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4 rounded border-[#EAE4DD] text-[#D47112] focus:ring-[#D47112]"
          />
          <label htmlFor="isDefault" className="text-sm font-sans text-[#6B4F3B]">
            Set as default shipping address
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#EF831D] hover:bg-[#D47112] text-white font-bold font-sans px-8 py-3.5 rounded-lg transition-colors shadow-sm"
        >
          ADD ADDRESS
        </button>
      </form>
    </div>
  );
}
