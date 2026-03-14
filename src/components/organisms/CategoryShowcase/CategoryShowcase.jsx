import Link from "next/link";

/**
 * @param {{ categories: {
 *  title: string,
 *  subtitle: string,
 *  items: Array<{ id: number, title: string, href: string, ctaLabel: string, bgColor: string, textAlign: "left" | "center", imageAlt: string }>
 * } }} props
 */
export function CategoryShowcase({ categories }) {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16 mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-[#4A3525] mb-3">{categories.title}</h2>
        <p className="text-sm font-sans text-[#6B4F3B]/60 tracking-wide">{categories.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.items.map((item) => {
          const alignmentClass =
            item.textAlign === "center" ? "items-center text-center" : "items-start text-left";
          const gradientClass =
            item.textAlign === "center"
              ? "bg-gradient-to-t from-black/20 to-transparent"
              : "bg-gradient-to-t from-black/80 via-black/20 to-transparent";

          return (
            <div key={item.id} className="relative h-[450px] rounded-2xl overflow-hidden group">
              <div className={`absolute inset-0 ${item.bgColor}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/40 font-serif italic">{item.imageAlt}</span>
                </div>
              </div>
              <div className={`absolute inset-0 ${gradientClass}`}></div>

              <div className={`absolute bottom-0 left-0 w-full p-8 flex flex-col ${alignmentClass}`}>
                <h3 className="text-3xl font-serif font-bold text-[#FDFBF7] mb-4">
                  {item.title}
                </h3>
                <Link
                  href={item.href}
                  className="bg-[#FDFBF7] text-[#4A3525] font-semibold font-sans px-6 py-3 rounded-full text-sm hover:bg-[#F5F0E6] transition-colors"
                >
                  {item.ctaLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
