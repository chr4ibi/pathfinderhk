# PathfinderHK — Development Roadmap

HackTheEast 2026 | Estimated total build time: **10–14 hours**

---

## Phase 1 — Project Scaffolding ✅ DONE
> Foundation is fully set up. Team can clone and start immediately.

- [x] Next.js 14 + TypeScript + Tailwind CSS project initialized
- [x] All npm dependencies installed (ai SDK, Bedrock, Supabase, Recharts, shadcn/ui, framer-motion, etc.)
- [x] shadcn/ui components added (button, card, input, tabs, dialog, badge, progress, slider)
- [x] Full TypeScript type definitions (`src/types/index.ts`)
- [x] Lib utilities: `supabase.ts`, `supabase-server.ts`, `bedrock.ts`, `minimax.ts`
- [x] Personality questions config (`lib/personality-questions.ts`)
- [x] All API route stubs created (parse-cv, analyze-personality, generate-profile, match, profile-insights, audio-briefing, chat)
- [x] All page scaffolds created (/, /onboard, /dashboard, /opportunities, /chat)
- [x] Supabase schema with pgvector + RLS (`supabase/schema.sql`)
- [x] Opportunity seed script with 17 starter entries (`scripts/seed-opportunities.ts`)
- [x] Environment variable template (`env.example`)

**Everyone must do before starting:**
1. Copy `env.example` → `.env.local` and fill in credentials
2. Create Supabase project, run `supabase/schema.sql` in the SQL editor

---

## Phase 2 — Onboarding Flow
> Estimated: **2–3 hours**

Build the user-facing onboarding wizard that collects CV, personality answers, and interests.

### Milestones
- [ ] `CVUpload` component with react-dropzone (PDF/DOCX), calls `/api/parse-cv`, shows parsed preview
- [ ] `PersonalityQuestions` component — one question at a time, framer-motion slide transitions
- [ ] `InterestsForm` component — book, movie, free text inputs
- [ ] Wire onboarding wizard: step machine → processing screen → redirect to `/dashboard`
- [ ] Supabase Auth: email/password sign-up + login page (or modal)

### API routes (already implemented)
- `POST /api/parse-cv` — Bedrock Claude extracts CVData from uploaded file
- `POST /api/analyze-personality` — MiniMax LLM returns PersonalityTraits JSON
- `POST /api/generate-profile` — Embeds profile with Titan, saves to Supabase

---

## Phase 3 — Opportunity Data
> Estimated: **1.5–2 hours**

Populate the database with 100+ real HK opportunities.

### Milestones
- [ ] Expand `scripts/seed-opportunities.ts` from 17 → 100+ entries
- [ ] Cover: Big 4, banks (HSBC, Citi, JPM), government (HKMA, SFC, InvestHK), NGOs (Oxfam, UNHCR HK, WWF HK), tech (Klook, WeLab, Bowtie, GoGoX), HKUST/HKU/CityU programmes, startups
- [ ] Run `npm run seed` to populate Supabase

### Sources to research
- HKUST Career Centre portal
- Graduate Hong Kong (graduatehk.com)
- Big 4 graduate programme pages
- Government internship schemes (HKSAR Civil Service)
- NGO Hong Kong directory

---

## Phase 4 — Dashboard & Visualizations
> Estimated: **2–3 hours**

Build the Professional Identity Dashboard with visual AI insights.

### Milestones
- [ ] `SkillRadarChart` — Recharts RadarChart with 6–8 skill dimensions, branded colors
- [ ] `StrengthCards` — 3 strength cards (green accent) + 2 growth area cards (amber)
- [ ] `CareerClusterChart` — horizontal bar chart or color-coded badges with % scores
- [ ] `OpportunityCard` — expandable; collapsed shows title/org/fit score; expanded shows explanation + gaps + actions
- [ ] `AudioBriefingButton` — calls `/api/audio-briefing`, plays inline `<audio>` element
- [ ] Wire dashboard page to fetch real data from Supabase

### API routes (already implemented)
- `POST /api/profile-insights` — Bedrock Claude returns strengths, clusters, skill dimensions
- `POST /api/audio-briefing` — MiniMax TTS generates audio script + audio data

---

## Phase 5 — Chatbot
> Estimated: **1.5–2 hours**

Build the AI career advisor chatbot with Vercel AI SDK streaming.

### Milestones
- [ ] Complete `src/app/chat/page.tsx`: wire starter questions to auto-submit, typing indicator
- [ ] `ChatPanel` slide-out component: accessible from all pages via global state / Zustand
- [ ] `Navbar` with logo, page links, and chat toggle button
- [ ] Connect real Supabase Auth userId to chat requests (replace `"demo-user-id"`)

### API route (already implemented)
- `POST /api/chat` — Vercel AI SDK `streamText` with Bedrock Claude, system prompt includes full user profile + recommendations

---

## Phase 6 — Polish & Demo Prep
> Estimated: **1–2 hours**

### Milestones
- [ ] Landing page: hero copy finalized, responsive on mobile
- [ ] Skeleton loaders on dashboard while AI data loads
- [ ] Error handling: graceful fallbacks when API calls fail
- [ ] Pre-seeded demo user profile for presentation (bypass onboarding)
- [ ] Deploy to Vercel: connect GitHub repo, add all env vars, verify production build
- [ ] Run through full demo script (see `docs/PRD.md` Section 10)

---

## Timeline (Suggested)

| Time | Phase |
|------|-------|
| Hour 0–1 | Everyone: set up env, run schema, seed DB |
| Hour 1–4 | Phase 2 (Onboarding) + Phase 3 (Data) in parallel |
| Hour 4–7 | Phase 4 (Dashboard) + Phase 5 (Chatbot) in parallel |
| Hour 7–9 | Integration: connect all pieces end-to-end |
| Hour 9–11 | Phase 6: Polish, error handling, demo data |
| Hour 11–12 | Deploy to Vercel, full demo run-through |
| Hour 12+ | Buffer for debugging, rehearsal |
