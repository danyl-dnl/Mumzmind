export interface SafetyCheck {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

export const SAFETY_ROADMAP: Record<string, SafetyCheck[]> = {
  "Newborn Care": [
    { id: "s1", title: "Safe Sleep Environment", description: "Ensure the crib is empty of pillows, blankets, and plush toys.", priority: "High" },
    { id: "s2", title: "Bath Water Temp", description: "Always check water with your elbow before dipping baby.", priority: "High" },
  ],
  "Feeding Routine": [
    { id: "f1", title: "Bottle Hygiene", description: "Ensure all feeding equipment is sterilized daily.", priority: "High" },
    { id: "f2", title: "Upright Feeding", description: "Keep baby's head elevated during and after feeding to prevent reflux.", priority: "Medium" },
  ],
  "Rolling": [
    { id: "r1", title: "Surface Safety", description: "Never leave baby unattended on a changing table or bed; rolling can happen instantly.", priority: "High" },
    { id: "r2", title: "Soft Corner Guards", description: "Time to install corner guards on low-level coffee tables.", priority: "Medium" },
  ],
  "Starting Solids": [
    { id: "ss1", title: "Choking Hazards", description: "Cut all food into age-appropriate sizes (smash peas, quarter grapes).", priority: "High" },
    { id: "ss2", title: "High Chair Straps", description: "Always use the 5-point harness, even if they aren't wiggly yet.", priority: "High" },
  ],
  "Crawling": [
    { id: "c1", title: "Outlet Covers", description: "Install baby-proof covers on all accessible electrical outlets.", priority: "High" },
    { id: "c2", title: "Stair Gates", description: "Secure top and bottom of stairs with hardware-mounted gates.", priority: "High" },
    { id: "c3", title: "Low Cabinet Locks", description: "Lock away all cleaning supplies and heavy pans.", priority: "High" },
  ],
  "First Steps": [
    { id: "w1", title: "Anchored Furniture", description: "Anchor heavy bookshelves and TVs to the wall; they will try to climb.", priority: "High" },
    { id: "w2", title: "Sharp Edge Audit", description: "Re-check all coffee table and console corners at the new height.", priority: "Medium" },
  ],
};
