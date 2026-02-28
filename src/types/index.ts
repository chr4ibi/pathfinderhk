export type PersonalityAnswers = Record<string, string>;

// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// ─── CV / Profile ───────────────────────────────────────────────────────────

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number | null;
  gpa?: string;
}

export interface Experience {
  company: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string;
}

export interface CVData {
  name: string;
  email?: string;
  education: Education[];
  skills: string[];
  experience: Experience[];
  languages: string[];
  certifications: string[];
}

export interface UserProfile {
  summary: string;           // 2-3 sentence narrative
  top_skills: string[];      // 6-8 skills from CV + personality
  career_domains: string[];  // e.g. ["technology", "consulting"]
  work_style: string;        // 1-sentence preferred work style
}

export interface Interests {
  favourite_book?: string;
  favourite_movie?: string;
  other?: string;
}

export interface SkillDimensions {
  technical: number;
  communication: number;
  leadership: number;
  creativity: number;
  analytical: number;
  domain_expertise: number;
  collaboration: number;
  adaptability: number;
}

export interface CareerCluster {
  name: string;
  score: number; // 0–100
}

export interface ProfileInsights {
  strengths: { title: string; description: string }[];
  growth_areas: { title: string; description: string }[];
  career_clusters: CareerCluster[];
  skill_dimensions: SkillDimensions;
}

export interface Profile {
  id: string;
  user_id: string;
  cv_data: CVData;
  rich_profile: UserProfile | null;
  interests: Interests;
  insights: ProfileInsights | null;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

// ─── Opportunities ───────────────────────────────────────────────────────────

export type OpportunityType =
  | "internship"
  | "graduate_program"
  | "fellowship"
  | "volunteer"
  | "full_time"
  | "part_time";

export type Industry =
  | "technology"
  | "finance"
  | "consulting"
  | "social_impact"
  | "government"
  | "creative"
  | "healthcare"
  | "education"
  | "other";

export type HKLocation =
  | "hk_island"
  | "kowloon"
  | "new_territories"
  | "remote"
  | "hybrid";

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  type: OpportunityType;
  industry: Industry;
  location: HKLocation;
  description: string;
  requirements: string[];
  is_paid: boolean;
  url?: string;
  deadline?: string;
  embedding?: number[];
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export interface Recommendation {
  id: string;
  user_id: string;
  opportunity_id: string;
  opportunity: Opportunity;
  fit_score: number; // 0–100
  fit_explanation: string;
  gaps: string;
  actions: string[];
  created_at: string;
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export type OnboardingStep = "cv" | "personality" | "interests" | "processing";

export interface PersonalityQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

export interface OnboardingState {
  step: OnboardingStep;
  cvData: CVData | null;
  answers: Record<string, string>;
  interests: Interests;
}
