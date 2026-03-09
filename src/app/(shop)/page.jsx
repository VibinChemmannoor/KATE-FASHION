import { HeroBanner } from '@/components/organisms/HeroBanner';
import { NewArrivals } from '@/components/organisms/NewArrivals';
import { CategoryShowcase } from '@/components/organisms/CategoryShowcase';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-16 pb-16">
      <HeroBanner />
      <NewArrivals />
      <CategoryShowcase />
    </div>
  );
}
