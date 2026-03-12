import Link from "next/link";

export function CategoryShowcase() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16 mb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-[#4A3525] mb-3">Shop by Category</h2>
        <p className="text-sm font-sans text-[#6B4F3B]/60 tracking-wide">
          Thoughtfully curated for every milestone
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: The Artisan Knitwear */}
        <div className="relative h-[450px] rounded-2xl overflow-hidden group">
          {/* Background Placeholder */}
          <div className="absolute inset-0 bg-[#3A3C38]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/40 font-serif italic">Artisan Workshop Image</span>
            </div>
          </div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col items-start transform transition-transform duration-300">
            <h3 className="text-3xl font-serif font-bold text-[#FDFBF7] mb-4">
              The Artisan Knitwear
            </h3>
            <Link
              href="/category/artisan-knitwear"
              className="bg-[#FDFBF7] text-[#4A3525] font-semibold font-sans px-6 py-3 rounded-full text-sm hover:bg-[#F5F0E6] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Card 2: Newborn Essentials */}
        <div className="relative h-[450px] rounded-2xl overflow-hidden group">
          {/* Background Placeholder */}
          <div className="absolute inset-0 bg-[#C8A488]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#4A3525]/40 font-serif italic text-lg">
                Newborn Vector Image
              </span>
            </div>
          </div>
          {/* Subtle bottom gradient just in case */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center transform transition-transform duration-300">
            <h3 className="text-3xl font-serif font-bold text-[#FDFBF7] mb-4 drop-shadow-sm">
              Newborn Essentials
            </h3>
            <Link
              href="/category/newborn-essentials"
              className="bg-[#FDFBF7] text-[#4A3525] font-semibold font-sans px-6 py-3 rounded-full text-sm hover:bg-[#F5F0E6] transition-colors shadow-sm"
            >
              Shop Essentials
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
