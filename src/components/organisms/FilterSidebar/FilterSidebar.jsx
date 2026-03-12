"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SIZES = ["NB", "0-3M", "3-6M", "6-9M", "9-12M"];
const COLORS = [
  { name: "Earth Brown", swatchClass: "bg-[#633B2E]" },
  { name: "Caramel Glow", swatchClass: "bg-[#BE8A5A]" },
  { name: "Sand Beige", swatchClass: "bg-[#F0E8D7]" },
];
const MATERIALS = ["Organic Cotton", "Merino Wool", "Bamboo Fiber"];

export function FilterSidebar({ filters, onFilterChange }) {
  const [openSections, setOpenSections] = useState({
    size: true,
    color: true,
    price: true,
    material: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (category, value) => {
    onFilterChange(category, value);
  };

  return (
    <div className="w-full lg:w-64 pr-0 lg:pr-8 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8 border-b border-[#F5F0E6] pb-4">
        <span className="font-bold text-[#4A3525] uppercase tracking-wider text-sm flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          REFINE SEARCH
        </span>
      </div>

      {/* Size Filter */}
      <div className="mb-6 border-b border-[#F5F0E6] pb-4">
        <button
          onClick={() => toggleSection("size")}
          className="flex justify-between items-center w-full text-left font-bold font-sans text-[#4A3525] mb-4"
        >
          <span>Size</span>
          {openSections.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.size && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {SIZES.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleCheckboxChange("sizes", size)}
                  className={`py-2 text-xs font-bold border transition-colors ${
                    isSelected
                      ? "border-[#D47112] bg-[#FDF0DF] text-[#D47112]"
                      : "border-[#EAE4DD] text-[#4A3525] hover:border-[#6B4F3B]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-6 border-b border-[#F5F0E6] pb-4">
        <button
          onClick={() => toggleSection("color")}
          className="flex justify-between items-center w-full text-left font-bold font-sans text-[#4A3525] mb-4"
        >
          <span>Color Palette</span>
          {openSections.color ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.color && (
          <div className="flex flex-col gap-3">
            {COLORS.map((color) => {
              const isSelected = filters.colors.includes(color.name);
              return (
                <label
                  key={color.name}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border border-black/10 shadow-sm ${color.swatchClass}`}
                    />
                    <span className="text-sm font-sans text-[#6B4F3B] group-hover:text-[#4A3525]">
                      {color.name}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange("colors", color.name)}
                    className="w-4 h-4 rounded border-[#EAE4DD] text-[#D47112] focus:ring-[#D47112]"
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6 border-b border-[#F5F0E6] pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex justify-between items-center w-full text-left font-bold font-sans text-[#4A3525] mb-4"
        >
          <span>Price Range</span>
          {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.price && (
          <div className="flex flex-col gap-2">
            {/* Simple range representation for mockup */}
            <div className="h-1 w-full bg-[#EAE4DD] rounded relative mt-4 mb-2">
              <div className="absolute left-0 w-full h-full bg-[#D47112] rounded"></div>
              <div className="absolute left-[-4px] top-[-6px] w-4 h-4 bg-white border-2 border-[#D47112] rounded-full"></div>
              <div className="absolute right-[-4px] top-[-6px] w-4 h-4 bg-white border-2 border-[#D47112] rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-[#6B4F3B]/70 font-bold">
              <span>$0</span>
              <span>$250+</span>
            </div>
          </div>
        )}
      </div>

      {/* Material */}
      <div className="mb-6 border-b border-[#F5F0E6] pb-4">
        <button
          onClick={() => toggleSection("material")}
          className="flex justify-between items-center w-full text-left font-bold font-sans text-[#4A3525] mb-4"
        >
          <span>Material</span>
          {openSections.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.material && (
          <div className="flex flex-col gap-3">
            {MATERIALS.map((material) => {
              const isSelected = filters.materials.includes(material);
              return (
                <label key={material} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange("materials", material)}
                    className="w-4 h-4 rounded border-[#EAE4DD] text-[#D47112] focus:ring-[#D47112]"
                  />
                  <span className="text-sm font-sans text-[#6B4F3B] group-hover:text-[#4A3525]">
                    {material}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
