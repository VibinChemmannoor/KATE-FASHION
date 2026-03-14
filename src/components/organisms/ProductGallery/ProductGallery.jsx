"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images }) {
  const [activeImage, setActiveImage] = useState(0);
  const safeImages = images?.length
    ? images
    : [
        {
          url: "",
          alt: "Product image",
        },
      ];

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex justify-between md:flex-col gap-3 order-2 md:order-1 w-full md:w-20 lg:w-24">
        {safeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative aspect-square w-full rounded-md overflow-hidden bg-[#F5F0E6] border-2 transition-all ${
              activeImage === idx ? "border-[#A4550A]" : "border-transparent hover:border-[#E5D5C1]"
            }`}
          >
            {img.url ? (
              <Image src={img.url} alt={img.alt} fill sizes="96px" className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <span className="text-[#6B4F3B]/30 font-serif italic text-[10px] text-center">
                  {img.alt}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-[#F5F0E6] rounded-xl overflow-hidden aspect-[4/5] md:aspect-auto order-1 md:order-2 relative h-[500px] md:h-[650px]">
        {safeImages[activeImage]?.url ? (
          <Image
            src={safeImages[activeImage].url}
            alt={safeImages[activeImage].alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#6B4F3B]/40 font-serif italic text-lg">
              {safeImages[activeImage].alt} main view
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
