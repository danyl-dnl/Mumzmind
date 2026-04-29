import type {
  FamilyProfile,
  PurchaseEvent,
  RiskLevel,
  StagePredictionResult,
} from "../types";

const STAGE_SEQUENCE = [
  "Newborn Care",
  "Diaper Size 1",
  "Diaper Size 2",
  "Diaper Size 3",
  "Feeding Routine",
  "Starting Solids",
  "Sitting Support",
  "Crawling Prep",
  "First Shoes",
  "Toddler Snacks",
] as const;

const STAGE_MIDPOINT_MONTHS: Record<string, number> = {
  "Newborn Care": 1,
  "Diaper Size 1": 2,
  "Diaper Size 2": 4,
  "Diaper Size 3": 6,
  "Feeding Routine": 5,
  "Starting Solids": 6,
  "Sitting Support": 7,
  "Crawling Prep": 8,
  "First Shoes": 11,
  "Toddler Snacks": 14,
};

const STAGE_WINDOWS: Record<string, string> = {
  "Diaper Size 1": "2-4 weeks",
  "Diaper Size 2": "3-5 weeks",
  "Diaper Size 3": "2-4 weeks",
  "Feeding Routine": "2-4 weeks",
  "Starting Solids": "2-4 weeks",
  "Sitting Support": "3-5 weeks",
  "Crawling Prep": "4-6 weeks",
  "First Shoes": "4-6 weeks",
  "Toddler Snacks": "6-8 weeks",
};

const NEXT_STAGE_BY_CURRENT: Record<string, string> = {
  "Newborn Care": "Diaper Size 1",
  "Diaper Size 1": "Diaper Size 2",
  "Diaper Size 2": "Diaper Size 3",
  "Diaper Size 3": "Starting Solids",
  "Feeding Routine": "Starting Solids",
  "Starting Solids": "Sitting Support",
  "Sitting Support": "Crawling Prep",
  "Crawling Prep": "First Shoes",
  "First Shoes": "Toddler Snacks",
  "Toddler Snacks": "Toddler Snacks",
};

const NEXT_STAGE_CATEGORY_MAP: Record<string, string[]> = {
  "Diaper Size 1": ["Size 1 diapers", "Wipes", "Feeding bottle"],
  "Diaper Size 2": ["Size 2 diapers", "Wipes", "Pacifier"],
  "Diaper Size 3": ["Size 3 diapers", "Wipes", "Feeding bottle"],
  "Feeding Routine": ["Feeding bottle", "Pacifier", "Burp cloths"],
  "Starting Solids": ["Baby cereal", "Soft spoons", "Bibs", "High chair", "Sippy cup"],
  "Sitting Support": ["Support seat", "High chair", "Floor play essentials"],
  "Crawling Prep": ["Crawling toys", "Play mat", "Baby-proofing essentials"],
  "First Shoes": ["First walker shoes", "Toddler socks", "Outdoor stroller accessories"],
  "Toddler Snacks": ["Snack containers", "Toddler snacks", "Sippy cup"],
};

const KEY_STAGE_CATEGORIES = new Set([
  "size 3 diapers",
  "baby cereal",
  "high chair",
  "crawling toys",
  "baby shoes",
]);

const REPEATABLE_CONSUMABLE_CATEGORIES = new Set([
  "newborn diapers",
  "size 1 diapers",
  "size 2 diapers",
  "size 3 diapers",
  "wipes",
  "feeding bottle",
  "baby cereal",
]);

function normalize(value: string | undefined | null): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizePurchaseHistory(purchaseHistory: PurchaseEvent[] | undefined): PurchaseEvent[] {
  return Array.isArray(purchaseHistory) ? purchaseHistory : [];
}

function hasCategory(purchases: PurchaseEvent[], category: string): boolean {
  const needle = normalize(category);

  return purchases.some((purchase) => {
    const purchaseCategory = normalize(purchase.category);
    const productName = normalize(purchase.productName);

    return purchaseCategory.includes(needle) || productName.includes(needle);
  });
}

function countCategory(purchases: PurchaseEvent[], category: string): number {
  const needle = normalize(category);

  return purchases.reduce((count, purchase) => {
    const purchaseCategory = normalize(purchase.category);
    const productName = normalize(purchase.productName);

    return purchaseCategory.includes(needle) || productName.includes(needle)
      ? count + 1
      : count;
  }, 0);
}

function getLatestPurchase(purchases: PurchaseEvent[], category: string): PurchaseEvent | null {
  const needle = normalize(category);

  const matchingPurchases = purchases.filter((purchase) => {
    const purchaseCategory = normalize(purchase.category);
    const productName = normalize(purchase.productName);

    return purchaseCategory.includes(needle) || productName.includes(needle);
  });

  if (!matchingPurchases.length) {
    return null;
  }

  return [...matchingPurchases].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  })[0];
}

