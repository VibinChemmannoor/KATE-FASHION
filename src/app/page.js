"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="pt-20">
      {/* 1. SWIPEABLE BANNER (Simplified Logic) */}
      <section className="relative h-[85vh] bg-kate-cream overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative text-center text-white"
          >
            <h1 className="text-7xl md:text-9xl font-serif mb-6">SS/2026</h1>
            <p className="text-xl tracking-[0.3em] uppercase mb-8">The Little Duchess Collection</p>
            <Link href="/products" className="bg-white text-kate-dark px-10 py-4 rounded-full font-bold hover:bg-kate-dark hover:text-white transition-all">
              SHOP COLLECTION
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. LATEST PRODUCT CARD */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-kate-dark mb-12">Latest Arrivals</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-100">
            <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Silk Petal Dress</h3>
              <p className="text-gray-600 italic">Hand-stitched silk with 100% cotton lining for maximum comfort.</p>
              <button className="bg-kate-dark text-white px-6 py-2 rounded-full text-sm">Shop Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND VIDEO */}
      <section className="h-[60vh] relative mb-20">
        <video autoPlay loop muted className="w-full h-full object-cover grayscale-[30%]">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-little-girl-playing-in-a-field-of-flowers-42861-large.mp4" />
        </video>
        <div className="absolute inset-0 bg-kate-dark/30 flex items-center justify-center">
          <h2 className="text-white text-5xl font-serif italic">Pure Elegance, Pure KATE.</h2>
        </div>
      </section>

      {/* 4. HAPPY CUSTOMERS MASONRY GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-12">#KATEGirls Around The World</h2>
        <div className="columns-2 md:columns-4 gap-4 space-y-4">
          {[1,2,3,4,5,6].map((i) => (
            <motion.div whileHover={{ scale: 1.02 }} key={i} className="rounded-xl overflow-hidden shadow-lg">
              <img src={`https://images.unsplash.com/photo-1519238263530-99bbe1122da2?q=80&w=400&auto=format&fit=crop`} alt="Customer" className="w-full" />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
           <button className="border-2 border-kate-dark px-8 py-3 rounded-full font-bold hover:bg-kate-dark hover:text-white transition">LOAD MORE</button>
        </div>
      </section>
    </div>
  );
}