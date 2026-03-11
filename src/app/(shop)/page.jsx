import { HeroBanner } from "@/components/organisms/HeroBanner";
import { NewArrivals } from "@/components/organisms/NewArrivals";
import { CategoryShowcase } from "@/components/organisms/CategoryShowcase";

export const revalidate = 3600;

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

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-16 pb-16">
      <HeroBanner />
      <NewArrivals />
      <CategoryShowcase />
    </div>
  );
}
