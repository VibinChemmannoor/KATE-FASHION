import { ProductGallery } from '@/components/organisms/ProductGallery';
import { ProductInfo } from '@/components/organisms/ProductInfo';
import { ProductDetailsTabs } from '@/components/organisms/ProductDetailsTabs';
import { CompleteTheLook } from '@/components/organisms/CompleteTheLook';
import Link from 'next/link';

// Mock Product Data
const mockProduct = {
  name: "Organic Ribbed Cotton Romper",
  price: "$54.00",
  description: "Crafted from GOTS certified organic cotton, this soft ribbed romper features nickel-free snaps for easy changes and a gentle stretch for growing little ones.",
  colors: [
    { name: 'Caramel', swatchClass: 'bg-[#D29E74]' },
    { name: 'Cream', swatchClass: 'bg-[#FDFBF7]' },
    { name: 'Sage', swatchClass: 'bg-[#8F9B8B]' },
    { name: 'White', swatchClass: 'bg-white' }
  ],
  sizes: [
    { size: '0-3M', stock: 5 },
    { size: '3-6M', stock: 0 }, // Out of stock example
    { size: '6-9M', stock: 12 },
    { size: '9-12M', stock: 3 }
  ],
  images: [
    { src: '/mock1.jpg', alt: 'Romper Front' },
    { src: '/mock2.jpg', alt: 'Romper Back' },
    { src: '/mock3.jpg', alt: 'Fabric Detail' },
    { src: '/mock4.jpg', alt: 'Baby wearing' }
  ],
  materialInfo: {
    description: "Our commitment to your baby's skin and the planet starts with our materials. This romper is made from GOTS (Global Organic Textile Standard) certified long-staple cotton.",
    bullets: [
      "95% Organic Cotton, 5% Elastane",
      "Breathable ribbed texture",
      "Machine wash cold, tumble dry low"
    ]
  },
  sizeChart: [
    { size: 'NB', age: 'Up to 1M', height: '18-21"', weight: '5-9 lbs' },
    { size: '3M', age: '1-3M', height: '21-24"', weight: '9-12 lbs' },
    { size: '6M', age: '3-6M', height: '24-26"', weight: '12-16 lbs' }
  ]
};

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: `${mockProduct.name} | KATERI`,
    description: mockProduct.description,
    alternates: { canonical: "https://yourdomain.com/products/organic-ribbed-cotton-romper" },
  };
}

export default function ProductDetailPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 md:px-8 pt-8 pb-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/" className="hover:text-[#EC7F13] transition-colors">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/collections/newborn" className="hover:text-[#EC7F13] transition-colors">NEWBORN</Link>
          <span className="mx-2">/</span>
          <span className="text-[#A4550A]">ORGANIC RIBBED ROMPER</span>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <ProductGallery images={mockProduct.images} />
          <ProductInfo product={mockProduct} />
        </div>
      </div>

      <ProductDetailsTabs 
        materialInfo={mockProduct.materialInfo} 
        sizeChart={mockProduct.sizeChart} 
      />
      <CompleteTheLook />
    </div>
  );
}
