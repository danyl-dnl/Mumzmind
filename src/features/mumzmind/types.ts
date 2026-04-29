export type RiskLevel = "Low" | "Medium" | "High";

export type SupportedLanguage = "en" | "ar";

export type JourneyTone = "gentle" | "premium" | "offer-led";

export type PurchaseEvent = {
  productName: string;
  category: string;
  date: string;
  quantity: number;
  price: number;
};

export type FamilyProfile = {
  id: string;
  parentName: string;
  babyName: string;
  predictedAgeMonths: number;
  confidence: number;
  currentStage: string;
  nextStage: string;
  nextStageWindow: string;
  purchaseHistory: PurchaseEvent[];
  riskLevel: RiskLevel;
  daysSilent: number;
  preferredLanguage: string;
  country: string;
};

export type BabyStage = {
  id: string;
  name: string;
  ageRangeMonths: string;
  recommendedCategories: string[];
  signals: string[];
  nextLikelyStages: string[];
  parentMessage: string;
};

export type StageRecommendation = {
  stage: string;
  recommendedCategories: string[];
  message: string;
};

export type StagePredictionResult = {
  predictedAgeMonths: number;
  currentStage: string;
  nextStage: string;
  nextStageWindow: string;
  confidence: number;
  recommendedCategories: string[];
  explanationSignals: string[];
  riskLevel: RiskLevel;
  nextBestAction: string;
  nextThreeStages: string[];
};

export type JourneyCard = {
  title: string;
  body: string;
  recommendedCategories: string[];
  gentleCTA: string;
};
