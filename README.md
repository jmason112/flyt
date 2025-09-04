# Flyt — Travel App (Next.js + Lite API)

Branding
- App name: Flyt
- Logo: public/logo.png

Tech stack
- Next.js 15, TypeScript, Tailwind CSS
- React Query, React Hook Form, Zod
- MSW for API mocks
- Vitest + Testing Library, Playwright

Environment variables
- NEXT_PUBLIC_LITE_API_BASE_URL
- LITE_API_CLIENT_ID
- LITE_API_CLIENT_SECRET
- REFRESH_TOKEN_COOKIE_NAME
- APP_URL
- LOG_LEVEL

Setup
- pnpm i
- cp .env.example .env.local and fill values

Common scripts
- pnpm dev
- pnpm build && pnpm start
- pnpm typecheck
- pnpm lint
- pnpm test
- pnpm e2e

Testing
- Unit/component: pnpm test
- E2E (uses MSW mocks): pnpm build && pnpm start, then pnpm e2e
- Happy path: search → offer → checkout → confirmation
- Admin refund and basic a11y checks included

Notes
- All network calls go through lib/api/client.ts (ky).
- Access token stored in-memory; refresh handled via /auth/refresh httpOnly cookie.
- MSW is enabled in development via Providers.
