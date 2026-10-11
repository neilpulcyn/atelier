# Atelier — fashion, personalised (clickable prototype)

A mobile-first PWA prototype: an Instagram-style social app just for fashion. It has a style quiz that
personalises the feed, a creator **Events** section (shows, pop-ups, launches with RSVP), and **Edie**, an AI
stylist chat that combines your style profile with **live local weather** (Open-Meteo).

## Run it

```bash
npm install
npm run build        # type-checks (tsc -b) + Vite production build
npm start            # node server.mjs → http://localhost:4173 (binds 0.0.0.0)
# or: npm run dev    # Vite dev server on :5173
```

Open it on a phone on the same network at `http://<box-ip>:4173`, then use “Add to Home Screen” to install it
(manifest, icons and a service worker are included, so it works offline after the first visit).

Automated walkthrough (Playwright, iPhone 390×844 @2x, geolocation mocked to London):

```bash
npx playwright install chromium
node scripts/walkthrough.mjs            # writes screenshots/01…07
npx tsx scripts/engine-test.ts          # prints sample stylist replies
```

## What's inside

| Area | Notes |
|---|---|
| Onboarding quiz | 11 steps: wardrobe, image picks, Saturday outfit, words, shoes, colours, fit, occasions, budget, comfort rules, city + runs hot/cold. Weighted scoring across 8 styles (Minimalist, Streetwear, Classic/Preppy, Bohemian, Avant-garde, Romantic, Sporty, Vintage) → `src/lib/profile.ts` |
| Style result | Primary + secondary style, DNA bars, palette, signature pieces, muses |
| Feed | For You (ranked by style affinity, colour match, follows, freshness, popularity, with a "why" chip), Following, style filters, weather-aware **Recommended outfits** carousel, likes (double-tap), comments, saves, follows, share |
| Discover | Events ranked to your style and city, city filters, RSVP Interested/Going, event detail, .ics calendar export, "what to wear to this?"; creator directory with search |
| Create | Upload a photo (downscaled to 1080px, stored as a data URL), caption, style + tags + colours. Or promote your own event |
| Stylist (Edie) | Rule-based engine (`src/lib/stylist.ts` + `wardrobe.ts`, ~250 tagged pieces). Intents: outfit of the day, tomorrow, occasions (work, interview, wedding, date, party, fashion show, gym, travel, festival…), rain/cold/heat, "what goes with <item>", colour advice, another option, dress up/down. Respects comfort rules (flats only, covered arms, no wool…), budget (shop suggestions), runs cold/warm |
| Weather | Browser geolocation → Open-Meteo forecast; falls back to geocoding the home city (default London); 30-min cache; offline seasonal estimate |
| Optional LLM | `server.mjs` exposes `/api/health` and `/api/chat`. If `OPENAI_API_KEY`, `XAI_API_KEY` or `ANTHROPIC_API_KEY` is set, a "Use LLM" toggle appears and the LLM rewrites the reply, grounded in the profile, weather and the rule engine's outfit. Keys stay on the server |
| Persistence | Everything (quiz, likes, follows, saves, RSVPs, posts, events, comments, chat) is in `localStorage` (`atelier:v1`). Settings → Reset clears it |

Images are free-licence Unsplash photos, downloaded into `public/img/` so the app works offline.

## Making it a real native app

- **Fastest: Capacitor.** `npm i @capacitor/core @capacitor/cli && npx cap init Atelier app.atelier && npx cap add ios android`,
  then `npm run build && npx cap sync`. You get native camera/photo picker (`@capacitor/camera`), geolocation, push
  notifications and App Store / Play builds with almost no code changes.
- **Best long-term UX: Expo / React Native.** Port the screens to RN components (the logic in `src/lib/*` and `src/data/*` is
  plain TypeScript and can be reused as-is). Use Expo Router for tabs, expo-image, expo-location, and EAS builds.

## What a real backend would need

- **Auth & accounts:** Sign in with Apple/Google/email (e.g. Supabase Auth, Firebase Auth, Clerk), profiles, privacy settings, creator verification.
- **Data:** Postgres for users, posts, follows, likes, comments, events, RSVPs, quiz results. Paginated feed APIs, real-time notifications.
- **Media:** Direct-to-bucket uploads (S3/R2/Supabase Storage) with resizing/CDN (Cloudinary/imgix), EXIF stripping.
- **Moderation & safety:** Automated image/text moderation (nudity, hate, spam), report/block, human review queue, age gating, GDPR/UK data rights (export/delete).
- **Recommendations:** Swap the hand-tuned ranking for a learned model: image embeddings (e.g. CLIP) to auto-tag style and colour,
  user embeddings from the quiz plus interactions, and a two-tower retrieval → ranking pipeline with exploration and A/B testing.
- **Stylist:** Server-side LLM with tool calls (weather, user wardrobe, shoppable catalogue), rate limits, cost controls, eval sets.
  Keep the rule engine as a deterministic fallback.
- **Events:** Ticketing/RSVP limits, calendar sync, maps, promoted placements, payments (Stripe) for paid events.
- **Ops:** Analytics, crash reporting, feature flags, CI/CD, staging environments.

## Known prototype limitations

Single device, no accounts or real social graph. Seed content is static. Uploaded images live in localStorage (~5 MB quota).
Without a key the stylist is rule-based. Event times are shown as entered (local to the venue).
