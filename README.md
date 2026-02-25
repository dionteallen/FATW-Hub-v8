# FATW Hub (MVP v2)

Adds:
- Admin console (/admin):
  - Create artist access link + email it
  - Mint CAU to a wallet (server-side admin key)
  - Create/link sponsor profile to sponsor login email
- Artist portal security improvement:
  - Artist id is NOT in the URL
  - A short-lived, signed httpOnly cookie session is used after claim

## Run
1) Copy `.env.example` → `.env`
2) `npm i`
3) `npm run prisma:migrate`
4) `npm run dev`

## Admin setup
- Sign in with your email once
- Set your user role to ADMIN (Prisma Studio: `npm run prisma:studio`)
- Visit `/admin`

## Key endpoints
- Eventbrite webhook: `/api/eventbrite/webhook`
- DocuSeal webhook: `/api/docuseal/webhook`


## Go-live
See `GO_LIVE_TOMORROW.md`

- Dashboard: /dashboard
- Ticket code claim: /claim?code=FATW-XXXXXX


## Deploy
See `DEPLOY_VERCEL_TOMORROW.md`

## Security
See `SECURITY.md`

## Quickstart env
Use `.env.quickstart` as a template.
