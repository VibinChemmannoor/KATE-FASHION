import "dotenv/config";

import { HomeContent } from "../src/lib/db/models/HomeContent.js";
import { Product } from "../src/lib/db/models/Product.js";
import { Category } from "../src/lib/db/models/Category.js";
import mongoose from "mongoose";
import { MONGODB_SERVER_SELECTION_TIMEOUT_MS } from "../src/lib/utils/constants.js";

const HOME_CONTENT = {
  hero: {
    collectionLabel: "Summer Collection 2024",
    titleLines: ["Softness for", "tiny", "miracles."],
    subtitle: "Handcrafted from 100% GOTS certified organic cotton for your baby's delicate skin.",
    ctaLabel: "Shop Collection",
    ctaHref: "/products",
    primaryImageAlt: "Baby illustration",
    secondaryImageAlt: "Hanging clothes image",
    image: "/Assets/banner-image1.jpg",
    hangingImage: "/Assets/banner-image1.jpg",
  },
  newArrivals: {
    title: "New Arrivals",
    ctaLabel: "View All Arrivals",
    ctaHref: "/products",
    items: [
      {
        id: 1,
        name: "Organic Knit Sweater",
        material: "Caramel Melange",
        price: "Rs 1,850",
        isNew: true,
        bgColor: "bg-[#D29E74]",
        imageAlt: "New arrival 1",
        image: "/Assets/image1.jpg",
      },
      {
        id: 2,
        name: "Hand-knit Booties",
        material: "Cream Wool",
        price: "Rs 1,250",
        isNew: false,
        bgColor: "bg-[#ff8a3d]",
        imageAlt: "New arrival 2",
        image: "/Assets/image2.jpg",
      },
      {
        id: 3,
        name: "The Welcome Set",
        material: "Essential Pack",
        price: "Rs 3,150",
        isNew: false,
        bgColor: "bg-[#181818]",
        imageAlt: "New arrival 3",
        image: "/Assets/image3.jpg",
      },
      {
        id: 4,
        name: "Heirloom Wooden Blocks",
        material: "Natural Beech",
        price: "Rs 1,950",
        isNew: false,
        bgColor: "bg-[#e7e7e7]",
        imageAlt: "New arrival 4",
        image: "/Assets/image4.jpg",
      },
    ],
  },
  categories: {
    title: "Shop by Category",
    subtitle: "Thoughtfully curated for every milestone",
    items: [
      {
        id: 1,
        title: "The Artisan Knitwear",
        href: "/category/artisan-knitwear",
        ctaLabel: "Explore Collection",
        bgColor: "bg-[#3A3C38]",
        textAlign: "left",
        imageAlt: "Artisan workshop image",
        image: "/Assets/banner-image2.jpg",
      },
      {
        id: 2,
        title: "Newborn Essentials",
        href: "/category/newborn-essentials",
        ctaLabel: "Shop Essentials",
        bgColor: "bg-[#C8A488]",
        textAlign: "center",
        imageAlt: "Newborn vector image",
        image: "/Assets/banner-image3.jpg",
      },
    ],
  },
};

const CATEGORIES = [
  {
    name: "Newborn Essentials",
    slug: "newborn-essentials",
    description: "Soft, breathable essentials for the earliest moments.",
    image: "/Assets/banner-image3.jpg",
    order: 1,
  },
  {
    name: "Artisan Knitwear",
    slug: "artisan-knitwear",
    description: "Heirloom knits crafted with delicate textures and warmth.",
    image: "/Assets/banner-image2.jpg",
    order: 2,
  },
  {
    name: "Occasion Dresses",
    slug: "occasion-dresses",
    description: "Elegant silhouettes for celebrations and special occasions.",
    image: "/Assets/banner-image1.jpg",
    order: 3,
  },
];

