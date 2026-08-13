# LegalEase

> **Copyright © 2026 Mesbah Ghalib. All rights reserved.** This repository is provided for academic evaluation and portfolio review only. No permission is granted to copy, reuse, modify, distribute, publish, sublicense, or submit this work, its design, assets, or documentation as another person's work.

LegalEase is an original legal-professional discovery platform. Guests can find published lawyers, Users can hire and pay after acceptance, Lawyers can manage verified professional listings, and Admins can moderate records and view live analytics.

## Stack

React, Vite, React Router, Tailwind CSS, TanStack Query, Axios, Framer Motion, Recharts, and Playwright/Vitest for verification.

## Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and provide only public client values.

```bash
npm test
npm run test:e2e
npm run lint
npm run build
```

`test:e2e` uses runtime-only credentials when an authenticated browser audit is needed; do not commit them.

## Core capabilities

- Safe public lawyer discovery, filters, pagination, and details.
- Email/password and Google authentication with role-aware dashboards.
- Lawyer profile upload through the backend/imgBB path and verified publishing eligibility.
- Server-authorized hiring, Stripe Checkout payment verification, transaction visibility, and paid-client comments.
- Admin user/lawyer moderation, transactions, and Atlas-derived analytics.

## Production deployment

Client and API deploy as separate Vercel projects. The production browser always uses `VITE_API_BASE_URL=/api`; Vercel rewrites `/api/:path*` to the final API deployment before the SPA `index.html` fallback.

Production client environment names:

```text
VITE_API_BASE_URL
VITE_GOOGLE_CLIENT_ID
VITE_APP_NAME
```

Never expose server secrets, Stripe secrets, MongoDB credentials, imgBB API keys, or passwords in the client environment, source, or documentation.

## Intentional scope boundaries

LegalEase does not implement Stripe Connect payouts, refunds UI, subscriptions, ratings, or lawyer bank transfers.
