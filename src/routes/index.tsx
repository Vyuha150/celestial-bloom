import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CursorLayer } from "@/components/site/CursorLayer";
import { CinematicHero } from "@/components/hero/CinematicHero";
import { ProductJourney } from "@/components/hero/ProductJourney";
import {
  ScienceOfElevation,
  CollectionsGrid,
  MaterialAndFormula,
  Manifesto,
  FeaturedProduct,
} from "@/components/sections/LandingSections";

const DESCRIPTION =
  "Celestial — scientifically extracted cosmetics, supplements, essence and nutrition. Precision, elevated beyond the ordinary.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celestial — Precision, Elevated Beyond the Ordinary" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Celestial — Precision, Elevated Beyond the Ordinary" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Celestial — Precision, Elevated Beyond the Ordinary" },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <SmoothScroll />
      <CursorLayer />
      <SiteHeader />
      <main>
        <CinematicHero />
        <ProductJourney />
        <ScienceOfElevation />
        <CollectionsGrid />
        <MaterialAndFormula />
        <Manifesto />
        <FeaturedProduct />
      </main>
      <SiteFooter />
    </div>
  );
}
