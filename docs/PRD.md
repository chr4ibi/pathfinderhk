# PathfinderHK — Product Requirements Document

**AI-Powered Career Discovery for Hong Kong**
HackTheEast 2026 | February 2026

Target Awards: **Main Awards | MiniMax Creative Usage | RevisionDojo Future of Learning | HKUST EC Innovation**

---

## 1. Executive Summary

**PathfinderHK** is an AI-powered career discovery platform designed for students and early-career professionals in Hong Kong. It transforms a user's CV, interests, and personality into a structured professional profile, then intelligently matches them with curated Hong Kong opportunities — internships, graduate programs, fellowships, volunteering, and entry-level roles — complete with personalized fit explanations and actionable advice.

Unlike generic job boards that rely on keyword matching, PathfinderHK understands the whole person: their skills, values, learning style, and aspirations. It answers the question every student asks — "What should I actually do next?" — with concrete, personalized recommendations.

---

## 2. Problem Statement

Hong Kong students and early-career professionals face a fragmented, overwhelming landscape when searching for professional opportunities. Key pain points include:

- **Information overload:** Hundreds of programs, internships, and roles scattered across university portals, job boards, company sites, and social media with no unified view.
- **Poor self-awareness:** Most students have limited understanding of how their unique combination of skills, experiences, and interests translates into career options.
- **Generic matching:** Existing platforms match on keywords (e.g., "finance"), not on deeper fit signals like personality, learning style, or growth potential.
- **No actionable guidance:** Even when students find an opportunity, they don't know what to do to maximize their chances of getting it.

PathfinderHK addresses all four pain points in a single, AI-driven experience.

---

## 3. Target Users

| Persona | Description | Key Need |
|---------|-------------|----------|
| **University Student** | Year 1–4 at HK university, exploring career paths | Discover what's out there; understand personal strengths |
| **Fresh Graduate** | 0–2 years post-graduation, seeking first or second role | Targeted job matching with fit reasoning and application tips |
| **Career Switcher** | Professional pivoting into a new field or upskilling | Identify transferable skills; find bridging programs |

---

## 4. Core Features (MVP)

### 4.1 Smart Onboarding

A streamlined intake flow that builds a rich user profile without overwhelming the user.

- **CV Upload & Parse:** Upload PDF/DOCX CV. AWS Bedrock (Claude) extracts structured data: education, skills, work experience, languages, certifications.
- **Quick Personality Snapshot:** 5–8 curated questions covering work style preferences, risk tolerance, collaboration style, and values. Processed via MiniMax LLM for personality trait extraction.
- **Interest Signals:** Favourite book, movie, open section (awards, essays, side projects).

### 4.2 Professional Identity Dashboard

A clean, visual summary of the user's professional profile.

- **Skill Radar Chart:** Interactive radar/spider chart showing 6–8 core competency areas (technical, communication, leadership, creativity, analytical, domain expertise). Built with Recharts in React.
- **Strength Summary Cards:** AI-generated natural language cards describing the user's top 3 strengths and 2 growth areas.
- **Opportunity Fit Heatmap:** A visual indicator showing which career clusters the user aligns with most strongly (Tech, Finance, Social Impact, Creative Industries).

### 4.3 Opportunity Matching Engine

- **Curated HK Dataset:** ~100–200 Hong Kong opportunities including graduate training programs, government internships, NGO volunteer programs, university-linked fellowships, startup roles.
- **Semantic Matching:** AWS Bedrock embeddings to compute similarity between user profile vectors and opportunity requirement vectors.
- **Fit Explanations:** For each recommendation: (a) why this is a good fit, (b) potential gaps, (c) 2–3 concrete actions to improve candidacy.
- **Filters:** Industry, type (internship/full-time/volunteer), location (HK Island/Kowloon/NT/remote), paid vs. unpaid.

### 4.4 AI Career Advisor Chatbot

- **Context-Aware:** The chatbot has access to the user's full profile and current recommendations.
- **Opportunity Deep-Dive:** Click on any recommendation to chat about it.
- **Voice Summary (MiniMax):** Generate a short audio summary using MiniMax TTS API (~60 seconds).

---

## 5. Tech Stack

| Layer | Technology | Purpose | Award Track |
|-------|-----------|---------|-------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind CSS | SSR, fast iteration, polished UI | Main Awards |
| **UI Components** | shadcn/ui + Recharts | Dashboard, charts, forms | Main Awards |
| **AI Orchestration** | Vercel AI SDK (TypeScript) | Streaming chat, tool use, structured output | RevisionDojo |
| **Core LLM** | AWS Bedrock (Claude Sonnet) | CV parsing, matching logic, fit explanations, chatbot | AWS/Ingram Micro |
| **Embeddings** | AWS Bedrock (Titan Embeddings) | Profile and opportunity vectorization | AWS/Ingram Micro |
| **Creative AI** | MiniMax API (LLM + TTS) | Personality analysis, audio career briefing | MiniMax Creative |
| **Database** | Supabase (PostgreSQL + pgvector) | User profiles, opportunity data, vector search | — |
| **Auth** | Supabase Auth | User accounts, session management | — |
| **Deployment** | Vercel | Zero-config deployment, preview URLs | — |

