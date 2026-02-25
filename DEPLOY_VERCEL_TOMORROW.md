# Deploy to Vercel (tomorrow-ready)

1) Create Neon Postgres
- Copy connection string to `DATABASE_URL`

2) Deploy on Vercel
- Import the repo
- Add environment variables from `.env.quickstart` and `.env.example`
- Add `DATABASE_URL`

3) Run migrations
Option A (recommended): run locally once:
- `npm i`
- `npx prisma migrate dev`
- push code

Option B: set Vercel Build Command:
- `npm run prisma:migrate && npm run build`

4) Add Vercel Cron
- Create a Cron Job to call:
  `/api/cron/mint?secret=CRON_SECRET`
- Frequency: every 5–10 minutes during launch windows.

5) Verify pages
- `/signin` email sign-in
- `/perks` wallet connect + burn + auto promo code
- `/staff/login` staff passcode
- `/admin` admin tools (make yourself ADMIN)
- `/admin/episodes` create + set LIVE episode
- `/dashboard` rollup metrics
