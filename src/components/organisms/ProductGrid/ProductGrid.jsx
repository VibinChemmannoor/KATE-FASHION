"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils/format";
import { PRODUCTS_PAGE_SIZE } from "@/lib/utils/constants";

const SORT_MAP = {
  "Most Popular": "popular",
  "Price: Low-High": "price-low",
  "Price: High-Low": "price-high",
  "Newest Arrivals": "newest",
};

/**
 * @param {{
 *  activeFilters: { sizes: string[], colors: string[], materials: string[] },
 *  sortOption: string,
 *  categorySlug?: string,
 *  initialProducts?: Array<any>,
 *  initialPagination?: { page: number, limit: number, total: number, totalPages: number, hasMore: boolean },
 *  onMetaChange?: (meta: { total: number }) => void
 * }} props
 */
export function ProductGrid({
  activeFilters,
  sortOption,
  categorySlug,
  initialProducts = [],
  initialPagination = null,
  onMetaChange = null,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPagination?.page || 1);
  const [hasMore, setHasMore] = useState(initialPagination?.hasMore ?? false);
  const [isFetching, setIsFetching] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore();
  const showToast = useUiStore((state) => state.showToast);

  const { ref, inView } = useInView({
    rootMargin: "100px",
  });

  const sortParam = SORT_MAP[sortOption] || "newest";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", `${PRODUCTS_PAGE_SIZE}`);
    params.set("sort", sortParam);
    if (categorySlug) params.set("categorySlug", categorySlug);
    if (activeFilters.sizes?.length) params.set("sizes", activeFilters.sizes.join(","));
    if (activeFilters.colors?.length) params.set("colors", activeFilters.colors.join(","));
    if (activeFilters.materials?.length) params.set("material", activeFilters.materials.join("|"));
    return params.toString();
  }, [activeFilters, categorySlug, sortParam]);

  const fetchProducts = async (nextPage, { replace = false } = {}) => {
    try {
      setIsFetching(true);
      const res = await fetch(`/api/products?page=${nextPage}&${queryString}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to load products");
      }

      const newProducts = json.data || [];
      setProducts((prev) => (replace ? newProducts : [...prev, ...newProducts]));
      setPage(json.pagination?.page || nextPage);
      setHasMore(json.pagination?.hasMore ?? false);

      if (onMetaChange && json.pagination) {
        onMetaChange({ total: json.pagination.total });
      }
    } catch (error) {
      showToast(error.message || "Failed to load products", "error");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!initialPagination) {
      fetchProducts(1, { replace: true });
      return;
    }

    setProducts(initialProducts);
    setPage(initialPagination.page || 1);
    setHasMore(initialPagination.hasMore ?? false);
  }, [initialPagination, initialProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    fetchProducts(1, { replace: true });
  }, [queryString]);

  useEffect(() => {
    if (!inView || !hasMore || isFetching) return;
    fetchProducts(page + 1);
  }, [inView, hasMore, isFetching, page]);

  const handleWishlistToggle = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        showToast("Removed from wishlist", "success");
      } else {
        await addToWishlist(productId);
        showToast("Added to wishlist", "success");
      }
    } catch (error) {
      showToast(error.message || "Please login to use wishlist", "error");
    }
  };

  if (!products.length && !isFetching) {
    return (
      <div className="flex-1 py-12 text-center text-[#6B4F3B]/60">
        No products match your selected filters. Try adjusting them!
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => {
          const isWishlisted = isInWishlist(item.id);
          const primaryImage = item.images?.[0]?.url || item.images?.[0]?.src || "";

          return (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group relative flex flex-col cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-[#F5F0E6]">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#6B4F3B]/30 font-serif italic text-sm text-center">
                      {item.name}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(event) => handleWishlistToggle(event, item.id)}
                  aria-label="Toggle wishlist"
                  className={`absolute top-3 right-3 h-10 w-10 rounded-full border flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? "border-[#A4550A] bg-white text-[#A4550A]"
                      : "border-white/70 bg-white/90 text-[#6B4F3B] hover:text-[#A4550A]"
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
                </button>

                {item.badge && (
                  <span className="absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm bg-[#D47112]">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-bold font-serif text-[#1a1b26] mb-1 group-hover:text-[#D47112] transition-colors">
                {item.name}
              </h3>
              <p className="text-[13px] font-sans text-[#6B4F3B]/60 mb-2">
                {item.material || item.category?.name || "Organic Essential"}
              </p>
              <p className="text-[15px] font-bold font-serif text-[#D47112]">
                {formatPrice(item.price)}
              </p>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div ref={ref} className="w-full flex justify-center items-center py-10 mt-8">
          <div className="w-6 h-6 border-2 border-[#D47112] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {!hasMore && products.length > 0 && (
        <div className="w-full text-center py-10 mt-8 text-sm font-bold text-[#6B4F3B]/50 uppercase tracking-widest border-t border-[#F5F0E6]">
          You have seen everything
        </div>
      )}
    </div>
  );
}
