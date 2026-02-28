/**
 * scripts/seed-opportunities.ts
 *
 * Seeds the Supabase opportunities table with ~100-150 real HK opportunities
 * and generates embeddings for each using AWS Bedrock Titan.
 *
 * Usage:
 *   npx tsx scripts/seed-opportunities.ts
 *
 * Requires .env.local to be set up with all keys.
 */

import { createClient } from "@supabase/supabase-js";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Use service role key for seeding (bypasses RLS)
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION ?? "ap-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function embed(text: string): Promise<number[]> {
  const res = await bedrockClient.send(
    new InvokeModelCommand({
      modelId: "amazon.titan-embed-text-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText: text }),
    })
  );
  const parsed = JSON.parse(Buffer.from(res.body).toString());
  return parsed.embedding as number[];
}

// ─── Opportunity Dataset ──────────────────────────────────────────────────────
// TODO: Expand this list to 100-150 real HK opportunities
// Sources: HKUST careers, government internship schemes, Big 4, banks, NGOs, startups

const OPPORTUNITIES = [
  // Finance
  {
    title: "Graduate Analyst — Investment Banking",
    org: "HSBC Hong Kong",
    type: "graduate_program",
    industry: "finance",
    location: "hk_island",
    description:
      "Join HSBC's prestigious Investment Banking graduate programme in Hong Kong. Work across M&A, capital markets, and corporate finance deals across APAC. Rotational programme across 3 desks over 24 months.",
    requirements: ["Bachelor's degree in Finance, Economics or related", "Strong analytical skills", "Cantonese/Mandarin preferred"],
    is_paid: true,
    url: "https://www.hsbc.com/careers",
  },
  {
    title: "Summer Internship — Global Markets",
    org: "Goldman Sachs Hong Kong",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "10-week summer internship in Goldman Sachs' Global Markets division. Exposure to equities, fixed income, currencies, and commodities trading in HK.",
    requirements: ["Penultimate-year students", "Strong quantitative background", "Programming skills a plus"],
    is_paid: true,
  },
  {
    title: "Risk Management Graduate Trainee",
    org: "Bank of China (Hong Kong)",
    type: "graduate_program",
    industry: "finance",
    location: "kowloon",
    description:
      "2-year rotational programme covering credit risk, market risk, and operational risk. Strong mentorship and professional certification support.",
    requirements: ["Finance, Mathematics or Statistics degree", "Strong Excel skills", "Cantonese required"],
    is_paid: true,
  },
  // Technology
  {
    title: "Software Engineer Intern",
    org: "Cathay Pacific",
    type: "internship",
    industry: "technology",
    location: "hk_island",
    description:
      "Build production features for Cathay's digital platforms serving millions of travellers. Work with React, Node.js, and cloud infrastructure.",
    requirements: ["Computer Science or related degree", "React or Node.js experience", "Strong problem-solving skills"],
    is_paid: true,
  },
  {
    title: "Data Science Graduate Programme",
    org: "Prudential Hong Kong",
    type: "graduate_program",
    industry: "technology",
    location: "hk_island",
    description:
      "Apply ML and data analytics to insurance risk modelling, customer personalisation, and claims prediction. Structured 18-month programme.",
    requirements: ["Statistics, CS or Data Science degree", "Python/R proficiency", "ML fundamentals"],
    is_paid: true,
  },
  {
    title: "Product Manager Intern",
    org: "HKTVmall",
    type: "internship",
    industry: "technology",
    location: "new_territories",
    description:
      "Shape the product roadmap for HK's leading e-commerce platform. Work on user experience, A/B testing, and new feature launches.",
    requirements: ["Business or CS background", "Analytical mindset", "Strong communication skills"],
    is_paid: true,
  },
  // Consulting
  {
    title: "Business Analyst",
    org: "McKinsey & Company Hong Kong",
    type: "full_time",
    industry: "consulting",
    location: "hk_island",
    description:
      "Join McKinsey's HK office as a Business Analyst. Work on strategy, operations, and digital transformation projects across APAC clients.",
    requirements: ["Top academic record", "Strong analytical and communication skills", "Leadership experience"],
    is_paid: true,
  },
  {
    title: "Audit & Assurance Graduate",
    org: "KPMG Hong Kong",
    type: "graduate_program",
    industry: "consulting",
    location: "hk_island",
    description:
      "Begin your career in one of HK's Big 4 firms. Audit financial statements for listed companies and multinationals. HKICPA study support provided.",
    requirements: ["Accounting or Finance degree", "HKICPA eligibility", "Attention to detail"],
    is_paid: true,
  },
  // Social Impact
  {
    title: "Community Development Volunteer",
    org: "Oxfam Hong Kong",
    type: "volunteer",
    industry: "social_impact",
    location: "kowloon",
    description:
      "Support Oxfam's community programmes in HK's underprivileged areas. Assist with poverty research, event coordination, and community outreach.",
    requirements: ["Passion for social justice", "Cantonese required", "Flexible schedule"],
    is_paid: false,
  },
  {
    title: "Social Innovation Fellow",
    org: "The Hong Kong Jockey Club",
    type: "fellowship",
    industry: "social_impact",
    location: "hk_island",
    description:
      "12-month fellowship working on high-impact social innovation projects. HK$15,000/month stipend plus mentorship from senior leaders.",
    requirements: ["Fresh graduates or recent grads", "Strong interest in social enterprise", "Project management experience"],
    is_paid: true,
  },
  // Government
  {
    title: "Administrative Officer Trainee",
    org: "HKSAR Civil Service",
    type: "graduate_program",
    industry: "government",
    location: "hk_island",
    description:
      "One of HK's most prestigious graduate roles. Policy formulation, project management, and high-level administration across government bureaux.",
    requirements: ["Any degree discipline", "Excellent Chinese and English", "Strong leadership record"],
    is_paid: true,
  },
  {
    title: "Smart City Intern",
    org: "HKSAR Innovation and Technology Bureau",
    type: "internship",
    industry: "government",
    location: "hk_island",
    description:
      "Assist with HK's Smart City Blueprint 2.0. Work on digital identity, smart mobility, and data governance policy.",
    requirements: ["IT, Policy or Business student", "Interest in govtech", "Strong writing skills"],
    is_paid: true,
  },
  // Creative
  {
    title: "UX Design Intern",
    org: "Fano Labs",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Design user experiences for AI-powered enterprise products. Work with Figma, conduct user research, and ship designs to production.",
    requirements: ["Design or HCI background", "Figma proficiency", "Portfolio required"],
    is_paid: true,
  },
  {
    title: "Marketing & Creative Graduate",
    org: "Hang Lung Properties",
    type: "graduate_program",
    industry: "creative",
    location: "hk_island",
    description:
      "Drive creative campaigns for one of HK's leading property developers. Manage digital marketing, brand partnerships, and content creation.",
    requirements: ["Marketing, Communications or Design degree", "Strong portfolio", "Social media savvy"],
    is_paid: true,
  },
  // Healthcare
  {
    title: "Health Data Analyst Intern",
    org: "Hospital Authority Hong Kong",
    type: "internship",
    industry: "healthcare",
    location: "kowloon",
    description:
      "Analyse patient data to improve healthcare outcomes across HK's public hospital network. Python/R analysis of clinical datasets.",
    requirements: ["Statistics, CS or health informatics student", "Python or R", "Interest in healthcare"],
    is_paid: true,
  },
  // Education
  {
    title: "EdTech Research Intern",
    org: "HKUST",
    type: "internship",
    industry: "education",
    location: "new_territories",
    description:
      "Support AI-powered learning research at HKUST's Centre for Education Innovation. Build and test adaptive learning systems.",
    requirements: ["CS or Education Technology background", "Interest in AI+Education", "Python skills"],
    is_paid: true,
  },
  {
    title: "Teach For Hong Kong Fellow",
    org: "Teach For Hong Kong",
    type: "fellowship",
    industry: "education",
    location: "kowloon",
    description:
      "2-year teaching fellowship in under-resourced HK schools. Develop leadership skills while making a direct educational impact.",
    requirements: ["Bachelor's degree", "Passion for education equity", "Cantonese preferred"],
    is_paid: true,
  },
];

async function main() {
  console.log(`Seeding ${OPPORTUNITIES.length} opportunities...`);

  for (const opp of OPPORTUNITIES) {
    const textForEmbedding = `${opp.title} at ${opp.org}. ${opp.description} Requirements: ${opp.requirements.join(", ")}`;

    console.log(`  Embedding: ${opp.title}`);
    const embedding = await embed(textForEmbedding);

    const { error } = await supabase.from("opportunities").upsert({
      ...opp,
      embedding,
    });

    if (error) {
      console.error(`  Error seeding ${opp.title}:`, error.message);
    } else {
      console.log(`  ✓ Seeded: ${opp.title}`);
    }

    // Rate limiting — Bedrock has per-second limits
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\nSeeding complete!");
}

main().catch(console.error);
