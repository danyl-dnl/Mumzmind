export interface ProductTip {
  id: string;
  productName: string;
  tipTitle: string;
  tipDescription: string;
  category: "Usage" | "Maintenance" | "Development";
}

export const PRODUCT_MASTERY_TIPS: Record<string, ProductTip[]> = {
  "Premium Diapers Size 3": [
    { id: "d1", productName: "Premium Diapers", tipTitle: "The Overnight Fold", tipDescription: "Fold the top inner edge inward to create a pocket that prevents leaks during long night sleeps.", category: "Usage" },
    { id: "d2", productName: "Premium Diapers", tipTitle: "Size Check", tipDescription: "If you start seeing red marks around legs, it's time to move up a size, even if weight range says otherwise.", category: "Maintenance" },
  ],
  "Soft Silicone Spoons": [
    { id: "s1", productName: "Silicone Spoons", tipTitle: "Self-Feeding Starter", tipDescription: "Let baby hold one spoon while you feed with another to encourage independent motor skills.", category: "Development" },
    { id: "s2", productName: "Silicone Spoons", tipTitle: "Teething Relief", tipDescription: "Place spoons in the fridge for 10 minutes to provide soothing relief for sore gums during feeding.", category: "Usage" },
  ],
  "First Foods Cereal Kit": [
    { id: "c1", productName: "Cereal Kit", tipTitle: "Gradual Texture", tipDescription: "Start with a watery consistency and gradually increase thickness over 2 weeks to help baby adjust.", category: "Usage" },
    { id: "c2", productName: "Cereal Kit", tipTitle: "Mix with Breastmilk", tipDescription: "Mixing cereal with familiar breastmilk or formula makes the transition to solids much more successful.", category: "Development" },
  ],
  "Ergonomic High Chair": [
    { id: "h1", productName: "High Chair", tipTitle: "Footrest Alignment", tipDescription: "Adjust the footrest so baby's knees are at a 90-degree angle; this stability improves swallowing safety.", category: "Usage" },
    { id: "h2", productName: "High Chair", tipTitle: "Post-Meal Deep Clean", tipDescription: "Remove the tray cover and straps weekly to prevent hidden mold buildup in the crevices.", category: "Maintenance" },
  ],
  "Silicone Catch Bibs": [
    { id: "b1", productName: "Catch Bibs", tipTitle: "Dishwasher Safe", tipDescription: "These are top-rack dishwasher safe! Save time by throwing them in with your evening load.", category: "Maintenance" },
    { id: "b2", productName: "Catch Bibs", tipTitle: "Travel Hack", tipDescription: "Roll utensils inside the bib's pocket and button it closed for a mess-free travel feeding kit.", category: "Usage" },
  ],
  "Crawling Bear Toy": [
    { id: "cb1", productName: "Crawling Bear", tipTitle: "Tummy Time Target", tipDescription: "Place the bear just out of reach during tummy time to motivate baby to push up and lunge forward.", category: "Development" },
  ],
  "Luxury Play Mat": [
    { id: "pm1", productName: "Play Mat", tipTitle: "Rotation Strategy", tipDescription: "Rotate the mat's orientation weekly to ensure even wear and give baby a 'new' perspective on the room.", category: "Maintenance" },
  ],
  "Anti-Colic Bottle Set": [
    { id: "bo1", productName: "Anti-Colic Bottle", tipTitle: "Vent Alignment", tipDescription: "Ensure the air vent is facing upwards during feeding to maximize the vacuum-free effect.", category: "Usage" },
    { id: "bo2", productName: "Anti-Colic Bottle", tipTitle: "Paced Feeding", tipDescription: "Hold the bottle horizontally so the baby has to actively suck, mimicking the effort of breastfeeding.", category: "Development" },
  ],
  "First Walker Shoes": [
    { id: "sh1", productName: "Walker Shoes", tipTitle: "The Thumb Test", tipDescription: "Ensure there is a thumb's width of space between the big toe and the tip of the shoe.", category: "Usage" },
    { id: "sh2", productName: "Walker Shoes", tipTitle: "Indoor Barefoot Time", tipDescription: "Use shoes for outdoors; let baby stay barefoot indoors to help them feel the ground and build balance.", category: "Development" },
  ],
  "No-Spill Sippy Cup": [
    { id: "sc1", productName: "Sippy Cup", tipTitle: "Valve Check", tipDescription: "If flow seems slow, pinch the silicone valve to ensure the slit hasn't stuck shut after washing.", category: "Maintenance" },
  ],
};
