import { notFound } from "next/navigation";

import { CategoryPage } from "@/components/templates/CategoryPage/CategoryPage";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/lib/db/models/Category";
import { Product } from "@/lib/db/models/Product";
import { PRODUCTS_PAGE_SIZE } from "@/lib/utils/constants";

export const revalidate = 1800;

/**
 * @param {{ params: { slug: string } }} props
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params }) {
  await connectToDatabase();

  const category = await Category.findOne({ slug: params.slug, isActive: true }).lean();
  if (!category) {
    return {
      title: "Category | KATERI",
      description: "Explore our baby girl dress collections.",
      alternates: { canonical: `https://yourdomain.com/category/${params.slug}` },
    };
  }

  return {
    title: `${category.name} | KATERI`,
    description: category.description || `Shop ${category.name} at KATERI.`,
    alternates: { canonical: `https://yourdomain.com/category/${category.slug}` },
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
  category: {
    id: product.categoryId?.toString?.() || "",
    name: product.categoryName || "",
    slug: product.categorySlug || "",
  },
  sizes: product.sizes,
  colors: product.colors,
  material: product.material,
  badge: product.badge,
});

export default async function CategoryRoutePage({ params }) {
  await connectToDatabase();

  const category = await Category.findOne({ slug: params.slug, isActive: true }).lean();
  if (!category) {
    notFound();
  }

  const [products, total] = await Promise.all([
    Product.find({ categoryId: category._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(PRODUCTS_PAGE_SIZE)
      .lean(),
    Product.countDocuments({ categoryId: category._id, isActive: true }),
  ]);

  const initialProducts = products.map((product) =>
    serializeProduct({
      ...product,
      categoryName: category.name,
      categorySlug: category.slug,
    })
  );

  const initialPagination = {
    page: 1,
    limit: PRODUCTS_PAGE_SIZE,
    total,
    totalPages: Math.ceil(total / PRODUCTS_PAGE_SIZE),
    hasMore: PRODUCTS_PAGE_SIZE < total,
  };

  return (
    <CategoryPage
      category={{ name: category.name, description: category.description, slug: category.slug }}
      initialProducts={initialProducts}
      initialPagination={initialPagination}
    />
  );
}
