# Security model (MVP)

## What FATW Hub does NOT store
- No card data, no banking data (Eventbrite processes payments).
- No private keys for users.
- No seed phrases.

## What FATW Hub DOES store
- Emails (buyers/artists/sponsors)
- Wallet addresses (optional, if user connects)
- Eventbrite order IDs (for audit)
- Onchain tx hashes for redemptions
- Promo/receipt codes

## Operator responsibilities
- Keep `ADMIN_PRIVATE_KEY` server-side only.
- Rotate `STAFF_PASSCODE` periodically.
- Use strong `NEXTAUTH_SECRET`, `CRON_SECRET`, `EVENTBRITE_WEBHOOK_SECRET`.
- Restrict Google Service Account to only the required sheet.

## Rate limiting note
Rate limiting included is in-memory and resets per server instance.
For production hardening, swap to a Redis/Upstash rate limiter.
