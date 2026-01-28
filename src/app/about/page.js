export default function About() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-serif text-kate-dark mb-8"> आवर Story (Our Story)</h1>
      <div className="prose prose-lg mx-auto text-gray-600">
        <p className="mb-6">
          Founded in 2026, <strong>KATE Fashion</strong> was born from a desire to bring timeless elegance to the next generation. We believe that style knows no age, and every child deserves to feel like royalty.
        </p>
        <p className="mb-6">
          Our collections are handcrafted with love, using only the finest sustainable materials. From the first sketch to the final stitch, we ensure every piece meets our high standards of quality and comfort.
        </p>
        <div className="my-12 h-80 bg-gray-200 rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542462662-e1707923769c?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" />
        </div>
        <p>
          Join us in our journey to redefine children's luxury fashion.
        </p>
      </div>
    </div>
  );
}
