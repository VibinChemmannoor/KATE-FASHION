import { ProductsPage } from "@/components/templates/ProductsPage/ProductsPage";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Product } from "@/lib/db/models/Product";
import { PRODUCTS_PAGE_SIZE } from "@/lib/utils/constants";

export const revalidate = 1800;

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "All Products | KATERI",
    description: "Browse all baby girl dresses and essentials from KATERI.",
    alternates: { canonical: "https://yourdomain.com/products" },
  };
}

const serializeProduct = (product) => ({
  id: product._id.toString(),
  slug: product.slug,
  name: product.name,
  description: product.description,
  shortDescription: product.shortDescription || product.description?.slice(0, 140) || "",
  price: product.price,
  comparePrice: product.comparePrice,
  stock: product.stock,
  sku: product.sku,
  brand: product.brand,
  images: (product.images || []).map((img) => ({
    url: img.url || img.src || "",
    alt: img.alt || product.name,
  })),
  category: product.categoryId
    ? {
        id: product.categoryId._id?.toString?.() || product.categoryId.toString?.(),
        name: product.categoryId.name,
        slug: product.categoryId.slug,
      }
    : null,
  sizes: product.sizes,
  colors: product.colors,
  material: product.material,
  badge: product.badge,
});

export default async function ProductsRoutePage() {
  await connectToDatabase();

  const [products, total] = await Promise.all([
    Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(PRODUCTS_PAGE_SIZE)
      .populate("categoryId", "name slug")
      .lean(),
    Product.countDocuments({ isActive: true }),
  ]);

  const initialProducts = products.map(serializeProduct);
  const initialPagination = {
    page: 1,
    limit: PRODUCTS_PAGE_SIZE,
    total,
    totalPages: Math.ceil(total / PRODUCTS_PAGE_SIZE),
    hasMore: PRODUCTS_PAGE_SIZE < total,
  };

  return <ProductsPage initialProducts={initialProducts} initialPagination={initialPagination} />;
}
