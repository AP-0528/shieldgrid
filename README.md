## ShieldGrid Frontend

AI-powered parametric income protection screens for India’s delivery heroes. This Next.js App Router UI includes:
- Hero/onboarding card with payout promise, benefit list, and CTAs (Get Started, Link UPI)
- Live coverage dashboard (coverage status, rainfall + traffic trackers, zone monitoring map, premium reevaluation, stats chips, bottom nav)
- AI-optimized quote card (weekly premium, risk forecast, coverage details, live monitoring map, activation CTA)
- Payout history timeline (YTD payouts, activity tabs, trigger events, transaction receipts, plan/renewal chips)

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Space Grotesk + inline SVG icon set

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Lint
```bash
npm run lint
```

## Notes
- Remote hero photo served from images.unsplash.com (allowed in next.config.ts).
- Layout is mobile-first but scales up to desktop with two-column grouping.
