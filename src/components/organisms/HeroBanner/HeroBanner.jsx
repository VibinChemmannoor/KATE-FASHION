import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * @param {{ hero: {
 *  collectionLabel: string,
 *  titleLines: string[],
 *  subtitle: string,
 *  ctaLabel: string,
 *  ctaHref: string,
 *  primaryImageAlt: string,
 *  secondaryImageAlt: string,
 *  image?: string,
 *  hangingImage?: string
 * } }} props
 */
export function HeroBanner({ hero }) {
  console.log('hero====',hero)
  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
        <div className="lg:col-span-7 bg-[#E5D5C1] rounded-2xl overflow-hidden relative min-h-[400px] lg:min-h-full flex items-center justify-center">
          {hero.image ? (
            <Image
              src={hero?.image ?? ""}
              alt={hero?.primaryImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <svg viewBox="0 0 200 200" className="w-64 h-64 text-[#6B4F3B]/20" fill="currentColor">
                <path d="M100 20C55.8 20 20 55.8 20 100s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm0 144c-35.3 0-64-28.7-64-64 0-16.7 6.4-31.9 16.9-43.4 2.8 5.6 7.4 10.4 13.1 13.9 10.5 6.4 23.3 5.4 32.7-1.3l2.8-2c2.1-1.5 4.8-1.5 6.9 0l2.8 2c9.4 6.7 22.2 7.8 32.7 1.3 5.7-3.5 10.3-8.3 13.1-13.9 10.5 11.5 16.9 26.7 16.9 43.4 0 35.3-28.7 64-64 64z" />
              </svg>
              <p className="mt-4 text-[#6B4F3B]/50 font-serif italic text-lg text-center">
                {hero.primaryImageAlt}
                <br />
                <span className="text-sm font-sans not-italic">Replace with actual image</span>
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#F5F0E6] rounded-2xl p-8 lg:p-12 flex-1 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-[#A4550A] uppercase mb-4">
              {hero.collectionLabel}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#412B1F] leading-[1.1] mb-6">
              {hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-[#6B4F3B]/80 leading-relaxed mb-8 max-w-sm">{hero.subtitle}</p>
            <Link
              href={hero.ctaHref}
              className="inline-flex items-center justify-center bg-[#412B1F] text-[#FDFBF7] px-8 py-4 rounded-full font-medium hover:bg-[#6B4F3B] transition-colors w-fit group"
            >
              {hero.ctaLabel}
              <ArrowRight
                size={18}
                className="ml-2 transform group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="bg-[#FAF9F6] rounded-2xl overflow-hidden h-48 relative border border-[#F5F0E6]">
            {hero.hangingImage ? (
              <Image
                src={hero.hangingImage}
                alt={hero.secondaryImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#6B4F3B]/40 font-serif italic">{hero.secondaryImageAlt}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
