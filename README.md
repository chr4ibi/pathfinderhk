# PathfinderHK

**AI-Powered Career Discovery for Hong Kong**
HackTheEast 2026 · Target: Main Awards | MiniMax Creative | RevisionDojo | HKUST EC Innovation

---

## What We're Building

PathfinderHK transforms a user's CV, personality, and interests into a structured professional profile, then intelligently matches them with curated Hong Kong opportunities — internships, grad programmes, fellowships, and more — complete with personalized fit explanations and actionable advice.

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd pathfinderhk
npm install

# 2. Set up environment
cp env.example .env.local
# Fill in all values in .env.local

# 3. Set up Supabase
# - Create project at supabase.com
# - Run supabase/schema.sql in the SQL editor
# - Enable pgvector extension

# 4. Seed the opportunity database
npm run seed

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui + Recharts |
| AI Orchestration | Vercel AI SDK (TypeScript) |
| Core LLM | AWS Bedrock (Claude Sonnet) |
| Embeddings | AWS Bedrock (Titan Embeddings v1) |
| Creative AI | MiniMax API (LLM + TTS) |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── onboard/page.tsx      ← Onboarding wizard
│   ├── dashboard/page.tsx    ← Professional identity dashboard
│   ├── opportunities/page.tsx← Opportunity list + filters
│   ├── chat/page.tsx         ← AI career advisor chatbot
│   └── api/
│       ├── parse-cv/         ← CV upload + Bedrock Claude extraction
│       ├── analyze-personality/ ← MiniMax personality analysis
│       ├── generate-profile/ ← Profile embedding + Supabase save
│       ├── match/            ← pgvector similarity + fit explanations
│       ├── profile-insights/ ← Strengths, clusters, skill dimensions
│       ├── audio-briefing/   ← MiniMax TTS career briefing
│       └── chat/             ← Vercel AI SDK streaming chatbot
├── components/
│   ├── ui/                   ← shadcn/ui base components (DO NOT EDIT)
│   ├── onboarding/           ← TODO: CVUpload, PersonalityQuestions, InterestsForm
│   ├── dashboard/            ← TODO: SkillRadarChart, StrengthCards, ClusterHeatmap
│   ├── opportunities/        ← TODO: OpportunityCard, FilterBar
│   ├── chat/                 ← TODO: ChatPanel, MessageBubble
│   └── layout/               ← TODO: Navbar, Sidebar
├── lib/
│   ├── supabase.ts           ← Browser Supabase client
│   ├── supabase-server.ts    ← Server Supabase client (SSR)
│   ├── bedrock.ts            ← AWS Bedrock client + embedding helper
│   ├── minimax.ts            ← MiniMax LLM + TTS helpers
│   ├── personality-questions.ts ← Question config
│   └── utils.ts              ← shadcn/ui utilities
├── types/
│   └── index.ts              ← All TypeScript types
supabase/
│   └── schema.sql            ← Full DB schema with RLS + pgvector
scripts/
│   └── seed-opportunities.ts ← Seed 100+ HK opportunities
```

---

## Team Task Assignments

### Phase 1: Foundation (DONE — scaffolded)
- [x] Next.js project with all dependencies
- [x] TypeScript types for all entities
- [x] All API route stubs
- [x] Supabase schema + RLS
- [x] All page scaffolds
- [ ] **Everyone:** Copy `env.example` → `.env.local`, fill in credentials, run schema

---

### Phase 2: Onboarding Flow
**Owner:** _assign to team member_

**Files to work on:**
- `src/app/onboard/page.tsx` — Replace stub steps with real components
- `src/components/onboarding/CVUpload.tsx` — Create with react-dropzone
- `src/components/onboarding/PersonalityQuestions.tsx` — Animated single-question UI
- `src/components/onboarding/InterestsForm.tsx` — Book, movie, open field

**API routes already built:**
- `POST /api/parse-cv` — Sends file to Bedrock Claude, returns structured CVData
- `POST /api/analyze-personality` — Sends answers to MiniMax, returns PersonalityTraits
- `POST /api/generate-profile` — Embeds profile, saves to Supabase

**Key tasks:**
1. Build `CVUpload` component: drag-and-drop with `react-dropzone`, calls `/api/parse-cv`
2. Build `PersonalityQuestions` component: one question at a time with `framer-motion` transitions, using `PERSONALITY_QUESTIONS` from `lib/personality-questions.ts`
3. Build `InterestsForm`: simple text inputs for book, movie, free text
4. Wire the wizard: state machine connecting all 3 steps → processing screen → redirect to `/dashboard`
5. Add Supabase Auth: email/password sign-up/login before onboarding

---

### Phase 3: Opportunity Data
**Owner:** _assign to team member_

**Files to work on:**
- `scripts/seed-opportunities.ts` — Expand from 17 → 100+ real HK opportunities

**Key tasks:**
1. Research and add 80+ more real HK opportunities to the `OPPORTUNITIES` array in the seed script
2. Sources: HKUST career portal, HKJC, Big 4 (Deloitte, EY, PwC, KPMG), major banks (HSBC, Citi, JPM, BofA), government (InvestHK, HKMA, SFC), NGOs (UNHCR HK, WWF HK, Community Business), tech startups (Klook, GoGoX, Bowtie, WeLab)
3. Run `npm run seed` to populate the database
4. Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` for the seed script

