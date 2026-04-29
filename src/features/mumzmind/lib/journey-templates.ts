import type { JourneyCard, JourneyTone } from "../types";

export type JourneyTemplateInput = {
  babyName: string;
  stage: string;
  tone: JourneyTone;
};

type StageTemplate = {
  gentle: (babyName: string) => JourneyCard;
  premium: (babyName: string) => JourneyCard;
  "offer-led": (babyName: string) => JourneyCard;
};

const STAGE_TEMPLATES: Record<string, StageTemplate> = {
  "Newborn Care": {
    gentle: (babyName) => ({
      title: `${babyName} is settling into newborn care`,
      body:
        "Many parents at this stage keep everyday essentials close, including newborn diapers, wipes, swaddles, and feeding basics. A calm setup can make the early days feel a little more supported.",
      recommendedCategories: ["Newborn diapers", "Wipes", "Swaddles", "Feeding bottles", "Pacifiers"],
      gentleCTA: "Explore newborn essentials",
    }),
    premium: (babyName) => ({
      title: `A calm newborn edit for ${babyName}`,
      body:
        "This stage often calls for a thoughtfully curated mix of newborn diapers, wipes, swaddles, and feeding essentials. Keeping a few reliable basics on hand can make daily care feel more seamless.",
      recommendedCategories: ["Newborn diapers", "Wipes", "Swaddles", "Feeding bottles", "Pacifiers"],
      gentleCTA: "View the newborn collection",
    }),
    "offer-led": (babyName) => ({
      title: `${babyName}'s newborn essentials are worth a gentle refresh`,
      body:
        "Parents in this chapter often revisit newborn diapers, wipes, swaddles, and feeding basics to keep the routine comfortable and easy. It can help to gather the essentials in one place before they run low.",
      recommendedCategories: ["Newborn diapers", "Wipes", "Swaddles", "Feeding bottles", "Pacifiers"],
      gentleCTA: "See everyday newborn picks",
    }),
  },
  "Feeding Routine": {
    gentle: (babyName) => ({
      title: `${babyName} may be settling into a feeding routine`,
      body:
        "Many parents at this stage look for practical feeding support, from bottles and bibs to simple storage and cleaning essentials. Small preparations can make everyday feeding feel steadier and less rushed.",
      recommendedCategories: ["Feeding bottles", "Bottle brush", "Pacifiers", "Bibs", "Formula storage"],
      gentleCTA: "Explore feeding support",
    }),
    premium: (babyName) => ({
      title: `A thoughtful feeding setup for ${babyName}`,
      body:
        "As feeding patterns become more established, many families choose a polished set of bottles, bibs, and care essentials that make the routine feel more organized and comfortable.",
      recommendedCategories: ["Feeding bottles", "Bottle brush", "Pacifiers", "Bibs", "Formula storage"],
      gentleCTA: "Browse curated feeding essentials",
    }),
    "offer-led": (babyName) => ({
      title: `${babyName}'s feeding routine may be ready for a few helpful basics`,
      body:
        "At this point, many parents add fresh bottles, bibs, and easy-clean feeding essentials to keep the day moving smoothly. A simple refresh can support the routine without adding pressure.",
      recommendedCategories: ["Feeding bottles", "Bottle brush", "Pacifiers", "Bibs", "Formula storage"],
      gentleCTA: "See feeding essentials",
    }),
  },
  "Starting Solids": {
    gentle: (babyName) => ({
      title: `${babyName} may be ready for solids soon`,
      body:
        "Many parents at this stage begin preparing soft spoons, bibs, baby cereal, and a comfortable high chair. These essentials can make the first week of solids feel calmer and easier.",
      recommendedCategories: ["Baby cereal", "Soft spoons", "Bibs", "High chair", "Sippy cup"],
      gentleCTA: "Explore gentle essentials",
    }),
    premium: (babyName) => ({
      title: `A curated first-solids moment for ${babyName}`,
      body:
        "Families approaching this chapter often prepare a refined set of feeding essentials, including baby cereal, soft spoons, bibs, a high chair, and an easy first cup. A thoughtful setup can make the transition feel more comfortable.",
      recommendedCategories: ["Baby cereal", "Soft spoons", "Bibs", "High chair", "Sippy cup"],
      gentleCTA: "View the first-solids edit",
    }),
    "offer-led": (babyName) => ({
      title: `${babyName}'s next chapter may be starting solids`,
      body:
        "Many parents around this stage begin gathering soft spoons, bibs, baby cereal, and a supportive high chair before the first few meals. Having the basics ready can make the transition feel easier and more relaxed.",
      recommendedCategories: ["Baby cereal", "Soft spoons", "Bibs", "High chair", "Sippy cup"],
      gentleCTA: "See first-solids essentials",
    }),
  },
  "Crawling Prep": {
    gentle: (babyName) => ({
      title: `${babyName} may be getting closer to crawling`,
      body:
        "Parents often start preparing safe, engaging spaces at this stage with crawling toys, a comfortable play mat, and a few baby-proofing basics. A gentle setup can help this chapter feel more playful and secure.",
      recommendedCategories: ["Crawling toys", "Play mat", "Baby-proofing essentials"],
      gentleCTA: "Explore crawling prep",
    }),
    premium: (babyName) => ({
      title: `A polished crawling-prep setup for ${babyName}`,
      body:
        "As movement becomes more active, many families choose a curated mix of crawling toys, a soft play mat, and home-safety essentials. These details can help create a confident space for early exploration.",
      recommendedCategories: ["Crawling toys", "Play mat", "Baby-proofing essentials"],
      gentleCTA: "Browse curated crawling essentials",
    }),
    "offer-led": (babyName) => ({
      title: `${babyName}'s space may be ready for crawling prep`,
      body:
        "Many parents at this point add a few crawling toys, a play mat, and simple baby-proofing basics before the next burst of movement arrives. Preparing early can keep the transition feeling smooth.",
      recommendedCategories: ["Crawling toys", "Play mat", "Baby-proofing essentials"],
      gentleCTA: "See crawling-ready picks",
    }),
  },
  "First Shoes": {
    gentle: (babyName) => ({
      title: `${babyName} may be nearing the first-shoes stage`,
      body:
        "Around this chapter, many parents begin exploring soft first walker shoes, comfortable socks, and a few outdoor basics. Choosing gentle everyday essentials can make those first outings feel easier.",
      recommendedCategories: ["First walker shoes", "Toddler socks", "Outdoor stroller accessories"],
      gentleCTA: "Explore first-shoes essentials",
    }),
    premium: (babyName) => ({
      title: `A refined first-shoes edit for ${babyName}`,
      body:
        "When early standing and first steps feel closer, families often look for thoughtfully made first walker shoes, soft socks, and practical outdoor accessories. A curated selection can bring confidence to the transition.",
      recommendedCategories: ["First walker shoes", "Toddler socks", "Outdoor stroller accessories"],
      gentleCTA: "View the first-shoes collection",
    }),
    "offer-led": (babyName) => ({
      title: `${babyName}'s next step may be first shoes`,
      body:
        "Many parents at this stage begin preparing first walker shoes, toddler socks, and a few outdoor-ready accessories before those first steady steps arrive. Having the essentials ready can make the moment feel more relaxed.",
      recommendedCategories: ["First walker shoes", "Toddler socks", "Outdoor stroller accessories"],
      gentleCTA: "See first-step essentials",
    }),
  },
};

function fallbackTemplate(babyName: string): JourneyCard {
  return {
    title: "Next Chapter",
    body:
      "Every family journey moves at its own pace. Many parents at this stage choose a few dependable essentials that keep the next chapter feeling calm, comfortable, and well supported.",
    recommendedCategories: ["Everyday essentials", "Parent favorites", "Stage-based picks"],
    gentleCTA: `Explore ${babyName}'s next chapter`,
  };
}

export function generateJourneyCard(input: JourneyTemplateInput): JourneyCard {
  const babyName = input.babyName?.trim() || "Your baby";
  const stageName = input.stage?.trim() || "";
  const tone = input.tone ?? "gentle";
  const stageTemplate = STAGE_TEMPLATES[stageName];

  if (!stageTemplate) {
    return fallbackTemplate(babyName);
  }

  return stageTemplate[tone](babyName);
}
