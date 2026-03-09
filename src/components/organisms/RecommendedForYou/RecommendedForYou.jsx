import Link from 'next/link';

const REC_ITEMS = [
  { id: 1, name: 'Cotton Swaddle', bgColor: 'bg-[#F2F3EE]', imageAlt: 'Green Leaves Pattern' },
  { id: 2, name: 'Bamboo Burp Cloth', bgColor: 'bg-[#FDF0DF]', imageAlt: 'Branch Pattern' },
  { id: 3, name: 'Nursery Plush', bgColor: 'bg-[#FDEBE1]', imageAlt: 'Textured Cloth' },
  { id: 4, name: 'Teething Toy', bgColor: 'bg-[#F2EFE8]', imageAlt: 'Wood Toy' },
  { id: 5, name: 'Gift Box Set', bgColor: 'bg-[#F9EDE6]', imageAlt: 'Box with Ribbon' },
  { id: 6, name: 'Knit Blanket', bgColor: 'bg-[#FDE2D1]', imageAlt: 'Rolled Blanket' },
];

export function RecommendedForYou() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16 mb-20 border-t border-[#F5F0E6]/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1b26] tracking-tight">Recommended For You</h2>
        <Link 
          href="/collections/recommended" 
          className="text-sm font-bold text-[#D47112] hover:text-[#A4550A] transition-colors flex items-center gap-1"
        >
          View All <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Basic Grid for Recommendations */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {REC_ITEMS.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            {/* Image Placeholder Box */}
            <div className={`aspect-square rounded-xl overflow-hidden mb-3 relative ${item.bgColor}`}>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                 <span className="text-[#6B4F3B]/30 font-serif italic text-xs text-center">{item.imageAlt}</span>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-xs font-bold text-[#4A3525] group-hover:text-[#D47112] transition-colors">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
