"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const MOCK_PRODUCTS = [
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
    id: 4,
    name: "Velvet Bow Romper",
    modelName: "Winter Gala",
    price: 85,
    oldPrice: 110,
    discount: 22,
    img1: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80",
    img2: "https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80",
    img3: "https://images.unsplash.com/photo-1606456041040-7e6d24a7374b?auto=format&fit=crop&q=80"
  }
];

export default function HomePage() {
  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] bg-[#FAF9F6] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1621452973707-639662783c8c?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center text-white max-w-4xl px-4"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-6 drop-shadow-md">SS/2026</h1>
            <p className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-10 font-light text-gray-100">The Little Duchess Collection</p>
            <Link href="/products" className="bg-white text-kate-dark px-10 py-4 rounded-full font-bold hover:bg-kate-dark hover:text-white transition-all duration-300 shadow-lg">
              SHOP COLLECTION
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. LATEST PRODUCT CARD */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-3xl md:text-4xl font-serif text-kate-dark">Latest Arrivals</h2>
            <Link href="/products" className="text-kate-medium hover:text-kate-dark font-medium underline underline-offset-4">View All</Link>
        </div>
       
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {MOCK_PRODUCTS.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      </section>

      {/* 3. BRAND VIDEO */}
      <section className="h-[60vh] relative mb-20 overflow-hidden">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover grayscale-[20%] scale-105">
           {/* Fallback to image if video fails or for preview */}
           <source src="https://assets.mixkit.co/videos/preview/mixkit-little-girl-playing-in-a-field-of-flowers-42861-large.mp4" />
        </video>
        <div className="absolute inset-0 bg-kate-dark/40 flex items-center justify-center text-center p-6">
          <div className="max-w-2xl">
             <h2 className="text-white text-4xl md:text-6xl font-serif italic mb-6">"Pure Elegance, Pure KATE."</h2>
             <Link href="/about" className="text-white border border-white px-8 py-3 rounded-full hover:bg-white hover:text-kate-dark transition duration-300">Our Story</Link>
          </div>
        </div>
      </section>

      {/* 4. HAPPY CUSTOMERS MASONRY GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-50 rounded-3xl mb-20">
        <h2 className="text-3xl font-serif text-center mb-4 text-kate-dark">#KATEGirls</h2>
         <p className="text-center text-gray-500 mb-12 max-w-md mx-auto">Tag us to be featured in our monthly lookbook.</p>
        <div className="columns-2 md:columns-4 gap-4 space-y-4">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <motion.div 
                whileHover={{ scale: 1.02 }} 
                key={i} 
                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid"
            >
              <img 
                src={`https://images.unsplash.com/photo-${[
                    '1519238263530-99bbe1122da2', 
                    '1485960994840-902a67e187c8', 
                    '1503919595865-04225a0734e9',
                    '1518831959646-742c3a14ebf7',
                    '1621452973707-639662783c8c',
                    '1524504388940-b1c1722653e1',
                    '1596870230751-ebdfce98ec42',
                    '1606456041040-7e6d24a7374b'
                ][i % 8]}?q=80&w=600&auto=format&fit=crop`} 
                alt="Customer" 
                className="w-full h-auto object-cover" 
              />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
           <button className="bg-kate-dark text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition shadow-md">LOAD MORE LOOKS</button>
        </div>
      </section>
    </div>
  );
}