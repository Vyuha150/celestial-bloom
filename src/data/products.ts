import catCore from "@/assets/cat-core.jpg";
import catBio from "@/assets/cat-bio.jpg";
import catPowders from "@/assets/cat-powders.jpg";
import catBeverages from "@/assets/cat-beverages.jpg";
import catGummies from "@/assets/cat-gummies.jpg";
import catLuxury from "@/assets/cat-luxury.jpg";
import catDiagnostic from "@/assets/cat-diagnostic.jpg";

export type Category = {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  items: string[];
};

export const categories: Category[] = [
  {
    slug: "core-performance-stack",
    title: "Core Performance Stack",
    tagline: "The daily operating system. Foundational molecules for the elite human.",
    image: catCore,
    items: [
      "Precision greens complex (v.12+)",
      "Complete amino acid matrix",
      "Mitochondrial energy formula",
      "Cognitive performance blend",
      "Adaptogen stress protocol",
      "Circadian rhythm sleep stack",
      "VO2 max support formula",
    ],
  },
  {
    slug: "bioavailability-capsules",
    title: "Bioavailability-Enhanced Capsules",
    tagline: "Liposomal & nano-delivery. Up to 8× absorption versus standard isolates.",
    image: catBio,
    items: [
      "Liposomal Vitamin C",
      "Nanoemulsion CoQ10",
      "Magnesium glycinate (chelated)",
      "Zinc bisglycinate complex",
      "D3+K2 in MCT oil softgel",
      "Methylated B12 sublingual",
      "Berberine precision capsule",
    ],
  },
  {
    slug: "precision-powders",
    title: "Precision Powders",
    tagline: "Micro-filtered, third-party verified. Built for serious athletes.",
    image: catPowders,
    items: [
      "Whey isolate (grass-fed, micro-filtered)",
      "Collagen peptides Type I+III",
      "Creatine monohydrate (Creapure® grade)",
      "Beta-glucan immune complex",
      "Reishi + Lion's Mane dual extract",
      "Colostrum protein blend",
      "Electrolyte precision formula",
    ],
  },
  {
    slug: "functional-beverages",
    title: "Functional Beverages — Premium RTD",
    tagline: "Ready-to-drink performance. Engineered, never just bottled.",
    image: catBeverages,
    items: [
      "Nootropic focus shot (30ml)",
      "Adaptogen recovery drink",
      "NMN longevity elixir",
      "Hydrogen-rich mineral water",
      "Collagen glow drink",
      "Prebiotic + probiotic sparkling drink",
      "Ashwagandha KSM-66® latte",
    ],
  },
  {
    slug: "smart-gummies-strips",
    title: "Smart Gummies & Strips",
    tagline: "Discreet delivery. Clinical doses. Couture-grade flavor.",
    image: catGummies,
    items: [
      "NAD+ longevity gummy",
      "Melatonin + L-theanine sleep gummy",
      "Lion's Mane cognitive gummy",
      "Astaxanthin antioxidant gummy",
      "Oral dissolving zinc strip",
      "B12 sublingual strip",
      "Iron bisglycinate gummy",
    ],
  },
  {
    slug: "luxury-ready-to-consume",
    title: "Luxury Ready-to-Consume",
    tagline: "Macros, locked. Flavor, refined. Performance, edible.",
    image: catLuxury,
    items: [
      "Precision nutrition bar (macros locked)",
      "Ketogenic fat bomb",
      "Protein chef's selection box",
      "Nootropic dark chocolate",
      "Functional mushroom cacao",
      "High-DHA smoked salmon snack",
      "Advanced whey parfait cup",
    ],
  },
  {
    slug: "diagnostic-protocols",
    title: "Diagnostic & Protocol Kits",
    tagline: "Measurement is the protocol. Test, iterate, flourish.",
    image: catDiagnostic,
    items: [
      "At-home biomarker test kit",
      "30-day performance protocol box",
      "Seasonal immunity protocol kit",
      "Gut microbiome + probiotic pairing kit",
      "Athlete's quarterly refill subscription",
      "Corporate wellness stack kit",
    ],
  },
];

export const totalSkus = categories.reduce((n, c) => n + c.items.length, 0);
