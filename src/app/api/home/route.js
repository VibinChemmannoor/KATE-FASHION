import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/security/rateLimit";
import { connectToDatabase } from "@/lib/db/mongoose";
import { HomeContent } from "@/lib/db/models/HomeContent";
import { Category } from "@/lib/db/models/Category";
import { HOME_RATE_LIMIT_MAX, HOME_RATE_LIMIT_WINDOW } from "@/lib/utils/constants";

const DEFAULT_HOME_CONTENT = {
  hero: {
    collectionLabel: "Summer Collection 2024",
    titleLines: ["Softness for", "tiny", "miracles."],
    subtitle: "Handcrafted from 100% GOTS certified organic cotton for your baby's delicate skin.",
    ctaLabel: "Shop Collection",
    ctaHref: "/products",
    primaryImageAlt: "Baby illustration",
    secondaryImageAlt: "Hanging clothes image",
    image: "/Assets/banner-image1.jpg",
    hangingImage: "/Assets/hanging-dress1.jpg",
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
        price: "$48.00",
        isNew: true,
        bgColor: "bg-[#D29E74]",
        imageAlt: "New arrival 1",
        image: "/Assets/image5.jpg",
      },
      {
        id: 2,
        name: "Hand-knit Booties",
        material: "Cream Wool",
        price: "$32.00",
        isNew: false,
        bgColor: "bg-[#ff8a3d]",
        imageAlt: "New arrival 2",
        image: "/Assets/image2.jpg",
      },
      {
        id: 3,
        name: "The Welcome Set",
        material: "Essential Pack",
        price: "$85.00",
        isNew: false,
        bgColor: "bg-[#181818]",
        imageAlt: "New arrival 3",
        image: "/Assets/image3.jpg",
      },
      {
        id: 4,
        name: "Heirloom Wooden Blocks",
        material: "Natural Beech",
        price: "$42.00",
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

const CATEGORY_BG_COLORS = ["bg-[#3A3C38]", "bg-[#C8A488]", "bg-[#8D9E83]", "bg-[#A2B59D]"];

/**
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  try {
    const limit = await rateLimit(request, { max: HOME_RATE_LIMIT_MAX, window: HOME_RATE_LIMIT_WINDOW });
    if (!limit.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await connectToDatabase();
    const content = await HomeContent.findOne().sort({ updatedAt: -1 }).lean();
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    const dynamicCategories = categories.map((category, index) => ({
      id: category._id.toString(),
      title: category.name,
      href: `/category/${category.slug}`,
      ctaLabel: "Shop Collection",
      bgColor: CATEGORY_BG_COLORS[index % CATEGORY_BG_COLORS.length],
      textAlign: index % 2 === 0 ? "left" : "center",
      imageAlt: category.name,
      image: category.image || "",
    }));

    const resolved = content || DEFAULT_HOME_CONTENT;
    const merged = {
      ...resolved,
      categories: {
        ...resolved.categories,
        items: dynamicCategories.length ? dynamicCategories : resolved.categories.items,
      },
    };

    return NextResponse.json({ data: merged });
  } catch (error) {
    console.error("[Home Content]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
