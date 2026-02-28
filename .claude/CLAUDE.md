# PathfinderHK — CLAUDE.md

AI-powered career discovery platform for Hong Kong. HackTheEast 2026.

---

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run typecheck  # TypeScript check (tsc --noEmit)
npm run lint       # ESLint
npm run seed       # Seed HK opportunities into Supabase (needs SUPABASE_SERVICE_ROLE_KEY)
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (DO NOT edit files in `src/components/ui/`) |
| AI Orchestration | Vercel AI SDK (`ai` package) |
| Core LLM | AWS Bedrock — Claude 3.5 Sonnet (`anthropic.claude-3-5-sonnet-20241022-v2:0`) |
| Embeddings | AWS Bedrock — Titan Embed v1 (1536 dims) |
| Creative AI | MiniMax API (LLM for personality + TTS for audio briefing) |
| Database | Supabase — PostgreSQL + pgvector |
| Auth | Supabase Auth |
| Animations | framer-motion |
| Charts | Recharts |
| File upload | react-dropzone |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  ← Landing page (DONE)
│   ├── onboard/page.tsx          ← Onboarding wizard (stub — needs components)
│   ├── dashboard/page.tsx        ← Identity dashboard (stub — needs components)
│   ├── opportunities/page.tsx    ← Opportunity list
│   ├── chat/page.tsx             ← AI chatbot
│   └── api/
│       ├── parse-cv/route.ts     ← CV → CVData via Bedrock Claude (DONE)
│       ├── analyze-personality/  ← Answers → PersonalityTraits via MiniMax (stub)
│       ├── generate-profile/     ← Embed + save to Supabase (stub)
│       ├── match/                ← pgvector similarity + fit explanations (stub)
│       ├── profile-insights/     ← Strengths, clusters, skill dims (stub)
│       ├── audio-briefing/       ← MiniMax TTS (stub)
│       └── chat/                 ← Vercel AI SDK streaming (stub)
├── components/
│   ├── ui/                       ← shadcn/ui — DO NOT EDIT
│   ├── onboarding/               ← TODO: CVUpload, PersonalityQuestions, InterestsForm
│   ├── dashboard/                ← TODO: SkillRadarChart, StrengthCards, etc.
│   ├── chat/                     ← TODO: ChatPanel, MessageBubble
│   └── layout/                   ← TODO: Navbar, Sidebar
├── lib/
│   ├── bedrock.ts                ← AWS Bedrock client + generateEmbedding()
│   ├── minimax.ts                ← MiniMax LLM + TTS helpers
│   ├── supabase.ts               ← Browser Supabase client
│   ├── supabase-server.ts        ← Server Supabase client (SSR/cookies)
│   ├── personality-questions.ts  ← PERSONALITY_QUESTIONS config array
│   └── utils.ts                  ← shadcn/ui cn() utility
└── types/index.ts                ← All TypeScript types (User, CVData, Profile, Opportunity, etc.)
supabase/
└── schema.sql                    ← Full DB schema — profiles, opportunities, recommendations + pgvector
scripts/
└── seed-opportunities.ts         ← Seed 100+ HK opportunities
```

---

## Key Types (src/types/index.ts)

- `CVData` — parsed CV: name, education[], skills[], experience[], languages[], certifications[]
- `PersonalityTraits` — 6 scalar dimensions (-100 to 100)
- `ProfileInsights` — strengths[], growth_areas[], career_clusters[], skill_dimensions
- `Profile` — full user profile with embedding
- `Opportunity` — HK opportunity with type, industry, location, embedding
- `Recommendation` — matched opportunity with fit_score (0-100), fit_explanation, gaps, actions[]
- `OnboardingStep` — "cv" | "personality" | "interests" | "processing"

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Only for seed script
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-east-1
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
```

---

## Database (Supabase)

- **profiles** — user profiles with pgvector embedding (1536 dims), RLS: own row only
- **opportunities** — HK opportunities with embeddings, publicly readable
- **recommendations** — matched results per user, RLS: own rows only
- **match_opportunities()** — SQL function for cosine similarity search via pgvector
- Run `supabase/schema.sql` in Supabase SQL editor to set up

---

## AI Pipeline

1. **CV Parse** (`/api/parse-cv`): PDF/DOCX → Bedrock Claude → `CVData` JSON
2. **Personality** (`/api/analyze-personality`): Q&A answers → MiniMax LLM → `PersonalityTraits`
3. **Profile Gen** (`/api/generate-profile`): profile text → Titan Embed → vector saved to Supabase
4. **Match** (`/api/match`): `match_opportunities()` pgvector search → top candidates → Bedrock Claude fit explanations
5. **Insights** (`/api/profile-insights`): profile → Bedrock Claude → `ProfileInsights`
6. **Audio** (`/api/audio-briefing`): script → MiniMax TTS → audio URL
7. **Chat** (`/api/chat`): Vercel AI SDK streaming with Bedrock Claude + tool use

---

## Conventions

- All pages use dark theme: `bg-slate-950 text-white`
- Landing page uses: `bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900`
- Accent color: blue-500 / blue-400
- Rounded corners: `rounded-xl` / `rounded-2xl`
- shadcn/ui components live in `src/components/ui/` — import them, never edit them
- API routes return `NextResponse.json(data)` or `NextResponse.json({ error }, { status })`
- Use `@/` path alias throughout (configured in tsconfig.json)

---

## What's Built vs TODO

| Page/Feature | Status |
|---|---|
| Landing page | DONE |
| Onboarding wizard (shell) | DONE (stubs) |
| CV upload component | TODO |
| Personality questions component | TODO |
| Interests form | TODO |
| Dashboard (shell) | DONE (stubs) |
| SkillRadarChart | TODO |
| StrengthCards | TODO |
| CareerClusterChart | TODO |
| OpportunityCards | TODO |
| AudioBriefingButton | TODO |
| Chat page | TODO |
| Navbar / layout | TODO |
| All API routes | Stubbed (need implementation) |
| Supabase schema | DONE |
| Seed script | DONE (17 opportunities, expand to 100+) |