---

### Phase 4: Dashboard & Visualization
**Owner:** _assign to team member_

**Files to work on:**
- `src/app/dashboard/page.tsx` — Replace placeholders with real components
- `src/components/dashboard/SkillRadarChart.tsx` — Recharts RadarChart
- `src/components/dashboard/StrengthCards.tsx` — Green/amber cards from insights
- `src/components/dashboard/CareerClusterChart.tsx` — Bar chart / heatmap
- `src/components/dashboard/OpportunityCard.tsx` — Expandable rec cards
- `src/components/dashboard/AudioBriefingButton.tsx` — Play button + audio player

**API routes already built:**
- `POST /api/profile-insights` — Returns strengths, growth areas, clusters, skill dimensions
- `POST /api/audio-briefing` — Returns MiniMax TTS audio + script

**Key tasks:**
1. Build `SkillRadarChart` with Recharts `RadarChart`, `PolarGrid`, `PolarAngleAxis`, `Radar`
2. Build `StrengthCards` reading from `ProfileInsights.strengths` / `growth_areas`
3. Build `CareerClusterChart` as horizontal bar or color-coded badges with percentages
4. Build `OpportunityCard` — collapsed shows title, org, fit score badge, one-liner; expanded shows full explanation, gaps, actions
5. Build `AudioBriefingButton` — calls `/api/audio-briefing`, renders `<audio>` player

---

### Phase 5: Chatbot
**Owner:** _assign to team member_

**Files to work on:**
- `src/app/chat/page.tsx` — Complete the chat UI
- `src/components/chat/ChatPanel.tsx` — Slide-out panel accessible from all pages
- `src/components/layout/Navbar.tsx` — Global nav with chat toggle

**API route already built:**
- `POST /api/chat` — Vercel AI SDK streaming with Bedrock Claude + tool use

**Key tasks:**
1. Complete chat UI: wire starter questions to auto-submit, add typing indicator
2. Build slide-out `ChatPanel` component accessible from any page via global state
3. Build `Navbar` with logo, page links, and chat toggle button
4. Add real userId from Supabase Auth session to chat requests

---

### Phase 6: Polish & Deploy
**Owner:** Everyone

**Key tasks:**
1. Responsive design: mobile-friendly layouts for all pages
2. Loading states: skeleton loaders for dashboard, progress bars for AI processing
3. Error handling: graceful fallbacks when APIs fail
4. Demo data: pre-seed a compelling demo user profile for presentation
5. Deploy to Vercel: connect GitHub repo, add all env vars, verify production build

---

## Environment Variables

Copy `env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=         # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # From Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=        # Only needed for seed script
AWS_ACCESS_KEY_ID=                # IAM user with Bedrock access
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-east-1              # HK region
MINIMAX_API_KEY=                  # From minimax.io dashboard
MINIMAX_GROUP_ID=                 # From minimax.io dashboard
```

---

## Key Commands

```bash
npm run dev          # Start dev server
npm run seed         # Seed opportunity database (run once after schema setup)
npm run typecheck    # Check TypeScript types
npm run build        # Production build
```

---

## Award Tracks

| Award | How We Win |
|-------|-----------|
| **Main Awards** | Full-stack Next.js + Bedrock + Supabase, production-grade AI engineering |
| **MiniMax Creative** | MiniMax LLM for personality extraction + TTS for audio career briefing |
| **RevisionDojo Future of Learning** | Vercel AI SDK, skill gap identification, personalized learning paths |
| **HKUST EC Innovation** | Clear business model, real HK student impact, freemium → B2B pivot |

---

## Demo Flow (3-4 minutes)

1. **Hook (30s):** "Every year, thousands of HK students miss opportunities they'd be perfect for"
2. **Problem (30s):** 10 tabs open, generic boards, no guidance
3. **Solution (2min):** Upload CV → quick questions → dashboard lights up → explore matches → play audio briefing → ask chatbot
4. **Impact (30s):** Freemium for students, paid for career offices, expand to Asia
