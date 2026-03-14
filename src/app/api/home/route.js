import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/security/rateLimit";
import { connectToDatabase } from "@/lib/db/mongoose";
import { HomeContent } from "@/lib/db/models/HomeContent";
import { HOME_RATE_LIMIT_MAX, HOME_RATE_LIMIT_WINDOW } from "@/lib/utils/constants";

const DEFAULT_HOME_CONTENT = {
  hero: {
    collectionLabel: "Summer Collection 2024",
    titleLines: ["Softness for", "tiny", "miracles."],
    subtitle: "Handcrafted from 100% GOTS certified organic cotton for your baby's delicate skin.",
    ctaLabel: "Shop Collection",
    ctaHref: "/collections/summer-2024",
    primaryImageAlt: "Baby illustration",
    secondaryImageAlt: "Hanging clothes image",
  },
  newArrivals: {
    title: "New Arrivals",
    ctaLabel: "View All Arrivals",
    ctaHref: "/collections/new-arrivals",
    items: [
      {
        id: 1,
        name: "Organic Knit Sweater",
        material: "Caramel Melange",
        price: "$48.00",
        isNew: true,
        bgColor: "bg-[#D29E74]",
        imageAlt: "New arrival 1",
      },
      {
        id: 2,
        name: "Hand-knit Booties",
        material: "Cream Wool",
        price: "$32.00",
        isNew: false,
        bgColor: "bg-[#ff8a3d]",
        imageAlt: "New arrival 2",
      },
      {
        id: 3,
        name: "The Welcome Set",
        material: "Essential Pack",
        price: "$85.00",
        isNew: false,
        bgColor: "bg-[#181818]",
        imageAlt: "New arrival 3",
      },
      {
        id: 4,
        name: "Heirloom Wooden Blocks",
        material: "Natural Beech",
        price: "$42.00",
        isNew: false,
        bgColor: "bg-[#e7e7e7]",
        imageAlt: "New arrival 4",
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
      },
      {
        id: 2,
        title: "Newborn Essentials",
        href: "/category/newborn-essentials",
        ctaLabel: "Shop Essentials",
        bgColor: "bg-[#C8A488]",
        textAlign: "center",
        imageAlt: "Newborn vector image",
      },
    ],
  },
};

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

    return NextResponse.json({ data: content || DEFAULT_HOME_CONTENT });
  } catch (error) {
    console.error("[Home Content]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
