'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { WishlistItem } from '@/components/molecules/WishlistItem'; // Re-using item styles but with a slightly different API if needed, or we adapt it

export function ProductGrid({ activeFilters, sortOption }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    // Trigger when bottom is 100px from viewport
    rootMargin: '100px',
  });

  const ITEMS_PER_PAGE = 6;

  // 1. Generate a large mock dataset to simulate DB
  const MOCK_PRODUCTS = Array.from({ length: 84 }).map((_, i) => ({
    id: i + 1,
    name: [
      'Heirloom Ribbed Romper', 'Cashmere Blend Cardigan', 'Morning Sun Onesie Set',
      'Cloud Soft Muslin Swaddle', 'Soft-Sole Suede Booties', 'Linen Blend Sun Suit'
    ][i % 6],
    material: ['Earth Brown', 'Sand Beige', 'Caramel Glow', 'Natural White', 'Dark Earth', 'Wheat Beige'][i % 6],
    price: [48, 72, 34, 28, 42, 55][i % 6],
    badge: i % 7 === 0 ? 'NEW COLLECTION' : (i % 11 === 0 ? 'LAST ITEMS' : null),
    bgColor: [
      'bg-[#7C9A82]', 'bg-[#F2D08E]', 'bg-[#A2B59D]', 
      'bg-[#8D9E83]', 'bg-[#98A68B]', 'bg-[#ADC1A2]'
    ][i % 6],
    attributes: {
      sizes: ['0-3M', '3-6M', '6-9M'][i % 3], // Simplified
      colors: ['Earth Brown', 'Caramel Glow', 'Sand Beige'][i % 3], // Simplified mapping
      materials: ['Organic Cotton', 'Merino Wool', 'Bamboo Fiber'][i % 3] // Simplified
    }
  }));

  // 2. Filter & Sort Logic
  const getFilteredProducts = () => {
    let result = [...MOCK_PRODUCTS];

    // Apply Filters
    if (activeFilters.sizes?.length > 0) {
      result = result.filter(p => activeFilters.sizes.includes(p.attributes.sizes));
    }
    if (activeFilters.colors?.length > 0) {
      result = result.filter(p => activeFilters.colors.includes(p.attributes.colors));
    }
    if (activeFilters.materials?.length > 0) {
      result = result.filter(p => activeFilters.materials.includes(p.attributes.materials));
    }

    // Apply Sort
    if (sortOption === 'Price: Low-High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High-Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'Newest Arrivals') {
      // Dummy logic: sort by ID desc
      result.sort((a, b) => b.id - a.id);
    }
    // Most popular is default (no sort)

    return result;
  };

  // 3. Reset pagination when filters/sort changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    const filtered = getFilteredProducts();
    setProducts(filtered.slice(0, ITEMS_PER_PAGE));
  }, [activeFilters, sortOption]);

  // 4. Infinite Scroll triggering
  useEffect(() => {
    if (inView && hasMore) {
      const filtered = getFilteredProducts();
      const currentLength = products.length;
      
      if (currentLength < filtered.length) {
        // Load next chunk
        setTimeout(() => { // small delay to simulate network
          const nextBatch = filtered.slice(currentLength, currentLength + ITEMS_PER_PAGE);
          setProducts(prev => [...prev, ...nextBatch]);
          setPage(prev => prev + 1);
        }, 500); 
      } else {
        setHasMore(false);
      }
    }
  }, [inView, hasMore, products, activeFilters, sortOption]);


  if (products.length === 0) {
    return (
      <div className="flex-1 py-12 text-center text-[#6B4F3B]/60">
        No products match your selected filters. Try adjusting them!
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => (
          <div key={item.id} className="group relative flex flex-col cursor-pointer">
            {/* Image Box */}
            <div className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 ${item.bgColor}`}>
               <div className="absolute inset-0 flex items-center justify-center">
                  {/* Dummy Container Shape */}
                  <div className="w-24 h-32 bg-white rounded-t-lg border-b-8 border-[#D29E74]/50 shadow-sm relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-[#4A3525]/30">Product {item.id}</span>
                  </div>
               </div>

               {/* Badge */}
              {item.badge && (
                <span className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm ${
                  item.badge === 'NEW COLLECTION' ? 'bg-[#D47112]' : 'bg-[#C15C5C]'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>

            <h3 className="text-[15px] font-bold font-serif text-[#1a1b26] mb-1 group-hover:text-[#D47112] transition-colors">
              {item.name}
            </h3>
            <p className="text-[13px] font-sans text-[#6B4F3B]/60 mb-2">{item.material}</p>
            <p className="text-[15px] font-bold font-serif text-[#D47112]">${item.price.toFixed(2)}</p>
          </div>
        ))}
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
