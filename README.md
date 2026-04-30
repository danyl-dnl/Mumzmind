# MumzMind

Premium baby-stage intelligence prototype for a Mumzworld-style parenting platform.

## Problem Statement

Parents often know what they already need today, but not always what may be coming next. That creates uncertainty around stage transitions such as diaper changes, feeding shifts, solids, crawling, and first shoes. For a parenting platform, that also makes it harder to guide families with timely, useful recommendations in a way that feels calm and supportive.

## Solution Overview

MumzMind is a frontend prototype that helps parents prepare for a baby’s next likely stage using:

- local mock purchase data
- deterministic rule-based stage logic
- confidence scoring
- English-only journey templates

It also includes an internal CRM preview for business teams to understand family-stage opportunities and prepare gentle lifecycle journeys.

## Key Features

- Premium multi-page frontend prototype with real Next.js App Router routes
- Parent-facing stage guidance for a default fictional family: Sara and baby Omar
- Rule-based baby stage prediction from local purchase history
- Next-stage recommendations and explanation signals
- Journey timeline and stage-detail experience
- Internal CRM preview with KPI cards, stage distribution, reminder opportunities, and template journeys
- English-only template journey generation with no external model calls
- Responsive UI with premium mother-care styling and motion polish

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- GSAP + ScrollTrigger + Lenis
- Motion
- Recharts
- Local JSON mock data

## Routes / Pages

- `/` — Landing page
- `/parent` — Parent feed
- `/stage` — Stage detail / next chapter guide
- `/timeline` — Baby journey timeline
- `/crm` — Internal CRM preview

## How The Local Stage Logic Works

The stage engine lives in `src/features/mumzmind/lib/stage-engine.ts`.

It uses deterministic rules based on local purchase history patterns, including:

- newborn diapers suggesting the earliest months
- diaper size transitions suggesting age/stage progression
- feeding bottle activity contributing to feeding-stage confidence
- solids-related products indicating the transition into starting solids
- crawling toys and baby shoes indicating later movement stages
- silence after key purchases contributing to risk level

For each family profile, the engine returns:

- predicted age in months
- current stage
- next stage
- next stage window
- confidence score
- recommended categories
- explanation signals
- risk level
- next best action
- next three likely stages

This logic is local, typed, and explainable by design.

## No AI API

This prototype does **not** use:

- OpenAI or any external AI API
- Supabase
- backend services
- real-time databases
- real customer data

All predictions and journey outputs are generated locally from:

- fictional JSON mock data
- deterministic TypeScript rules
- fixed English-only journey templates

This makes the prototype easier to demo, explain, and evaluate without hidden remote dependencies.

## CRM Privacy / Admin Note

The `/crm` dashboard is an **internal/admin concept**, not a parent-facing experience.

It uses fictional demo data only. In production, this area would require:

- authentication
- role-based access control
- audit/privacy controls
- secure customer data handling

The current implementation is intentionally framed as a demo preview, not a public dashboard.

## Current Limitations

- Uses fictional local mock data only
- No backend or persistence
- No authentication or authorization
- No parent account management
- No real ecommerce, cart, or checkout integration
- No real CRM or messaging integrations
- Parent corrections are prototype-level UI only
- Journey content is template-based, not dynamically learned
- English-only content for the current prototype

## Future Scope

- Real customer purchase data integration
- ML-based stage prediction
- Persistent parent corrections
- CRM / email / WhatsApp campaign integration
- Verified Arabic localization
- Ecommerce / cart integration

## How To Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

Optional quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
