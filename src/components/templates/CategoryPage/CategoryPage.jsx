"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { FilterSidebar } from "@/components/organisms/FilterSidebar";
import { ActiveFiltersBar } from "@/components/molecules/ActiveFiltersBar";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { SortDropdown } from "@/components/molecules/SortDropdown";

/**
 * @param {{
 *  category: { name: string, description: string, slug: string } | null,
 *  initialProducts?: Array<any>,
 *  initialPagination?: { page: number, limit: number, total: number, totalPages: number, hasMore: boolean }
 * }} props
 */
export function CategoryPage({ category, initialProducts = [], initialPagination = null }) {
  const [filters, setFilters] = useState({
    sizes: [],
    colors: [],
    materials: [],
  });

  const [sortOption, setSortOption] = useState("Most Popular");
  const [productCount, setProductCount] = useState(initialPagination?.total || 0);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const currentCategory = prev[category];
      if (currentCategory.includes(value)) {
        return { ...prev, [category]: currentCategory.filter((item) => item !== value) };
      }
      return { ...prev, [category]: [...currentCategory, value] };
    });
  };

  const handleRemoveFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item !== value),
    }));
  };

  useEffect(() => {
    if (initialPagination?.total) {
      setProductCount(initialPagination.total);
    }
  }, [initialPagination]);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B4F3B]/60 mb-6 font-sans">
          <Link href="/" className="hover:text-[#EC7F13] transition-colors">
            HOME
          </Link>
          <span className="mx-2"></span>
          <Link href="/collections" className="hover:text-[#EC7F13] transition-colors">
            COLLECTIONS
          </Link>
          <span className="mx-2"></span>
          <span className="text-[#1a1b26]">{category?.name || "Category"}</span>
        </div>

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1b26] tracking-tight mb-4">
            {category?.name || "Category"}
          </h1>
          <p className="text-base font-sans text-[#6B4F3B]/80 leading-relaxed max-w-xl">
            {category?.description ||
              "Discover our curated collection of organic cotton pieces. Thoughtfully designed in earthy tones of brown, caramel, and beige for the ultimate soft-touch experience."}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#F5F0E6] pb-6 mb-8">
          <div className="flex-1 w-full">
            <ActiveFiltersBar filters={filters} onRemoveFilter={handleRemoveFilter} />
          </div>
          <div className="flex items-center gap-6 self-end w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-bold text-[#D47112] bg-[#FDF0DF] px-3 py-1.5 rounded uppercase tracking-wider">
              {productCount} Products Found
            </span>
            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          <ProductGrid
            activeFilters={filters}
            sortOption={sortOption}
            categorySlug={category?.slug}
            initialProducts={initialProducts}
            initialPagination={initialPagination}
            onMetaChange={({ total }) => setProductCount(total)}
          />
        </div>
      </div>
    </div>
  );
}
