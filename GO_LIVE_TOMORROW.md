# Go-Live Checklist (FATW Hub)

This is the quickest path to launch a usable MVP without custodying funds.

## 0) What this MVP DOES / DOES NOT do
- DOES: Eventbrite remains cashier; USD remains register; CAU is perks + access
- DOES: Create users from Eventbrite buyers by email
- DOES: Let users sign in by email, connect wallet, and receive CAU (cron-minted)
- DOES: Artist private portal via emailed link, DocuSeal signing, Sheets logging
- DOES: Sponsors sign in and manage offers
- DOES: Redeem flow: burn CAU → paste tx hash → receive promo/receipt code (USD fulfillment)
- DOES NOT: Custody user wallets or payment info
- DOES NOT: Auto-create wallets for users without them (it supports Coinbase Wallet + WalletConnect)

## 1) Hosting
Recommended: Vercel (front-end + API routes).
- Create a new project from this repo
- Set env vars (see `.env.example`)
- Deploy

## 2) Database
Recommended: Neon Postgres (free tier).
- Create DB, copy connection string to `DATABASE_URL`
- Run migrations locally once, or use Vercel build step.

## 3) Email (magic links + artist links)
Cheapest: Mailgun, Postmark, or any SMTP.
Set:
- EMAIL_SERVER_HOST / PORT / USER / PASSWORD
- EMAIL_FROM

## 4) Eventbrite
- Create Eventbrite webhook for your event:
  - Endpoint: https://YOUR_DOMAIN/api/eventbrite/webhook
  - Events: order.placed, order.updated (whatever you use)
- Set `EVENTBRITE_PRIVATE_TOKEN`, `EVENTBRITE_WEBHOOK_SECRET`, `EVENTBRITE_EVENT_ID`

## 5) DocuSeal
Option A: Use DocuSeal cloud
Option B: Self-host later
Set:
- DOCUSEAL_BASE_URL, DOCUSEAL_TEMPLATE_ID, DOCUSEAL_API_KEY (if needed)
- Webhook endpoint: https://YOUR_DOMAIN/api/docuseal/webhook

## 6) Google Sheets logging
- Create a Google Service Account and share the Sheet with it
Set:
- GOOGLE_SHEETS_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

## 7) CAU Contract on Base
- Deploy `contracts/FATWCAU.sol` (ERC-1155 non-transferable)
- Put address in:
  - CAU_CONTRACT_ADDRESS
  - NEXT_PUBLIC_CAU_CONTRACT_ADDRESS
- Put admin key in:
  - ADMIN_PRIVATE_KEY (server only)
- Put RPC in:
  - BASE_RPC_URL, NEXT_PUBLIC_BASE_RPC_URL

## 8) Auto-mint loop (orders → CAU)
This MVP uses a CRON mint that mints CAU for Eventbrite buyers *after they connect a wallet*.
- Set `CRON_SECRET`
- Call: https://YOUR_DOMAIN/api/cron/mint?secret=CRON_SECRET
- In Vercel, add a Cron Job to hit this endpoint every 5–10 minutes during launch periods.

## 9) Admin setup
- Sign in with your email once
- In DB set your user role to ADMIN
- Visit /admin to:
  - Send artist portal links
  - Mint CAU manually (backup)
  - Create/link sponsors

## 10) Launch flow (real world)
- Audience buys on Eventbrite (USD)
- Eventbrite webhook creates/updates user record by email
- Audience visits your FATW Hub domain, signs in by email, connects wallet
- Cron mints CAU into their wallet
- They burn CAU for perks
- They paste tx hash into /redeem to get the promo/receipt code
- Staff applies discount in USD normally


## Sponsor ticket codes
Sponsors can generate customer giveaway codes at `/sponsor/tickets`. Customers claim at `/claim?code=FATW-XXXXXX`.


## No-tx-hash friction
Perks page now automatically records the redemption after a successful burn and returns a promo/receipt code (no copy/paste needed).


## Staff fulfillment
- Set `STAFF_PASSCODE`
- Staff login: `/staff/login`
- Fulfillment console: `/staff/fulfill`


## Episodes
- Create an episode in `/admin/episodes` and set it LIVE to attribute orders/redemptions/codes.


## Embedded wallets (email → wallet auto-created)
- Set `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- Customer entry point: `/access`
- Embedded perks page: `/perks-embedded`