function isPurchaseRecent(purchase: PurchaseEvent | null, days = 60): boolean {
  if (!purchase?.date) {
    return false;
  }

  const purchaseDate = new Date(purchase.date).getTime();

  if (Number.isNaN(purchaseDate)) {
    return false;
  }

  const now = Date.now();
  const diffInDays = (now - purchaseDate) / (1000 * 60 * 60 * 24);

  return diffInDays <= days;
}

function inferCurrentStage(purchases: PurchaseEvent[], fallbackStage: string): string {
  const hasBabyShoes = hasCategory(purchases, "baby shoes");
  const hasCrawlingToys = hasCategory(purchases, "crawling toys");
  const hasSolidsProducts =
    hasCategory(purchases, "baby cereal") ||
    hasCategory(purchases, "bibs") ||
    hasCategory(purchases, "high chair");
  const hasSize3 = hasCategory(purchases, "size 3 diapers");
  const hasSize2 = hasCategory(purchases, "size 2 diapers");
  const hasSize1 = hasCategory(purchases, "size 1 diapers");
  const hasNewborn = hasCategory(purchases, "newborn diapers");
  const hasFeedingBottle = hasCategory(purchases, "feeding bottle");

  if (hasBabyShoes) {
    return "First Shoes";
  }

  if (hasCrawlingToys) {
    return "Crawling Prep";
  }

  if (hasSolidsProducts) {
    return "Starting Solids";
  }

  if (hasSize3) {
    return "Diaper Size 3";
  }

  if (hasSize2) {
    return "Diaper Size 2";
  }

  if (hasSize1) {
    return "Diaper Size 1";
  }

  if (hasNewborn) {
    return "Newborn Care";
  }

  if (hasFeedingBottle) {
    return "Feeding Routine";
  }

  return fallbackStage || "Newborn Care";
}

function inferPredictedAgeMonths(currentStage: string, fallbackAge: number): number {
  return STAGE_MIDPOINT_MONTHS[currentStage] ?? fallbackAge ?? 0;
}

function hasNextStageProducts(nextStage: string, purchases: PurchaseEvent[]): boolean {
  return getRecommendedCategories(nextStage).some((category) => hasCategory(purchases, category));
}

function detectRepeatConsumablePattern(purchases: PurchaseEvent[]): boolean {
  const categoryCounts = new Map<string, number>();

  for (const purchase of purchases) {
    const normalizedCategory = normalize(purchase.category);

    if (!REPEATABLE_CONSUMABLE_CATEGORIES.has(normalizedCategory)) {
      continue;
    }

    categoryCounts.set(
      normalizedCategory,
      (categoryCounts.get(normalizedCategory) ?? 0) + 1,
    );
  }

  return Array.from(categoryCounts.values()).some((count) => count >= 2);
}

function buildExplanationSignals(params: {
  currentStage: string;
  nextStage: string;
  purchases: PurchaseEvent[];
  hasFeedingPattern: boolean;
  missingNextStageProducts: boolean;
  purchaseTimingMatches: boolean;
  repeatConsumablePattern: boolean;
}): string[] {
  const {
    currentStage,
    nextStage,
    purchases,
    hasFeedingPattern,
    missingNextStageProducts,
    purchaseTimingMatches,
    repeatConsumablePattern,
  } = params;

  const signals: string[] = [];

  if (currentStage === "Diaper Size 3" && getLatestPurchase(purchases, "size 3 diapers")) {
    signals.push("Recent size 3 diaper purchase detected");
  }

  if (hasFeedingPattern && nextStage === "Starting Solids") {
    signals.push("Feeding pattern suggests transition toward solids");
  }

  if (missingNextStageProducts) {
    signals.push("No next-stage products purchased yet");
  }

  signals.push("Similar journey pattern matched");

  if (purchaseTimingMatches) {
    signals.push("Purchase timing matches this baby stage window");
  }

  if (repeatConsumablePattern) {
    signals.push("Repeat consumable pattern detected");
  }

  if (!signals.length) {
    signals.push("Limited purchase history available, using baseline stage rules");
  }

  return signals;
}

