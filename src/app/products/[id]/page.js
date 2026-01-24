"use client";
import { useState } from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
  const [showModal, setShowModal] = useState(false);

  const addToCart = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Top Cart Modal */}
      {showModal && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-kate-dark text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce">
          <ShoppingBag className="w-5 h-5" />
          <span>Added to your KATE bag!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Images */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 gap-4">
          <div className="col-span-2 h-[600px] bg-gray-100 rounded-3xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542462662-e1707923769c?q=80&w=1000" className="w-full h-full object-cover" />
          </div>
          <div className="h-60 bg-gray-100 rounded-3xl" />
          <div className="h-60 bg-gray-100 rounded-3xl" />
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-2/5 space-y-8">
          <div>
            <h1 className="text-5xl font-serif text-kate-dark">Royal Velvet Dress</h1>
            <p className="text-2xl mt-4 font-light">$120.00 <span className="text-sm text-green-600 font-bold ml-2">15% OFF</span></p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold uppercase text-xs tracking-widest">Select Size</h4>
            <div className="flex gap-4">
              {['2Y', '4Y', '6Y', '8Y'].map(size => (
                <button key={size} className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:border-kate-dark">{size}</button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            A timeless piece for your little one. Made with premium velvet and breathable silk lining. Perfect for weddings and formal events.
          </p>

          <div className="flex gap-4">
            <button onClick={addToCart} className="flex-1 bg-kate-dark text-white py-5 rounded-full font-bold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-3">
              ADD TO CART
            </button>
            <button className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 transition">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-32">
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-3xl font-serif">You May Also Love</h3>
          <Link href="/products" className="text-kate-dark font-bold border-b border-kate-dark">View All Products</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Product Cards Here */}
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}