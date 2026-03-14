import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/organisms/ProductGallery";
import { ProductInfo } from "@/components/organisms/ProductInfo";
import { ProductDetailsTabs } from "@/components/organisms/ProductDetailsTabs";
import { CompleteTheLook } from "@/components/organisms/CompleteTheLook";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";

/**
 * @param {{ params: { slug: string } }} props
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  await connectToDatabase();
  const product = await Product.findOne({ slug: params.slug, isActive: true }).lean();

  if (!product) {
    return {
      title: "Product | KATERI",
      description: "Discover organic baby girl fashion essentials.",
      alternates: { canonical: `https://yourdomain.com/products/${params.slug}` },
    };
  }

  return {
    title: `${product.name} | KATERI`,
    description: product.description?.slice(0, 160),
    alternates: { canonical: `https://yourdomain.com/products/${params.slug}` },
  };
}

const serializeProduct = (product) => ({
  id: product._id.toString(),
  slug: product.slug,
  name: product.name,
  description: product.description,
  price: product.price,
  comparePrice: product.comparePrice,
  colors: product.colors || [],
  sizes: product.sizes || [],
  images: (product.images || []).map((img) => ({
    url: img.url || img.src || "",
    alt: img.alt || product.name,
  })),
  materialInfo: product.materialInfo || { description: "", bullets: [] },
  sizeChart: product.sizeChart || [],
  category: product.categoryId
    ? { name: product.categoryId.name, slug: product.categoryId.slug }
    : null,
});

export default async function ProductDetailPage({ params }) {
  await connectToDatabase();

  const product = await Product.findOne({ slug: params.slug, isActive: true })
    .populate("categoryId", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  const resolvedProduct = serializeProduct(product);

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <div className="container mx-auto px-4 md:px-8 pt-8 pb-4">
        <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B4F3B]/60 mb-8 font-sans">
          <Link href="/" className="hover:text-[#EC7F13] transition-colors">
            HOME
          </Link>
          {resolvedProduct.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${resolvedProduct.category.slug}`}
                className="hover:text-[#EC7F13] transition-colors"
              >
                {resolvedProduct.category.name.toUpperCase()}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-[#A4550A]">{resolvedProduct.name.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <ProductGallery images={resolvedProduct.images} />
          <ProductInfo product={resolvedProduct} />
        </div>
      </div>

      <ProductDetailsTabs
        materialInfo={resolvedProduct.materialInfo}
        sizeChart={resolvedProduct.sizeChart}
      />
      <CompleteTheLook />
    </div>
  );
}
