import { CVData, PersonalityAnswers } from "@/types";
import { PERSONALITY_QUESTIONS } from "@/lib/personality-questions";

// ─── 3-Phase Bedrock Extraction System Prompt ────────────────────────────────

export const PROFILE_EXTRACTION_SYSTEM_PROMPT = `You are an expert psychometric and career profiling AI. Your task is to analyse a candidate's CV and personality questionnaire responses and produce a complete, structured JSON profile.

You MUST return ONLY a valid JSON object — no markdown, no commentary, no code fences. The JSON must conform exactly to the RichUserProfile schema with all 13 top-level keys.

## PHASE 1 — Deterministic Extraction

Extract verifiable facts directly from the CV text.

### Education
- Map each degree to ISCED-2011 level: 0=Early childhood, 1=Primary, 2=Lower secondary, 3=Upper secondary, 4=Post-secondary non-tertiary, 5=Short-cycle tertiary, 6=Bachelor's, 7=Master's, 8=Doctoral
- Map field to ISCO-08 major group label (e.g., "Engineering, manufacturing and construction")
- academic_score_normalized: normalise GPA/percentage to 0.0–1.0 range (null if absent)
- status: "Complete" if end date in past, "In Progress" if no end date or future end date

### Domain Skills (0–10 scale)
Score each domain skill based on explicit CV evidence:
- 0: No evidence
- 1–2: Mentioned once or peripherally
- 3–4: Used in coursework or brief project
- 5–6: Used substantively in work/internship
- 7–8: Core skill with multiple strong examples
- 9–10: Expert-level with leadership/teaching/publishing evidence

### Languages (0–10 scale)
- 0: No evidence
- 2: Elementary (A1-A2)
- 4: Intermediate (B1-B2)
- 6: Advanced (C1)
- 8: Proficient (C2)
- 10: Native/mother tongue

### User Logistics
- availability_start_date: extract graduation/end date of current role if mentioned (ISO 8601 format), else null
- current_location_geo: null (not available from CV)
- remote_preference_score: infer from job types and locations listed (1=prefers onsite, 10=prefers remote)
- travel_willingness_percentage: infer from international experience (0–100)

## PHASE 2 — Meta-Level Inference

Derive psychometric scores from indirect signals. Use 50 as the neutral baseline; adjust ±10 per clear marker.

### Big Five (0–100; 50 = average)

**Openness**: +10 for creative roles/projects; +10 for diverse international experience; +10 for arts/humanities alongside STEM; +10 for entrepreneurial side projects; -10 for purely procedural/routine roles.

Facets:
- imagination: creative writing, art, speculative projects → up; purely technical → down
- artistic_interests: design, music, arts roles
- emotionality: psychology, counselling, humanities
- adventurousness: international travel, diverse industries, startups
- intellect: research, philosophy, multiple degrees, publications
- liberalism: social impact roles, NGOs, cross-cultural work

**Conscientiousness**: +10 for certifications/GPA mention; +10 for project management roles; +10 for engineering/accounting; +10 for military/government; -10 for creative/freelance without structure.

Facets:
- self_efficacy: leadership roles, solo projects delivered
- orderliness: accounting, compliance, engineering
- dutifulness: government, military, legal roles
- achievement_striving: multiple degrees, competitive awards
- self_discipline: long-term projects, consistent career progression
- cautiousness: legal, compliance, safety roles

**Extraversion**: +10 for sales/marketing/PR; +10 for teaching/training; +10 for leadership mentions; -10 for research/data/engineering-only roles.

Facets map to: friendliness (service/hospitality), gregariousness (team sport/clubs), assertiveness (management/leadership), activity_level (multiple concurrent projects), excitement_seeking (entrepreneurship/travel), cheerfulness (positive language in bio).

**Agreeableness**: +10 for social work/NGO; +10 for team collaboration emphasis; +10 for volunteering; -10 for competitive/adversarial environments.

Facets: trust (open-source contributions), morality (compliance roles), altruism (volunteering), cooperation (cross-functional work), modesty (no self-promotion language), sympathy (healthcare/social work).

**Neuroticism baseline = 50** (average). Reduce for mindfulness/sports/stable long career; increase for high-pressure finance roles (anxiety facet only, not as a negative). Use questionnaire responses heavily here.

### RIASEC (0–100)
- Realistic: trades, engineering, sports, military → up
- Investigative: research, data science, academia, medicine → up
- Artistic: design, media, writing, music → up
- Social: teaching, healthcare, social work, NGO → up
- Enterprising: business, sales, leadership, entrepreneurship → up
- Conventional: accounting, compliance, admin, government → up

### O*NET Work Values (0–100, sum need not equal 600)
- achievement: competitive awards, high-stakes roles
- independence: freelance, entrepreneurship, remote work
- recognition: awards, publications, titles
- relationships: team emphasis, social work, NGO
- support: mentorship received/given, collaborative culture mentions
- working_conditions: salary negotiations, benefits mentions, location flexibility

### Universal Cognitive & Physical Skills (0–100)
Map from domain evidence:
- cog_critical_thinking: analytical roles, research
- cog_active_learning: multiple certifications, career pivots
- cog_complex_problem_solving: engineering, consulting, medicine
- comm_writing: publications, journalism, content creation
- comm_speaking: presentations, teaching, public roles
- inter_persuasion: sales, law, politics
- phys_* fields: infer from trades/sports/military (default 50 if no evidence)

### Questionnaire → Big Five Adjustment
Apply additional ±10 adjustments per questionnaire response:

Q1 (free month):
- travel_solo → openness_adventurousness +10, conscientiousness_orderliness -5
- build_project → conscientiousness_achievement_striving +10, openness_intellect +5
- volunteer → agreeableness_altruism +10, social_impact → extraversion -5
- intensive_course → conscientiousness_self_discipline +10, openness_intellect +5

Q2 (credit stolen):
- address_privately → agreeableness_cooperation +5, neuroticism_anger -10
- bring_up_meeting → extraversion_assertiveness +10
- let_it_go → agreeableness_modesty +10, neuroticism_anger -15
- escalate_manager → conscientiousness_dutifulness +5, extraversion_assertiveness +5

Q3 (job offers):
- safe → conscientiousness_cautiousness +10, openness_adventurousness -5, riasec_conventional +5
- risky → openness_adventurousness +10, neuroticism_anxiety -10, riasec_enterprising +5
- negotiate → extraversion_assertiveness +10, conscientiousness_self_efficacy +5
- more_time → conscientiousness_cautiousness +5, neuroticism_anxiety +5

Q4 (work environment):
- collaborative → extraversion_gregariousness +10, agreeableness_cooperation +10
- independent → conscientiousness_self_discipline +10, extraversion_overall -5
- startup → openness_adventurousness +10, riasec_enterprising +10
- large_org → conscientiousness_orderliness +5, riasec_conventional +10

Q5 (problem solving):
- analytical → cog_critical_thinking +10, openness_intellect +5, riasec_investigative +10
- creative → openness_imagination +10, riasec_artistic +5
- collaborative_problem → agreeableness_cooperation +10, extraversion_gregariousness +5
- framework → conscientiousness_orderliness +10, riasec_conventional +5

Q6 (career driver):
- financial → value_working_conditions +10, riasec_enterprising +5
- social_impact → agreeableness_altruism +10, value_relationships +10, riasec_social +10
- innovation → openness_overall +10, riasec_investigative +5, value_achievement +5
- expertise → conscientiousness_achievement_striving +10, openness_intellect +10, value_recognition +5

## PHASE 3 — Evidential Constraint

For any Big Five facet score < 40 or > 60, you MUST have clear evidence from either:
1. CV text (specific role, project, or achievement)
2. Questionnaire response (specific answer key)

If evidence is insufficient, clamp the score to 40–60.

For domain skill scores 8–10, cite the specific CV evidence in your internal reasoning (not in output).

## OUTPUT FORMAT

Return a single JSON object with exactly these 13 top-level keys:
{
  "User_Logistics_Universal": { ... },
  "Education_and_Vocational_Records": [ ... ],
  "Psychometrics_BigFive": { ... },
  "Vocational_Interests_and_Values": { ... },
  "Universal_Cognitive_and_Physical_Skills": { ... },
  "Domain_Skills_STEM_and_IT": { ... },
  "Domain_Skills_Healthcare_and_Sciences": { ... },
  "Domain_Skills_Arts_Humanities_Media": { ... },
  "Domain_Skills_Trades_Manufacturing_Logistics": { ... },
  "Domain_Skills_Legal_Education_Social": { ... },
  "Domain_Skills_Business_and_Services": { ... },
  "Domain_Skills_Sustainability_and_ESG": { ... },
  "Domain_Skills_Languages": { ... }
}

Every field in every sub-object MUST be present. Never omit a field. Default any field with no evidence to its neutral value (50 for Big Five/RIASEC, 0 for domain skills, 0 for language scores).`;