function calculateConfidence(params: {
  family: FamilyProfile;
  currentStage: string;
  predictedAgeMonths: number;
  purchases: PurchaseEvent[];
  nextStage: string;
}): {
  confidence: number;
  hasFeedingPattern: boolean;
  missingNextStageProducts: boolean;
  purchaseTimingMatches: boolean;
  repeatConsumablePattern: boolean;
} {
  const { family, currentStage, predictedAgeMonths, purchases, nextStage } = params;

  let confidence = 50;

  const diaperAgeMatches =
    (currentStage === "Newborn Care" && predictedAgeMonths >= 0 && predictedAgeMonths <= 2) ||
    (currentStage === "Diaper Size 1" && predictedAgeMonths >= 1 && predictedAgeMonths <= 3) ||
    (currentStage === "Diaper Size 2" && predictedAgeMonths >= 3 && predictedAgeMonths <= 5) ||
    (currentStage === "Diaper Size 3" && predictedAgeMonths >= 5 && predictedAgeMonths <= 7);

  if (diaperAgeMatches) {
    confidence += 15;
  }

  const feedingBottleCount = countCategory(purchases, "feeding bottle");
  const hasFeedingPattern =
    feedingBottleCount > 0 &&
    predictedAgeMonths >= 3 &&
    predictedAgeMonths <= 6;

  if (hasFeedingPattern) {
    confidence += 10;
  }

  const missingNextStageProducts = !hasNextStageProducts(nextStage, purchases);

  if (missingNextStageProducts) {
    confidence += 10;
  }

  const recentStagePurchase =
    getLatestPurchase(purchases, "size 3 diapers") ??
    getLatestPurchase(purchases, "size 2 diapers") ??
    getLatestPurchase(purchases, "size 1 diapers") ??
    getLatestPurchase(purchases, "newborn diapers") ??
    getLatestPurchase(purchases, "crawling toys") ??
    getLatestPurchase(purchases, "baby shoes");

  const purchaseTimingMatches = isPurchaseRecent(recentStagePurchase, 75);

  if (purchaseTimingMatches) {
    confidence += 8;
  }

  const repeatConsumablePattern = detectRepeatConsumablePattern(purchases);

  if (repeatConsumablePattern) {
    confidence += 4;
  }

  // Preserve family confidence as a weak fallback only when evidence is thin.
  if (purchases.length < 2 && family.confidence > confidence) {
    confidence = Math.min(family.confidence, 95);
  }

  return {
    confidence: Math.min(confidence, 95),
    hasFeedingPattern,
    missingNextStageProducts,
    purchaseTimingMatches,
    repeatConsumablePattern,
  };
}

export function getNextThreeStages(currentStage: string): string[] {
  const currentIndex = STAGE_SEQUENCE.indexOf(
    currentStage as (typeof STAGE_SEQUENCE)[number],
  );

  if (currentIndex === -1) {
    return STAGE_SEQUENCE.slice(0, 3);
  }

  return STAGE_SEQUENCE.slice(currentIndex + 1, currentIndex + 4);
}

export function calculateRiskLevel(family: FamilyProfile): RiskLevel {
  const purchases = normalizePurchaseHistory(family.purchaseHistory);
  const daysSilent = Number.isFinite(family.daysSilent) ? family.daysSilent : 0;

  const mostRecentKeyStagePurchase = purchases
    .filter((purchase) => KEY_STAGE_CATEGORIES.has(normalize(purchase.category)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;

  if (daysSilent >= 21 && mostRecentKeyStagePurchase) {
    return "High";
  }

  if (daysSilent >= 12 && (mostRecentKeyStagePurchase || purchases.length > 0)) {
    return "Medium";
  }

  return "Low";
}

export function getRecommendedCategories(nextStage: string): string[] {
  return NEXT_STAGE_CATEGORY_MAP[nextStage] ?? ["Wipes", "Everyday baby essentials"];
}

function getNextBestAction(nextStage: string, riskLevel: RiskLevel): string {
  if (riskLevel === "High") {
    return "Send gentle reactivation journey";
  }

  if (nextStage === "Starting Solids") {
    return "Send Starting Solids journey";
  }

  if (nextStage === "Diaper Size 3") {
    return "Send diaper transition reminder";
  }

  if (nextStage === "Crawling Prep") {
    return "Send crawling prep guide";
  }

  if (nextStage === "First Shoes") {
    return "Send first shoes journey";
  }

  return "Send gentle stage guidance";
}

export function predictBabyStage(family: FamilyProfile): StagePredictionResult {
  const purchases = normalizePurchaseHistory(family.purchaseHistory);
  const currentStage = inferCurrentStage(purchases, family.currentStage);
  const nextStage = NEXT_STAGE_BY_CURRENT[currentStage] ?? family.nextStage ?? "Starting Solids";
  const predictedAgeMonths = inferPredictedAgeMonths(
    currentStage,
    family.predictedAgeMonths,
  );

  const {
    confidence,
    hasFeedingPattern,
    missingNextStageProducts,
    purchaseTimingMatches,
    repeatConsumablePattern,
  } = calculateConfidence({
    family,
    currentStage,
    predictedAgeMonths,
    purchases,
    nextStage,
  });

  const explanationSignals = buildExplanationSignals({
    currentStage,
    nextStage,
    purchases,
    hasFeedingPattern,
    missingNextStageProducts,
    purchaseTimingMatches,
    repeatConsumablePattern,
  });

  const riskLevel = calculateRiskLevel(family);
  const recommendedCategories = getRecommendedCategories(nextStage);

  return {
    predictedAgeMonths,
    currentStage,
    nextStage,
    nextStageWindow: STAGE_WINDOWS[nextStage] ?? family.nextStageWindow ?? "2-4 weeks",
    confidence,
    recommendedCategories,
    explanationSignals,
    riskLevel,
    nextBestAction: getNextBestAction(nextStage, riskLevel),
    nextThreeStages: getNextThreeStages(currentStage),
  };
}
