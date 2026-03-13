/**
 * Database Seed Script for KATE FASHION
 * Run: node scripts/seed.mjs
 *
 * Requires MONGODB_URI environment variable
 */

import mongoose from "mongoose";
import "dotenv/config";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

// Category Schema
const CategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, default: "KATE FASHION" },
    images: [{ url: String, alt: String, order: Number }],
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [String],
    sizes: [String],
    colors: [{ name: String, hex: String }],
    material: { type: String, default: "" },
    ageGroup: { type: String, default: "" },
    gender: { type: String, enum: ["boy", "girl", "unisex"], default: "unisex" },
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    badge: { type: String, default: "" },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
const Product = mongoose.model("Product", ProductSchema);

const categories = [
  {
    slug: "boys",
    name: "Boys",
    description: "Stylish and comfortable clothing for little boys",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
    order: 1,
  },
  {
    slug: "girls",
    name: "Girls",
    description: "Beautiful dresses and outfits for little girls",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600",
    order: 2,
  },
  {
    slug: "newborn",
    name: "Newborn",
    description: "Soft and gentle essentials for newborns (0-12 months)",
    image: "https://images.unsplash.com/photo-1522771930-78b353868502?w=600",
    order: 3,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Hats, socks, bibs and more",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
    order: 4,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});
  console.log("Cleared existing data");

  // Insert categories
  const insertedCategories = await Category.insertMany(categories);
  console.log(`Inserted ${insertedCategories.length} categories`);

  const catMap = {};
  for (const cat of insertedCategories) {
    catMap[cat.slug] = cat._id;
  }

  // Products
  const products = [
    // Boys
    {
      slug: "organic-cotton-polo-shirt",
      name: "Organic Cotton Polo Shirt",
      description: "A classic polo shirt made from 100% organic cotton. Breathable, soft, and perfect for everyday wear. Features a button-up collar and ribbed cuffs.",
      shortDescription: "Classic organic cotton polo for boys",
      price: 899,
      comparePrice: 1299,
      stock: 45,
      sku: "KF-BOY-001",
      categoryId: catMap["boys"],
      images: [{ url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600", alt: "Organic Cotton Polo", order: 0 }],
      tags: ["polo", "organic", "cotton", "casual"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
      colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Navy", hex: "#1B3A57" }, { name: "Sage", hex: "#9CAF88" }],
      material: "100% Organic Cotton",
      ageGroup: "2-7 years",
      gender: "boy",
      isFeatured: true,
      badge: "BESTSELLER",
    },
    {
      slug: "linen-shorts-set",
      name: "Linen Shorts Set",
      description: "A matching linen shirt and shorts set. Perfect for summer outings and celebrations. Features coconut shell buttons and an elastic waistband.",
      shortDescription: "Breezy linen set for warm days",
      price: 1499,
      comparePrice: 1999,
      stock: 30,
      sku: "KF-BOY-002",
      categoryId: catMap["boys"],
      images: [{ url: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600", alt: "Linen Shorts Set", order: 0 }],
      tags: ["linen", "set", "summer", "formal"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      colors: [{ name: "Beige", hex: "#D4C5A9" }, { name: "Light Blue", hex: "#A8C8E8" }],
      material: "Pure Linen",
      ageGroup: "2-6 years",
      gender: "boy",
      isFeatured: true,
      badge: "NEW",
    },
    {
      slug: "cotton-dungarees",
      name: "Cotton Dungarees",
      description: "Adorable cotton dungarees with adjustable straps and front pocket. Made from premium organic cotton denim with a soft inner lining.",
      shortDescription: "Classic dungarees in organic cotton denim",
      price: 1299,
      stock: 25,
      sku: "KF-BOY-003",
      categoryId: catMap["boys"],
      images: [{ url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600", alt: "Cotton Dungarees", order: 0 }],
      tags: ["dungarees", "denim", "organic", "casual"],
      sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y"],
      colors: [{ name: "Indigo", hex: "#3F5277" }, { name: "Light Wash", hex: "#8FABC7" }],
      material: "Organic Cotton Denim",
      ageGroup: "1-5 years",
      gender: "boy",
      badge: "",
    },
    {
      slug: "knitted-cardigan-boys",
      name: "Knitted Cardigan",
      description: "A cozy knitted cardigan made from the softest organic cotton yarn. Features wooden buttons and ribbed edges for a snug fit.",
      shortDescription: "Cozy organic cotton knit cardigan",
      price: 1199,
      comparePrice: 1599,
      stock: 20,
      sku: "KF-BOY-004",
      categoryId: catMap["boys"],
      images: [{ url: "https://images.unsplash.com/photo-1522771930-78b353868502?w=600", alt: "Knitted Cardigan", order: 0 }],
      tags: ["cardigan", "knitted", "winter", "organic"],
      sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      colors: [{ name: "Cream", hex: "#F5F0E1" }, { name: "Brown", hex: "#8B6F4E" }],
      material: "100% Organic Cotton Yarn",
      ageGroup: "1-6 years",
      gender: "boy",
      isFeatured: false,
      badge: "SALE",
    },

    // Girls
    {
      slug: "floral-cotton-dress",
      name: "Floral Cotton Dress",
      description: "A beautiful floral print dress with puff sleeves and a twirl-worthy skirt. Made from breathable organic cotton with a comfortable cotton lining.",
      shortDescription: "Charming floral print dress",
      price: 1399,
      comparePrice: 1799,
      stock: 35,
      sku: "KF-GIRL-001",
      categoryId: catMap["girls"],
      images: [{ url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600", alt: "Floral Cotton Dress", order: 0 }],
      tags: ["dress", "floral", "cotton", "party"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
      colors: [{ name: "Pink Floral", hex: "#F4B8C5" }, { name: "Blue Floral", hex: "#A8C8E8" }],
      material: "100% Organic Cotton",
      ageGroup: "2-7 years",
      gender: "girl",
      isFeatured: true,
      badge: "BESTSELLER",
    },
    {
      slug: "tulle-party-dress",
      name: "Tulle Party Dress",
      description: "A magical tulle dress for special occasions. Features a soft cotton bodice, satin ribbon waist, and layers of delicate tulle for a princess-worthy look.",
      shortDescription: "Magical tulle dress for special days",
      price: 2499,
      stock: 15,
      sku: "KF-GIRL-002",
      categoryId: catMap["girls"],
      images: [{ url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600", alt: "Tulle Party Dress", order: 0 }],
      tags: ["dress", "tulle", "party", "formal", "princess"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      colors: [{ name: "Blush", hex: "#E8C5C5" }, { name: "Ivory", hex: "#FFFFF0" }],
      material: "Cotton Bodice, Tulle Skirt",
      ageGroup: "2-6 years",
      gender: "girl",
      isFeatured: true,
      badge: "NEW",
    },
    {
      slug: "embroidered-romper-girls",
      name: "Embroidered Romper",
      description: "A sweet romper with hand-embroidered floral details. Features adjustable straps, snap closures, and a relaxed fit for easy movement.",
      shortDescription: "Hand-embroidered cotton romper",
      price: 999,
      comparePrice: 1399,
      stock: 40,
      sku: "KF-GIRL-003",
      categoryId: catMap["girls"],
      images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600", alt: "Embroidered Romper", order: 0 }],
      tags: ["romper", "embroidered", "summer", "casual"],
      sizes: ["6-12M", "1-2Y", "2-3Y", "3-4Y"],
      colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Lavender", hex: "#C8A8E8" }],
      material: "Organic Cotton",
      ageGroup: "6m-4 years",
      gender: "girl",
      badge: "SALE",
    },
    {
      slug: "cotton-leggings-set-girls",
      name: "Cotton Leggings Set",
      description: "A coordinated top and leggings set in the softest organic cotton. Perfect for playtime or casual outings. The leggings feature a wide elastic waistband.",
      shortDescription: "Comfy cotton leggings and top set",
      price: 799,
      stock: 50,
      sku: "KF-GIRL-004",
      categoryId: catMap["girls"],
      images: [{ url: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600", alt: "Cotton Leggings Set", order: 0 }],
      tags: ["leggings", "set", "casual", "everyday"],
      sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      colors: [{ name: "Rose", hex: "#E8B4B8" }, { name: "Sage", hex: "#9CAF88" }, { name: "Mustard", hex: "#D4A843" }],
      material: "95% Organic Cotton, 5% Elastane",
      ageGroup: "1-6 years",
      gender: "girl",
      badge: "",
    },

    // Newborn
    {
      slug: "organic-muslin-bodysuit-set",
      name: "Organic Muslin Bodysuit Set",
      description: "A pack of 3 organic muslin bodysuits in gentle pastel colors. Extra-soft for delicate newborn skin with envelope neckline and snap closures.",
      shortDescription: "3-pack organic muslin bodysuits",
      price: 1299,
      comparePrice: 1799,
      stock: 60,
      sku: "KF-NB-001",
      categoryId: catMap["newborn"],
      images: [{ url: "https://images.unsplash.com/photo-1522771930-78b353868502?w=600", alt: "Muslin Bodysuit Set", order: 0 }],
      tags: ["bodysuit", "muslin", "organic", "pack", "essential"],
      sizes: ["0-3M", "3-6M", "6-9M", "9-12M"],
      colors: [{ name: "Pastel Mix", hex: "#F0E6D3" }],
      material: "100% Organic Muslin",
      ageGroup: "0-12 months",
      gender: "unisex",
      isFeatured: true,
      badge: "BESTSELLER",
    },
    {
      slug: "knitted-booties",
      name: "Hand-Knitted Booties",
      description: "Adorable hand-knitted booties made from the softest organic cotton yarn. Features a secure tie closure to keep them on tiny feet.",
      shortDescription: "Soft hand-knitted baby booties",
      price: 499,
      stock: 80,
      sku: "KF-NB-002",
      categoryId: catMap["newborn"],
      images: [{ url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", alt: "Knitted Booties", order: 0 }],
      tags: ["booties", "knitted", "organic", "gift"],
      sizes: ["0-3M", "3-6M", "6-12M"],
      colors: [{ name: "Cream", hex: "#F5F0E1" }, { name: "Sage", hex: "#9CAF88" }, { name: "Blush", hex: "#E8C5C5" }],
      material: "Organic Cotton Yarn",
      ageGroup: "0-12 months",
      gender: "unisex",
      isFeatured: true,
      badge: "NEW",
    },
    {
      slug: "swaddle-blanket-set",
      name: "Muslin Swaddle Blanket Set",
      description: "A set of 2 large muslin swaddle blankets in beautiful prints. Pre-washed for softness, breathable, and gets softer with every wash.",
      shortDescription: "2-pack premium muslin swaddles",
      price: 999,
      stock: 45,
      sku: "KF-NB-003",
      categoryId: catMap["newborn"],
      images: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600", alt: "Swaddle Blanket Set", order: 0 }],
      tags: ["swaddle", "blanket", "muslin", "essential", "gift"],
      sizes: ["One Size"],
      colors: [{ name: "Animal Print", hex: "#E8DDD0" }, { name: "Floral", hex: "#F4D9D9" }],
      material: "Organic Muslin Cotton",
      ageGroup: "0-12 months",
      gender: "unisex",
      badge: "",
    },
    {
      slug: "newborn-welcome-set",
      name: "Newborn Welcome Set",
      description: "The perfect gift set for a new arrival. Includes a bodysuit, hat, mittens, and booties all in matching organic cotton. Comes in a beautiful gift box.",
      shortDescription: "Complete newborn essentials gift box",
      price: 2299,
      comparePrice: 2999,
      stock: 20,
      sku: "KF-NB-004",
      categoryId: catMap["newborn"],
      images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600", alt: "Newborn Welcome Set", order: 0 }],
      tags: ["gift", "set", "newborn", "organic", "essential"],
      sizes: ["0-3M", "3-6M"],
      colors: [{ name: "Ivory", hex: "#FFFFF0" }, { name: "Sage", hex: "#9CAF88" }],
      material: "100% Organic Cotton",
      ageGroup: "0-6 months",
      gender: "unisex",
      isFeatured: true,
      badge: "GIFT SET",
    },

    // Accessories
    {
      slug: "sun-hat-organic",
      name: "Organic Cotton Sun Hat",
      description: "A wide-brim sun hat with UPF 50+ protection. Made from organic cotton with a chin strap to keep it secure on windy days.",
      shortDescription: "UPF 50+ organic cotton sun hat",
      price: 599,
      stock: 55,
      sku: "KF-ACC-001",
      categoryId: catMap["accessories"],
      images: [{ url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", alt: "Sun Hat", order: 0 }],
      tags: ["hat", "sun protection", "organic", "summer"],
      sizes: ["S (6-12M)", "M (1-3Y)", "L (3-6Y)"],
      colors: [{ name: "Natural", hex: "#E8DDD0" }, { name: "Blue", hex: "#A8C8E8" }],
      material: "Organic Cotton, UPF 50+",
      ageGroup: "6m-6 years",
      gender: "unisex",
      badge: "NEW",
    },
    {
      slug: "bamboo-socks-pack",
      name: "Bamboo Socks 5-Pack",
      description: "Ultra-soft bamboo socks in a pack of 5 adorable designs. Anti-bacterial, moisture-wicking, and incredibly comfortable for little feet.",
      shortDescription: "5-pack of soft bamboo baby socks",
      price: 699,
      comparePrice: 899,
      stock: 70,
      sku: "KF-ACC-002",
      categoryId: catMap["accessories"],
      images: [{ url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", alt: "Bamboo Socks Pack", order: 0 }],
      tags: ["socks", "bamboo", "pack", "essential"],
      sizes: ["0-6M", "6-12M", "1-3Y", "3-5Y"],
      colors: [{ name: "Mixed Pastels", hex: "#E8DDD0" }],
      material: "80% Bamboo, 18% Cotton, 2% Spandex",
      ageGroup: "0-5 years",
      gender: "unisex",
      badge: "SALE",
    },
  ];

  const insertedProducts = await Product.insertMany(products);
  console.log(`Inserted ${insertedProducts.length} products`);

  console.log("\nSeed completed successfully!");
  console.log(`Categories: ${insertedCategories.length}`);
  console.log(`Products: ${insertedProducts.length}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
