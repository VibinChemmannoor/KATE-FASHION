import { WishlistGrid } from "@/components/organisms/WishlistGrid";
import { RecommendedForYou } from "@/components/organisms/RecommendedForYou";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "My Favorites | KATERI",
    description: "View and manage your saved items at KATERI.",
    robots: { index: false, follow: false },
  };
}

export default function WishlistPage() {
  return (
    <div className="flex flex-col bg-[#FDFBF7] min-h-screen">
      <WishlistGrid />
      <RecommendedForYou />
    </div>
  );
}
