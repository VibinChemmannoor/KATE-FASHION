import { X } from "lucide-react";

export function ActiveFiltersBar({ filters, onRemoveFilter }) {
  // Flatten all active filters into a single array of objects { category, value }
  const activeFilters = [];

  if (filters.sizes) {
    filters.sizes.forEach((size) => activeFilters.push({ category: "sizes", value: size }));
  }
  if (filters.colors) {
    filters.colors.forEach((col) => activeFilters.push({ category: "colors", value: col }));
  }
  if (filters.materials) {
    filters.materials.forEach((mat) => activeFilters.push({ category: "materials", value: mat }));
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-[#6B4F3B]/60 mr-2">Active Filters:</span>
      {activeFilters.map(({ category, value }) => (
        <button
          key={`${category}-${value}`}
          onClick={() => onRemoveFilter(category, value)}
          className="flex items-center gap-1 bg-[#FDF0DF] text-[#D47112] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#FDEBE1] transition-colors"
        >
          {value}
          <X size={12} strokeWidth={3} className="ml-1" />
        </button>
      ))}
    </div>
  );
}
