import Link from 'next/link';
import Image from 'next/image';

const crossSellItems = [
  {
    id: 1,
    name: 'Cotton Booties',
    price: '$18.00',
    bgColor: 'bg-[#F2EDEA]',
    imageAlt: 'Brown Booties'
  },
  {
    id: 2,
    name: 'Ribbed Beanie',
    price: '$16.00',
    bgColor: 'bg-[#FDFBF7]',
    imageAlt: 'Brown Beanie'
  },
  {
    id: 3,
    name: 'Heirloom Blanket',
    price: '$65.00',
    bgColor: 'bg-[#F5F0E6]',
    imageAlt: 'Folded Blanket'
  },
  {
    id: 4,
    name: 'Cotton Cardigan',
    price: '$42.00',
    bgColor: 'bg-[#F2F3EE]',
    imageAlt: 'Grey Cardigan'
  }
];

export function CompleteTheLook() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16 mb-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif font-bold text-[#4A3525] italic">Complete the Look</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {crossSellItems.map((item) => (
          <div key={item.id} className="group cursor-pointer flex flex-col">
            {/* Image Placeholder */}
            <div className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 ${item.bgColor}`}>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                 <span className="text-[#6B4F3B]/30 font-serif italic text-sm text-center">{item.imageAlt}</span>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xs font-bold font-sans text-[#4A3525] uppercase tracking-wider mb-1 group-hover:text-[#EC7F13] transition-colors">{item.name}</h3>
            <p className="text-xs font-serif text-[#6B4F3B]/70">{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
