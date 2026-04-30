# MumzMind — Baby Stage Intelligence Engine

> **Proactive Parenting Intelligence: Predicting the "Next Chapter" through Predictive Cart Logic and Premium Motion Design.**

---

## 🚀 The Problem
Modern parents are often overwhelmed by the rapid transitions between developmental stages (newborn care, starting solids, first steps). Traditional e-commerce platforms are **reactive**, showing products based on what a parent is buying *now*, rather than helping them prepare for what is coming *next*. This leads to "last-minute" shopping stress and missed opportunities for early developmental support.

## 💡 Our Solution
**MumzMind** is a high-fidelity intelligence engine that transforms the retail journey into a proactive, guided experience. By analyzing shopping patterns and manual inputs, MumzMind predicts a baby's developmental stage in real-time. It visualizes the "Journey Ahead" with a premium interactive timeline and offers **Dynamic Prep Kits**—curated bundles that solve for the next milestone before it arrives.

---

## 🏆 Track Selection
**Track Selected:** Track A

## 🔗 Live Demo
[View Live Demo](https://mumzworldai.vercel.app/)

---

## 🌟 Key Features

- **Rule-Based Intelligence Engine**: Real-time analysis of purchase history and cart items to determine developmental milestones.
- **Interactive First-Year Timeline**: A fluid, motion-rich visualization of growth stages from 0 to 12 months.
- **Live Age Correction Loop**: A seamless UI slider that allows parents to override predictions for 100% accurate guidance.
- **Dynamic Prep Kits**: Context-aware product bundles that unlock as the baby nears a new stage.
- **Premium Aesthetics**: Built with high-end typography, glassmorphism, and photorealistic assets for a luxury retail feel.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS (Custom tokens)
- **Animations**: Framer Motion (`motion/react`), GSAP
- **Smoothing**: Lenis (Smooth Scroll)
- **Icons**: Lucide React & Custom Premium Icons

---

## 🧠 How the Rule-Based Intelligence Works
The "Intelligence" in MumzMind is powered by a deterministic **Stage Engine** (`lib/stage-engine.ts`) designed for retail environments.

1. **Category Mapping**: Every product in the catalog is tagged with developmental metadata (e.g., "Size 1 Diapers" → "Newborn Care").
2. **State Sequence**: The engine maintains a sequential map of baby growth (Newborn → Solids → Crawling → First Steps).
3. **Inference Logic**: 
   - If a user adds "Baby Cereal" to their cart, the engine infers they are approaching the **Starting Solids** stage.
   - It calculates a **Confidence Score** based on timing, purchase frequency, and data freshness.
4. **Predictive Windows**: Each stage has a defined "Next Stage" and a timing window (e.g., "Starting Solids" is predicted 2-4 weeks before the transition).

---

## 🔮 Future Scope
- **Real LLM Integration**: Moving from rule-based logic to a true LLM for nuanced, conversational stage prediction.
- **Multi-Child Profiles**: Support for parents managing different timelines for multiple children.
- **Arabic Localization**: Full RTL support tailored for the Middle Eastern market.
- **Direct Checkout Integration**: Seamless API calls to retail backends for one-click prep kit fulfillment.

---

## 🏗️ Setup Instructions

### Prerequisites
- Node.js (Latest LTS)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/danyl-dnl/Mumzmind.git
   cd mumzmind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Navigate to `http://localhost:3000` in your browser.


