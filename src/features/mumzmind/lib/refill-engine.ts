export interface RefillForecast {
  id: string;
  productName: string;
  daysRemaining: number;
  status: "Critical" | "Warning" | "Healthy";
  burnRate: string; // e.g., "5 per day"
  dailyRateText: string;
  runOutDate: string; // e.g., "May 12th"
}

/**
 * Consumption Rates Logic:
 * Calculates how long a product lasts based on baby age (in months).
 */
export function calculateRefillForecast(
  productName: string, 
  quantity: number, 
  babyAgeMonths: number
): RefillForecast | null {
  let dailyRate = 0;
  let unit = "";

  switch (productName) {
    case "Premium Diapers Size 3":
      // Newborns (0-3m) use ~8, Infants (4-8m) use ~6, Toddlers (9m+) use ~4
      dailyRate = babyAgeMonths <= 3 ? 8 : babyAgeMonths <= 8 ? 6 : 4;
      unit = "diapers";
      break;
    
    case "First Foods Cereal Kit":
      // Based on 2 feedings a day for infants, 3 for older
      dailyRate = babyAgeMonths < 6 ? 0 : babyAgeMonths <= 9 ? 2 : 3;
      unit = "servings";
      break;
    
    case "Soft Silicone Spoons":
      // Not a consumable, but we can mock a "Maintenance" schedule
      return null;

    case "Anti-Colic Bottle Set":
      // Not a consumable
      return null;

    default:
      // Generic consumable logic if quantity is large
      if (quantity > 10) {
        dailyRate = 2;
        unit = "units";
      } else {
        return null;
      }
  }

  if (dailyRate === 0) return null;

  // For demo, we assume the user bought 1 pack/unit
  // In a real app, this would be based on the pack size (e.g., 64 diapers)
  const packSize = productName.includes("Diapers") ? 64 : 20;
  const daysRemaining = Math.floor(packSize / dailyRate);
  
  const status = daysRemaining <= 3 ? "Critical" : daysRemaining <= 7 ? "Warning" : "Healthy";

  const runOutDateObj = new Date();
  runOutDateObj.setDate(runOutDateObj.getDate() + daysRemaining);
  const runOutDate = runOutDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    id: Math.random().toString(36).substr(2, 9),
    productName,
    daysRemaining,
    status,
    burnRate: `~${dailyRate * 7} ${unit} used every week`,
    dailyRateText: `${dailyRate} per day`,
    runOutDate: `${runOutDate}${getDaySuffix(runOutDateObj.getDate())}`
  };
}

function getDaySuffix(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}