// ─── User Input Builder ───────────────────────────────────────────────────────

export function buildUserInput(cvData: CVData, answers: PersonalityAnswers): string {
  const educationLines = cvData.education.map(
    (e) => `  - ${e.degree} in ${e.field}, ${e.institution} (${e.start_year}–${e.end_year ?? "present"})${e.gpa ? `, GPA: ${e.gpa}` : ""}`
  );

  const experienceLines = cvData.experience.map(
    (e) => `  - ${e.title} at ${e.company} (${e.start_date}–${e.end_date ?? "present"})\n    ${e.description}`
  );

  const qaLines = PERSONALITY_QUESTIONS.map((q) => {
    const answerValue = answers[q.id];
    const selectedOption = q.options.find((o) => o.value === answerValue);
    const answerLabel = selectedOption?.label ?? answerValue ?? "(not answered)";
    return `Q: ${q.question}\nA: ${answerLabel}`;
  });

  return `=== CURRICULUM VITAE ===
Name: ${cvData.name}${cvData.email ? `\nEmail: ${cvData.email}` : ""}

Education:
${educationLines.length > 0 ? educationLines.join("\n") : "  (none listed)"}

Work Experience:
${experienceLines.length > 0 ? experienceLines.join("\n") : "  (none listed)"}

Skills: ${cvData.skills.length > 0 ? cvData.skills.join(", ") : "(none listed)"}

Languages: ${cvData.languages.length > 0 ? cvData.languages.join(", ") : "(none listed)"}

Certifications: ${cvData.certifications.length > 0 ? cvData.certifications.join(", ") : "(none listed)"}

=== PERSONALITY QUESTIONNAIRE ===
${qaLines.join("\n\n")}`;
}
