"use client";
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Silk Petal Dress",
    modelName: "Summer Collection",
    price: 120,
    oldPrice: 156,
    discount: 23,
    img1: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Velvet Bow Romper",
    modelName: "Winter Gala",
    price: 85,
    oldPrice: 110,
    discount: 22,
    img1: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1606456041040-7e6d24a7374b?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Royal Blue Suit",
    modelName: "Little Prince",
    price: 140,
    oldPrice: 180,
    discount: 22,
    img1: "https://images.unsplash.com/photo-1485960994840-902a67e187c8?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1560934149-6b72807e997f?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Sunshine Linen Set",
    modelName: "Beach Ready",
    price: 65,
    oldPrice: 85,
    discount: 23,
    img1: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1519238263530-99bbe1122da2?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Classic Trench Coat",
    modelName: "London Fog",
    price: 195,
    oldPrice: 250,
    discount: 22,
    img1: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1503919595865-04225a0734e9?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Ballerina Tulle Skirt",
    modelName: "Dance Dreams",
    price: 55,
    oldPrice: 75,
    discount: 26,
    img1: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80"
  }
];

export default function ProductsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-kate-dark">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-kate-dark font-medium">All Products</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif text-kate-dark mb-2">The Collection</h1>
          <p className="text-gray-500">Timeless pieces for every occasion.</p>
        </div>
        
        {/* Simple Filter mock */}
        <div className="flex gap-4">
          <select className="border border-gray-200 rounded-full px-4 py-2 bg-white text-sm focus:outline-none focus:border-kate-dark">
            <option>Sort By: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <select className="border border-gray-200 rounded-full px-4 py-2 bg-white text-sm focus:outline-none focus:border-kate-dark">
            <option>Category: All</option>
            <option>Dresses</option>
            <option>Suits</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ALL_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Pagination Mock */}
      <div className="flex justify-center mt-20">
         <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-kate-dark text-white">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-50">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-50">3</button>
         </div>
      </div>
    </div>
  );
}
