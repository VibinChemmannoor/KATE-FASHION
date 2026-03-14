import { HeroBanner } from "@/components/organisms/HeroBanner";
import { NewArrivals } from "@/components/organisms/NewArrivals";
import { CategoryShowcase } from "@/components/organisms/CategoryShowcase";

export const revalidate = 3600;

const FALLBACK_HOME_CONTENT = {
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
    items: [],
  },
  categories: {
    title: "Shop by Category",
    subtitle: "Thoughtfully curated for every milestone",
    items: [],
  },
};

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "KATERI | Luxury Childrenwear",
    description: "Sustainability meets style with elegant baby girl dresses and essentials.",
    alternates: { canonical: "https://yourdomain.com" },
  };
}

async function getHomeContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/home`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    return null;
  }
}

export default async function HomePage() {
  const content = (await getHomeContent()) || FALLBACK_HOME_CONTENT;

  return (
    <div className="flex flex-col gap-8 md:gap-16 pb-16">
      <HeroBanner hero={content.hero} />
      <NewArrivals newArrivals={content.newArrivals} />
      <CategoryShowcase categories={content.categories} />
    </div>
  );
}
