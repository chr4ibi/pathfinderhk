# PathfinderHK — Task List

| Developer | Responsibility |
|-----------|---------------|
| **Ali** | Backend, database, AI logic (API routes, Supabase, Bedrock, MiniMax) |
| **Tom** | Frontend UI (components, pages, animations, styling) |

Work in parallel across phases 2–5.

---

## Setup (Everyone — do this first)

- [ ] Clone the repo: `git clone <repo-url> && cd pathfinderhk && npm install`
- [ ] Copy `env.example` → `.env.local` and fill in all API keys
- [ ] Create Supabase project → run `supabase/schema.sql` in the SQL editor
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`, then run `npm run seed`
- [ ] Verify dev server starts: `npm run dev` → open http://localhost:3000

---

## Phase 2 — Onboarding Flow

### Task 2.1 — CV Upload Component — **Tom**
- [ ] Create `src/components/onboarding/CVUpload.tsx`
- [ ] Use `react-dropzone` to accept PDF and DOCX files
- [ ] On drop: POST file to `/api/parse-cv` as FormData
- [ ] Show loading spinner while parsing
- [ ] Display parsed CV data preview (name, skills, education list)
- [ ] "Looks good" button to confirm and proceed to next step

### Task 2.2 — Personality Questions Component — **Tom**
- [ ] Create `src/components/onboarding/PersonalityQuestions.tsx`
- [ ] Import `PERSONALITY_QUESTIONS` from `src/lib/personality-questions.ts`
- [ ] Show one question at a time with animated slide transitions (`framer-motion`)
- [ ] Track selected answers in state
- [ ] On last question: POST all answers to `/api/analyze-personality`
- [ ] Proceed to next step on success

### Task 2.3 — Interests Form Component — **Tom**
- [ ] Create `src/components/onboarding/InterestsForm.tsx`
- [ ] Fields: Favourite Book, Favourite Movie, Other (awards, side projects, essays)
- [ ] All fields optional — skip button available
- [ ] Submit button calls `/api/generate-profile` with cvData + traits + interests
- [ ] On success: redirect to `/dashboard`

### Task 2.4 — Wire Onboarding Page — **Tom**
- [ ] Update `src/app/onboard/page.tsx` to use the three components above
- [ ] State machine: `cv` → `personality` → `interests` → `processing`
- [ ] Processing step: show animated screen for 3–5 seconds while profile generates

### Task 2.5 — Auth — **Ali**
- [ ] Create `src/app/auth/page.tsx` with email/password sign-up + login form
- [ ] Use `createClient()` from `src/lib/supabase.ts`
- [ ] Redirect to `/onboard` after sign-up, `/dashboard` after login
- [ ] Protect `/dashboard`, `/opportunities`, `/chat` routes (redirect if not logged in)

---

## Phase 3 — Opportunity Data

### Task 3.1 — Research & Add Opportunities — **Ali**
- [ ] Open `scripts/seed-opportunities.ts` and add to the `OPPORTUNITIES` array
- [ ] Target: 100+ total entries (currently 17)
- [ ] Required fields: title, org, type, industry, location, description, requirements[], is_paid
- [ ] Categories to cover (aim for 10–15 per category):
  - [ ] Finance: banks (HSBC, Citi, JPMorgan, BofA, StanChart, BOCHK, Hang Seng)
  - [ ] Consulting: Big 4 (KPMG, Deloitte, EY, PwC), McKinsey, BCG, Bain
  - [ ] Technology: Cathay, HKT, PCCW, Klook, WeLab, Bowtie, GoGoX, HKEX tech
  - [ ] Government: Civil Service, HKMA, SFC, InvestHK, HKPC, CyberPort
  - [ ] Social Impact: Oxfam HK, UNHCR HK, WWF HK, Community Business, Orbis
  - [ ] Fellowships: HKJC fellowship, Swire Scholarship, Li Ka Shing Foundation
  - [ ] Education: Teach For HK, university research assistants (HKUST, HKU, CUHK)
  - [ ] Healthcare: Hospital Authority, private hospitals, health startups

### Task 3.2 — Run Seed Script — **Ali**
- [ ] Run `npm run seed` to populate Supabase
- [ ] Verify in Supabase table editor that opportunities are inserted with embeddings
- [ ] Fix any errors in the seed data (required fields, enum values)

---

## Phase 4 — Dashboard & Visualizations

### Task 4.1 — Skill Radar Chart — **Tom**
- [ ] Create `src/components/dashboard/SkillRadarChart.tsx`
- [ ] Use Recharts: `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`, `ResponsiveContainer`
- [ ] Data: 8 dimensions from `ProfileInsights.skill_dimensions`
- [ ] Styled with blue fill, dark background, responsive

### Task 4.2 — Strength & Growth Area Cards — **Tom**
- [ ] Create `src/components/dashboard/StrengthCards.tsx`
- [ ] 3 strength cards: green-accent left border, title + description
- [ ] 2 growth area cards: amber-accent left border
- [ ] Data from `ProfileInsights.strengths` and `growth_areas`

### Task 4.3 — Career Cluster Chart — **Tom**
- [ ] Create `src/components/dashboard/CareerClusterChart.tsx`
- [ ] Show `ProfileInsights.career_clusters` as horizontal bars or colored badge pills with % labels
- [ ] Sort by score descending

### Task 4.4 — Opportunity Cards — **Tom**
- [ ] Create `src/components/dashboard/OpportunityCard.tsx`
- [ ] **Collapsed state:** opportunity title, org name, type badge, fit score (colored: green ≥80, amber 60–79, red <60), one-line fit reason
- [ ] **Expanded state:** full fit_explanation, gaps paragraph, action steps as checklist
- [ ] Smooth expand/collapse animation

### Task 4.5 — Audio Briefing Button — **Tom**
- [ ] Create `src/components/dashboard/AudioBriefingButton.tsx`
- [ ] Button: "▶ Play Career Briefing"
- [ ] On click: POST to `/api/audio-briefing`, show loading state
- [ ] On success: render `<audio controls>` with returned audio data
- [ ] Handle error gracefully (show text fallback)

### Task 4.6 — Wire Dashboard Page — **Ali**
- [ ] Update `src/app/dashboard/page.tsx` to:
  - Fetch profile insights via `/api/profile-insights`
  - Fetch recommendations via `/api/match`
  - Render all 5 components above with real data
  - Show skeleton loaders while data loads

---

## Phase 5 — Chatbot

### Task 5.1 — Complete Chat Page — **Tom**
- [ ] Update `src/app/chat/page.tsx`:
  - Wire starter question buttons to set input and submit
  - Add typing indicator animation
  - Get real userId from Supabase Auth session

### Task 5.2 — Chat Panel (Slide-out) — **Tom**
- [ ] Create `src/components/chat/ChatPanel.tsx`
- [ ] Slide-out from right side, accessible from any page
- [ ] Toggle open/close button in Navbar
- [ ] Reuse chat UI from `src/app/chat/page.tsx`
- [ ] Use React context or Zustand to manage open/closed state globally

### Task 5.3 — Navbar — **Tom**
- [ ] Create `src/components/layout/Navbar.tsx`
- [ ] Logo + name on left, page links (Dashboard, Opportunities) in center, "Ask AI" chat button on right
- [ ] Add to root `layout.tsx` so it appears on all pages

---

## Phase 6 — Polish & Deploy

### Tom
- [ ] Responsive: test all pages on mobile (375px width)
- [ ] Loading states: skeleton loaders on dashboard, spinner on onboarding processing step
- [ ] Error handling: show toast or inline error if any API call fails

### Ali
- [ ] Demo user: pre-seed a fake completed profile in Supabase for live demo
- [ ] Deploy to Vercel:
  - Connect GitHub repo to Vercel
  - Add all env vars from `.env.local` in Vercel project settings
  - Trigger deploy, verify build passes
  - Test production URL end-to-end

### Both
- [ ] Full demo rehearsal: run through the 3–4 minute demo script in `docs/PRD.md`

---

## Definition of Done

A feature is done when:
1. It works end-to-end in the browser (not just in code)
2. It doesn't break any other page
3. It looks reasonable on mobile
4. Loading and error states are handled