### 5.1 Award Track Alignment

- **Main Awards:** Overall solution quality, innovation, AI/ML usage, scalability.
- **MiniMax Creative Usage:** MiniMax LLM for personality trait extraction + MiniMax TTS for personalized audio "career briefing".
- **RevisionDojo Future of Learning:** Built with Vercel AI SDK. Skill gap identification, personalized learning paths.
- **HKUST EC Innovation Award:** Clear business model (freemium for students, paid tiers for career services offices). Real-world impact on student outcomes.

---

## 6. Information Architecture

### 6.1 Page Structure

| Route | Description | Key Components |
|-------|-------------|----------------|
| `/` | Landing page with value proposition and CTA | Hero, features, CTA |
| `/onboard` | Multi-step onboarding: CV upload, personality questions, interests | File upload, form wizard |
| `/dashboard` | Professional identity summary with radar chart, strength cards, career clusters | Recharts radar, cards |
| `/opportunities` | Ranked opportunity list with fit scores, filters, and fit explanations | List, filters, cards |
| `/chat` | AI career advisor chatbot with context from profile and recommendations | Chat UI, streaming |

### 6.2 Data Model (Simplified)

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| **User** | id, email, name, created_at | Supabase Auth linked |
| **Profile** | user_id, cv_data (JSONB), personality_traits (JSONB), interests (JSONB), embedding (vector) | Single row per user; embedding for vector search |
| **Opportunity** | id, title, org, type, industry, location, description, requirements, embedding (vector) | Pre-seeded dataset; vectorized on insert |
| **Recommendation** | user_id, opportunity_id, fit_score, fit_explanation, actions (JSONB) | Generated on profile completion; cached |

---

## 7. User Experience Flow

### 7.1 Onboarding (3–5 minutes)

1. User lands on PathfinderHK and clicks "Discover Your Path."
2. **Step 1 – CV Upload:** Drag-and-drop or file picker. Real-time parsing status. AWS Bedrock extracts structured data and displays a preview.
3. **Step 2 – Quick Questions:** 5–8 engaging questions presented one at a time with animated transitions. MiniMax LLM processes responses for personality traits.
4. **Step 3 – Interests & Extras:** Favourite book, movie, brief open section. Fast and optional.
5. **Processing screen** (3–5 seconds): Animated visualization while backend generates profile embedding and runs matching engine.

### 7.2 Dashboard Experience

- **Top section:** Radar chart + strength summary cards side by side.
- **Middle section:** Career cluster heatmap showing alignment percentages (e.g., "Tech 82% | Social Impact 74% | Finance 61%").
- **Bottom section:** Top 5 recommended opportunities as expandable cards with fit scores.
- **Audio briefing button:** Generates a ~60-second audio summary via MiniMax TTS.

### 7.3 Chatbot Interaction

Slide-out panel accessible from any page. Knows the user's full context. Can answer follow-up questions, explain recommendations, suggest skill development paths.

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CV parsing accuracy | Poor profile = bad recommendations | User confirmation step; fallback to manual entry; use Claude Sonnet for best extraction quality |
| Opportunity data quality | Stale or insufficient data | Pre-curate during hackathon; focus on well-known programs; design for easy updates |
| API rate limits | Demo fails during judging | Cache all AI outputs aggressively; pre-generate demo user results; implement retry logic |
| Scope creep | Unfinished product at demo time | Strict phase gates; MVP-only features; polish > features |
| MiniMax API unfamiliarity | Integration takes too long | Start with MiniMax early; have fallback (OpenAI TTS) ready; keep MiniMax usage simple but visible |

---

## 9. Success Metrics

For the hackathon demo:

- **Completeness:** All 4 core features (onboarding, dashboard, matching, chatbot) functional in a live demo.
- **Wow factor:** The audio briefing and radar chart visualization create a memorable impression.
- **Coherent narrative:** The demo tells a clear story from problem to solution to impact.
- **Technical depth:** Judges can see real AI/ML at work (embeddings, semantic search, structured extraction).
- **Award alignment:** Each target track's requirements are visibly and organically met.

---

## 10. Demo Strategy (3–4 minutes)

1. **Hook (30s):** "Every year, thousands of HK students miss opportunities they'd be perfect for — because they didn't know they existed or didn't believe they qualified."
2. **Problem (30s):** Show the messy reality: 10 tabs open, generic job boards, no guidance.
3. **Solution (2 min):** Live walkthrough: upload a CV → answer quick questions → see the dashboard light up with insights → explore matched opportunities with fit explanations → play the audio briefing → ask the chatbot a follow-up.
4. **Impact (30s):** Entrepreneurial angle: freemium for students, paid for career offices. Vision: expand to all of Asia.
