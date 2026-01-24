"use client";
import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const images = [product.img1, product.img2, product.img3];

  const nextImg = (e) => {
    e.preventDefault();
    setImgIndex((prev) => (prev + 1) % 3);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-[400px] overflow-hidden">
          <img src={images[imgIndex]} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          
          {/* Swipe Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition">
            <button onClick={nextImg} className="bg-white/80 p-1 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextImg} className="bg-white/80 p-1 rounded-full"><ChevronRight className="w-4 h-4" /></button>
          </div>

          {/* Wishlist Icon */}
          <button 
            onClick={(e) => { e.preventDefault(); setIsWishlist(!isWishlist); }}
            className="absolute top-4 right-4 z-10"
          >
            <Heart className={`w-6 h-6 transition ${isWishlist ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        <div className="p-5 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">-{product.discount}%</span>
          </div>
          <p className="text-gray-500 text-sm italic">Model: {product.modelName}</p>
          <div className="flex items-center gap-3">
            <span className="text-kate-dark font-bold text-xl">${product.price}</span>
            <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}