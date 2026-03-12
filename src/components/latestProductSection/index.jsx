import React from "react";
import ProductCard from "../ProductCard";
import { MOCK_PRODUCTS } from "../mockdata/mockData";
import Link from "next/link";

const LatestProducts = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-kate-dark">Latest Arrivals</h2>
        <Link
          href="/products"
          className="text-kate-medium hover:text-kate-dark font-medium underline underline-offset-4"
        >
          View All
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
