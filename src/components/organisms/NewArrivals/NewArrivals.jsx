import Link from "next/link";

/**
 * @param {{ newArrivals: {
 *  title: string,
 *  ctaLabel: string,
 *  ctaHref: string,
 *  items: Array<{ id: number, name: string, material: string, price: string, isNew: boolean, bgColor: string, imageAlt: string }>
 * } }} props
 */
export function NewArrivals({ newArrivals }) {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16">
      <div className="flex justify-between items-end mb-10 border-b border-[#F5F0E6] pb-4">
        <h2 className="text-3xl font-serif font-bold text-[#4A3525] relative">
          {newArrivals.title}
          <span className="absolute -bottom-4 left-0 w-12 h-0.5 bg-[#4A3525]"></span>
        </h2>
        <Link
          href={newArrivals.ctaHref}
          className="text-sm font-semibold tracking-wide text-[#6B4F3B] hover:text-[#EC7F13] transition-colors uppercase relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] auto after:bg-[#6B4F3B] after:hover:bg-[#EC7F13]"
        >
          {newArrivals.ctaLabel}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.items.map((item) => (
          <div key={item.id} className="group relative pt-4 cursor-pointer">
            <div className={`relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 ${item.bgColor}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/40 font-serif italic text-sm">{item.imageAlt}</span>
              </div>
              {item.isNew && (
                <span className="absolute top-4 left-4 bg-white text-[#4A3525] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  New
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-serif font-bold text-[#4A3525] mb-1">{item.name}</h3>
              <p className="text-xs font-sans text-[#6B4F3B]/60 mb-2">{item.material}</p>
              <p className="text-sm font-bold text-[#4A3525]">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