const PRODUCTS = [
  {
    slug: "organic-ribbed-cotton-romper",
    name: "Organic Ribbed Cotton Romper",
    description:
      "Crafted from GOTS certified organic cotton, this soft ribbed romper features nickel-free snaps for easy changes and a gentle stretch for growing little ones.",
    shortDescription: "A soft ribbed romper with gentle stretch and organic cotton comfort.",
    price: 1850,
    comparePrice: 2100,
    stock: 24,
    sku: "KATE-ROMPER-001",
    brand: "KATERI",
    categorySlug: "newborn-essentials",
    images: [
      { url: "/Assets/product-1.jpg", alt: "Romper front" },
      { url: "/Assets/product-1b.jpg", alt: "Romper back" },
    ],
    colors: [
      { name: "Caramel", swatchClass: "bg-[#D29E74]" },
      { name: "Cream", swatchClass: "bg-[#FDFBF7]" },
      { name: "Sage", swatchClass: "bg-[#8F9B8B]" },
    ],
    sizes: [
      { size: "0-3M", stock: 5 },
      { size: "3-6M", stock: 0 },
      { size: "6-9M", stock: 12 },
      { size: "9-12M", stock: 7 },
    ],
    tags: ["romper", "organic", "newborn"],
    material: "Organic Cotton",
    badge: "New Arrival",
    isFeatured: true,
    materialInfo: {
      description:
        "Our commitment to your baby's skin and the planet starts with our materials. This romper is made from GOTS certified long-staple cotton.",
      bullets: ["95% Organic Cotton, 5% Elastane", "Breathable ribbed texture", "Machine wash cold"],
    },
    sizeChart: [
      { size: "NB", age: "Up to 1M", height: "18-21\"", weight: "5-9 lbs" },
      { size: "3M", age: "1-3M", height: "21-24\"", weight: "9-12 lbs" },
      { size: "6M", age: "3-6M", height: "24-26\"", weight: "12-16 lbs" },
    ],
  },
  {
    slug: "velvet-bow-romper",
    name: "Velvet Bow Romper",
    description: "A luxe velvet romper with soft lining and an oversized bow detail.",
    shortDescription: "Velvet elegance with a soft lining and statement bow.",
    price: 2400,
    comparePrice: 2800,
    stock: 18,
    sku: "KATE-ROMPER-002",
    brand: "KATERI",
    categorySlug: "occasion-dresses",
    images: [{ url: "/Assets/product-2.jpg", alt: "Velvet bow romper" }],
    colors: [
      { name: "Rose", swatchClass: "bg-[#E5B4A0]" },
      { name: "Ivory", swatchClass: "bg-[#FDFBF7]" },
    ],
    sizes: [
      { size: "0-3M", stock: 6 },
      { size: "3-6M", stock: 6 },
      { size: "6-9M", stock: 6 },
    ],
    tags: ["romper", "velvet"],
    material: "Velvet Blend",
    badge: "Limited",
    materialInfo: {
      description: "Velvet blend with a soft, breathable lining for sensitive skin.",
      bullets: ["Velvet exterior", "Soft cotton lining", "Hand wash cold"],
    },
    sizeChart: [
      { size: "NB", age: "Up to 1M", height: "18-21\"", weight: "5-9 lbs" },
      { size: "3M", age: "1-3M", height: "21-24\"", weight: "9-12 lbs" },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const conn = await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: MONGODB_SERVER_SELECTION_TIMEOUT_MS,
  });
  console.log(`[Seed] Connected to database: ${conn.connection.name}`);

  await HomeContent.deleteMany({});
  await HomeContent.create(HOME_CONTENT);

  await Product.deleteMany({});
  await Category.deleteMany({});

  const createdCategories = await Category.insertMany(CATEGORIES);
  const categoryMap = createdCategories.reduce((acc, category) => {
    acc[category.slug] = category;
    return acc;
  }, {});

  const resolvedProducts = PRODUCTS.map((product) => {
    const category = categoryMap[product.categorySlug];
    if (!category) {
      throw new Error(`Missing category for product: ${product.slug}`);
    }

    return {
      ...product,
      categoryId: category._id,
      categorySlug: category.slug,
    };
  });

  const createdProducts = await Product.insertMany(resolvedProducts);

  console.log(
    `[Seed] Inserted categories: ${createdCategories.length}, products: ${createdProducts.length}`
  );
  console.log("Seed complete");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
