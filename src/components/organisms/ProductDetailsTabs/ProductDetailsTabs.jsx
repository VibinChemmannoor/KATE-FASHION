export function ProductDetailsTabs({ materialInfo, sizeChart }) {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 border-t border-[#F5F0E6] mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Material & Care */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#4A3525] mb-6 italic">Material & Care</h2>
          <p className="text-sm font-sans text-[#6B4F3B]/80 leading-relaxed mb-6">
            {materialInfo.description}
          </p>
          <ul className="space-y-3">
            {materialInfo.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm font-sans text-[#4A3525]">
                <span className="text-[#C89B3C] mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Size Chart */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#4A3525] mb-6 italic">Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#F5F0E6]">
                  <th className="py-4 px-4 font-bold text-[#4A3525] uppercase tracking-wider text-xs">Size</th>
                  <th className="py-4 px-4 font-bold text-[#4A3525] uppercase tracking-wider text-xs text-center">Age</th>
                  <th className="py-4 px-4 font-bold text-[#4A3525] uppercase tracking-wider text-xs text-center">Height</th>
                  <th className="py-4 px-4 font-bold text-[#4A3525] uppercase tracking-wider text-xs text-center">Weight</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#F5F0E6]/50 hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-4 px-4 font-bold text-[#4A3525]">{row.size}</td>
                    <td className="py-4 px-4 text-[#6B4F3B]/80 text-center">{row.age}</td>
                    <td className="py-4 px-4 text-[#6B4F3B]/80 text-center">{row.height}</td>
                    <td className="py-4 px-4 text-[#6B4F3B]/80 text-center">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
