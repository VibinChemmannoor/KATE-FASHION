import { WishlistGrid } from '@/components/organisms/WishlistGrid';
import { RecommendedForYou } from '@/components/organisms/RecommendedForYou';

export const metadata = {
  title: "My Favorites | KATERI",
  description: "View and manage your saved items at KATERI.",
};

export default function WishlistPage() {
  return (
    <div className="flex flex-col bg-[#FDFBF7] min-h-screen">
      <WishlistGrid />
      <RecommendedForYou />
    </div>
  );
}
