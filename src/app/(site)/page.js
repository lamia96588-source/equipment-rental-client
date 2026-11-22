import Hero from "@/components/home/Hero";
import {
  Categories,
  FeaturedEquipment,
  HowItWorks,
  OwnerCallout,
  RecentlyAdded,
  Reviews,
  WhyChooseUs,
} from "@/components/home/sections";
import { publicGet } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent, counts, reviews] = await Promise.all([
    publicGet("/equipment/featured", []),
    publicGet("/equipment/recent", []),
    publicGet("/equipment/category-counts", {}),
    publicGet("/reviews?limit=8", []),
  ]);

  return (
    <>
      <Hero />
      <FeaturedEquipment items={featured} />
      <Categories counts={counts} />
      <HowItWorks />
      <WhyChooseUs />
      <RecentlyAdded items={recent} />
      <Reviews items={reviews.slice(0, 8)} />
      <OwnerCallout />
    </>
  );
}
