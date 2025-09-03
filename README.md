# Travel App (Next.js + Lite API)

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

Notes
- All network calls go through lib/api/client.ts (ky).
- Access token stored in-memory; refresh handled via /auth/refresh httpOnly cookie.
- MSW is enabled in development via Providers.
