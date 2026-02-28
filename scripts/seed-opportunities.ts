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
import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Use service role key for seeding (bypasses RLS)
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function embedText(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });
  return embedding;
}

// ─── Opportunity Dataset ──────────────────────────────────────────────────────

const OPPORTUNITIES = [
  // ── Finance ─────────────────────────────────────────────────────────────────
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
  {
    title: "Equity Research Intern",
    org: "Morgan Stanley Hong Kong",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "Support senior analysts in coverage of APAC equity markets. Build financial models, compile industry reports, and attend company roadshows.",
    requirements: ["Finance or Economics student", "Excel and Bloomberg proficiency", "Strong attention to detail"],
    is_paid: true,
  },
  {
    title: "Wealth Management Graduate",
    org: "UBS Hong Kong",
    type: "graduate_program",
    industry: "finance",
    location: "hk_island",
    description:
      "2-year structured programme in UBS's Wealth Management division. Manage HNW client portfolios across equities, fixed income, and alternatives.",
    requirements: ["Finance, Business or Economics degree", "CFA Level I preferred", "Strong interpersonal skills"],
    is_paid: true,
  },
  {
    title: "FinTech Product Intern",
    org: "Airwallex Hong Kong",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "Work on cross-border payment products at one of APAC's fastest-growing FinTechs. Collaborate with product, engineering, and compliance teams.",
    requirements: ["Business, CS or Finance student", "Interest in payments and FX", "Strong analytical mindset"],
    is_paid: true,
  },
  {
    title: "Quantitative Analyst Intern",
    org: "Man Investments Hong Kong",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "Develop systematic trading strategies using quantitative methods. Analyse large financial datasets and back-test trading signals.",
    requirements: ["Mathematics, Statistics or CS degree", "Python or MATLAB proficiency", "Strong probabilistic reasoning"],
    is_paid: true,
  },
  {
    title: "Insurance Actuarial Trainee",
    org: "AIA Hong Kong",
    type: "graduate_program",
    industry: "finance",
    location: "kowloon",
    description:
      "Begin an actuarial career at HK's largest insurer. Study support for IFOA or SOA exams provided. Rotations across pricing, reserving, and product development.",
    requirements: ["Mathematics, Statistics or Actuarial Science degree", "CT/CM exam progress preferred", "Excel VBA skills"],
    is_paid: true,
  },
  {
    title: "Private Equity Analyst",
    org: "PAG Group Hong Kong",
    type: "full_time",
    industry: "finance",
    location: "hk_island",
    description:
      "Support deal sourcing, due diligence, and portfolio management for one of Asia's largest PE firms. Work on transactions across Greater China and ASEAN.",
    requirements: ["Finance or accounting degree", "2+ years IB or advisory experience", "Mandarin fluency"],
    is_paid: true,
  },
  {
    title: "Trade Finance Graduate",
    org: "Standard Chartered Hong Kong",
    type: "graduate_program",
    industry: "finance",
    location: "hk_island",
    description:
      "Support Hong Kong's role as a major trade finance hub. Work on letters of credit, supply chain finance, and commodity trade finance.",
    requirements: ["Finance, Business or Law degree", "Interest in global trade", "Strong documentation skills"],
    is_paid: true,
  },

  // ── Technology ───────────────────────────────────────────────────────────────
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
  {
    title: "AI Engineer Intern",
    org: "SenseTime Hong Kong",
    type: "internship",
    industry: "technology",
    location: "hk_island",
    description:
      "Develop AI vision and NLP models at one of Asia's leading AI companies. Work on computer vision applications for smart city and retail use cases.",
    requirements: ["CS, AI or Mathematics degree", "PyTorch or TensorFlow experience", "Research experience a plus"],
    is_paid: true,
  },
  {
    title: "Cloud Solutions Graduate",
    org: "Microsoft Hong Kong",
    type: "graduate_program",
    industry: "technology",
    location: "kowloon",
    description:
      "Help HK enterprises migrate to Azure. Work with customers on cloud architecture, digital transformation, and AI integration projects.",
    requirements: ["CS, Engineering or Business degree", "Azure fundamentals preferred", "Strong presentation skills"],
    is_paid: true,
  },
  {
    title: "Mobile App Developer Intern",
    org: "GOGOX",
    type: "internship",
    industry: "technology",
    location: "kowloon",
    description:
      "Build and optimise the iOS/Android app for HK's leading on-demand logistics platform. Work in a fast-paced startup environment.",
    requirements: ["CS student", "Swift or Kotlin experience", "Interest in logistics tech"],
    is_paid: true,
  },
  {
    title: "Cybersecurity Analyst Intern",
    org: "PwC Hong Kong",
    type: "internship",
    industry: "technology",
    location: "hk_island",
    description:
      "Assist with penetration testing, threat assessment, and cybersecurity advisory for major HK clients in finance and government.",
    requirements: ["CS, Information Security or Engineering student", "CISSP/CEH interest", "Analytical mindset"],
    is_paid: true,
  },
  {
    title: "Blockchain Developer Graduate",
    org: "HashKey Group",
    type: "graduate_program",
    industry: "technology",
    location: "hk_island",
    description:
      "Build DeFi and tokenisation infrastructure at HK's licensed crypto exchange. Work on smart contracts, Web3 integrations, and custody solutions.",
    requirements: ["CS degree with blockchain interest", "Solidity or Rust experience preferred", "DeFi protocol knowledge"],
    is_paid: true,
  },
  {
    title: "DevOps Engineer Intern",
    org: "Agora Data",
    type: "internship",
    industry: "technology",
    location: "hk_island",
    description:
      "Manage CI/CD pipelines, cloud infrastructure, and monitoring for a fast-growing HK data startup. Work with Kubernetes, Terraform, and GCP.",
    requirements: ["CS or Engineering student", "Linux and Docker knowledge", "Scripting in Python or Bash"],
    is_paid: true,
  },
  {
    title: "Full Stack Engineer",
    org: "Fano Labs",
    type: "full_time",
    industry: "technology",
    location: "hk_island",
    description:
      "Build enterprise AI SaaS products for HK and APAC clients. Full stack role across React frontend, Node.js APIs, and ML model serving.",
    requirements: ["CS degree", "2+ years full stack experience", "React and Node.js proficiency"],
    is_paid: true,
  },

  // ── Consulting ───────────────────────────────────────────────────────────────
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
  {
    title: "Management Consulting Intern",
    org: "BCG Hong Kong",
    type: "internship",
    industry: "consulting",
    location: "hk_island",
    description:
      "8-week consulting internship at BCG. Work on real client cases across financial services, consumer goods, and technology sectors.",
    requirements: ["Top academic performance", "Strong problem-solving and teamwork", "Any degree discipline"],
    is_paid: true,
  },
  {
    title: "Strategy Analyst",
    org: "Bain & Company Hong Kong",
    type: "full_time",
    industry: "consulting",
    location: "hk_island",
    description:
      "Drive strategic impact for Bain clients across APAC. Work in small teams on market entry, growth, and operational improvement projects.",
    requirements: ["Top-tier academic credentials", "Leadership and analytical track record", "Any discipline"],
    is_paid: true,
  },
  {
    title: "Tax Advisory Graduate",
    org: "Deloitte Hong Kong",
    type: "graduate_program",
    industry: "consulting",
    location: "hk_island",
    description:
      "Provide tax planning and advisory services to multinationals operating in HK. Work on corporate tax, transfer pricing, and M&A tax structuring.",
    requirements: ["Accounting, Law or Finance degree", "HKICPA or ATIHK eligibility", "Detail-oriented"],
    is_paid: true,
  },
  {
    title: "Digital Transformation Consultant",
    org: "EY Hong Kong",
    type: "graduate_program",
    industry: "consulting",
    location: "hk_island",
    description:
      "Help large HK enterprises modernise operations with cloud, AI, and process automation. Work across banking, insurance, and government clients.",
    requirements: ["CS, Business or Engineering degree", "Agile methodology understanding", "Strong communication"],
    is_paid: true,
  },
  {
    title: "Supply Chain Analyst Intern",
    org: "Oliver Wyman Hong Kong",
    type: "internship",
    industry: "consulting",
    location: "hk_island",
    description:
      "Analyse global supply chain challenges for major HK and APAC companies. Build data models and produce strategic recommendations.",
    requirements: ["Business, Engineering or Economics student", "Strong Excel and data skills", "Structured thinking"],
    is_paid: true,
  },

  // ── Social Impact ─────────────────────────────────────────────────────────
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
  {
    title: "Youth Empowerment Programme Intern",
    org: "Boys' and Girls' Clubs Association of Hong Kong",
    type: "internship",
    industry: "social_impact",
    location: "kowloon",
    description:
      "Design and deliver youth development programmes across Kowloon community centres. Build leadership skills and mentoring ability.",
    requirements: ["Social Work, Education or related student", "Cantonese required", "Experience with youth preferred"],
    is_paid: true,
  },
  {
    title: "Mental Health Advocate Intern",
    org: "Mind HK",
    type: "internship",
    industry: "social_impact",
    location: "hk_island",
    description:
      "Help expand mental health awareness across HK schools and workplaces. Support content creation, partnerships, and community events.",
    requirements: ["Psychology, Social Work or related background", "Strong written English", "Empathy and communication skills"],
    is_paid: false,
  },
  {
    title: "Elderly Care Programme Coordinator",
    org: "SAGE Hong Kong",
    type: "volunteer",
    industry: "social_impact",
    location: "kowloon",
    description:
      "Coordinate volunteer-driven care programmes for elderly residents in Kowloon. Plan activities, manage volunteers, and liaise with care homes.",
    requirements: ["Cantonese fluency", "Organisational skills", "Compassionate attitude"],
    is_paid: false,
  },
  {
    title: "Refugee Support Officer",
    org: "Justice Centre Hong Kong",
    type: "internship",
    industry: "social_impact",
    location: "hk_island",
    description:
      "Assist refugees and asylum seekers navigating HK's legal system. Conduct intake interviews, manage case files, and support legal advocacy.",
    requirements: ["Law, Social Work or related degree", "Empathy and cultural sensitivity", "Languages a bonus"],
    is_paid: false,
  },
  {
    title: "Sustainability Analyst Intern",
    org: "Hong Kong Green Finance Association",
    type: "internship",
    industry: "social_impact",
    location: "hk_island",
    description:
      "Research ESG frameworks, green bond markets, and climate finance policy for HK's leading sustainability advocacy body.",
    requirements: ["Finance, Economics or Environmental Science student", "ESG and sustainability interest", "Strong research skills"],
    is_paid: true,
  },

  // ── Government ──────────────────────────────────────────────────────────────
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
  {
    title: "Housing Policy Research Intern",
    org: "HKSAR Planning Department",
    type: "internship",
    industry: "government",
    location: "kowloon",
    description:
      "Support land use planning and housing policy research for HK's urban development agenda. Produce policy briefs and GIS analysis.",
    requirements: ["Urban Planning, Geography or Policy student", "GIS or data analysis skills", "Good writing ability"],
    is_paid: true,
  },
  {
    title: "Trade Policy Analyst",
    org: "Hong Kong Trade Development Council",
    type: "graduate_program",
    industry: "government",
    location: "hk_island",
    description:
      "Analyse international trade trends and support HK's export promotion strategy. Produce market research reports and represent HKTDC at trade shows.",
    requirements: ["Economics, Business or International Relations degree", "Mandarin or other Asian languages a plus", "Research ability"],
    is_paid: true,
  },
  {
    title: "Legal Affairs Graduate",
    org: "HKSAR Department of Justice",
    type: "graduate_program",
    industry: "government",
    location: "hk_island",
    description:
      "Support government legal advisory work and international law matters. Assist senior counsel with research, drafting, and case preparation.",
    requirements: ["Law degree", "Excellent English and Chinese legal writing", "Academic distinction"],
    is_paid: true,
  },
  {
    title: "Environmental Protection Intern",
    org: "HKSAR Environmental Protection Department",
    type: "internship",
    industry: "government",
    location: "kowloon",
    description:
      "Support HK's environmental policy work on air quality, waste reduction, and climate targets. Assist with public consultation and data analysis.",
    requirements: ["Environmental Science, Engineering or Policy student", "Data analysis skills", "Strong report writing"],
    is_paid: true,
  },

  // ── Creative ─────────────────────────────────────────────────────────────────
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
  {
    title: "Content Creator Intern",
    org: "TVB Hong Kong",
    type: "internship",
    industry: "creative",
    location: "kowloon",
    description:
      "Join HK's largest broadcaster to create digital content across social media platforms. Scriptwriting, video editing, and audience growth.",
    requirements: ["Media, Communications or Creative Arts student", "Cantonese fluency", "Video editing skills"],
    is_paid: true,
  },
  {
    title: "Graphic Design Graduate",
    org: "Leo Burnett Hong Kong",
    type: "graduate_program",
    industry: "creative",
    location: "hk_island",
    description:
      "Create award-winning brand campaigns for global clients at one of HK's top ad agencies. Work across print, digital, OOH, and experiential.",
    requirements: ["Design or Fine Arts degree", "Adobe Creative Suite mastery", "Strong portfolio"],
    is_paid: true,
  },
  {
    title: "Fashion & Retail Intern",
    org: "Joyce Boutique",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Support buying, visual merchandising, and brand partnerships at HK's iconic luxury multi-brand retailer. Exposure to global luxury brands.",
    requirements: ["Fashion, Business or Arts student", "Strong aesthetic sensibility", "Cantonese preferred"],
    is_paid: true,
  },
  {
    title: "Game Developer Intern",
    org: "Animoca Brands",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Build blockchain-enabled games and NFT experiences at a global leader in digital entertainment. Unity or Unreal Engine development.",
    requirements: ["CS or Game Design student", "Unity or Unreal Engine", "Interest in Web3 gaming"],
    is_paid: true,
  },
  {
    title: "Architecture Intern",
    org: "Aedas Hong Kong",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Work on landmark architectural projects across APAC. Produce BIM models, design documentation, and presentation visuals.",
    requirements: ["Architecture student", "AutoCAD, Revit or Rhino proficiency", "Strong design portfolio"],
    is_paid: true,
  },

  // ── Healthcare ───────────────────────────────────────────────────────────────
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
  {
    title: "Pharmaceutical Research Intern",
    org: "Johnson & Johnson Hong Kong",
    type: "internship",
    industry: "healthcare",
    location: "hk_island",
    description:
      "Support clinical and regulatory operations for pharmaceutical products in APAC. Work on submissions, safety monitoring, and market access.",
    requirements: ["Pharmacy, Life Sciences or Biomedical student", "Attention to regulatory detail", "English and Chinese proficiency"],
    is_paid: true,
  },
  {
    title: "Medical Device Graduate",
    org: "Medtronic Hong Kong",
    type: "graduate_program",
    industry: "healthcare",
    location: "hk_island",
    description:
      "Support clinical specialists and sales teams for Medtronic's cardiac, diabetes, and surgical devices across HK hospitals.",
    requirements: ["Biomedical Engineering, Nursing or Life Sciences degree", "Strong communication", "Willingness to work in hospitals"],
    is_paid: true,
  },
  {
    title: "Digital Health Intern",
    org: "PingAn Good Doctor HK",
    type: "internship",
    industry: "healthcare",
    location: "hk_island",
    description:
      "Contribute to AI-powered telemedicine platform operations. Work on patient onboarding flows, doctor scheduling, and health data analytics.",
    requirements: ["CS, Business or Health Informatics student", "Data analytics skills", "Interest in digital health"],
    is_paid: true,
  },
  {
    title: "Biomedical Research Assistant",
    org: "HKUST",
    type: "part_time",
    industry: "healthcare",
    location: "new_territories",
    description:
      "Assist faculty research on biomedical engineering projects. Support lab experiments, literature reviews, and data analysis for publications.",
    requirements: ["Biomedical, Chemical or Life Sciences student", "Lab experience preferred", "Methodical approach"],
    is_paid: true,
  },

  // ── Education ────────────────────────────────────────────────────────────────
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
  {
    title: "Curriculum Designer Intern",
    org: "Hong Kong Institute of Education",
    type: "internship",
    industry: "education",
    location: "new_territories",
    description:
      "Help design next-generation STEM curricula for HK secondary schools. Research international benchmarks and create teaching materials.",
    requirements: ["Education, STEM or related degree", "Curriculum design interest", "Good Chinese and English"],
    is_paid: true,
  },
  {
    title: "English Language Tutor",
    org: "English Schools Foundation",
    type: "part_time",
    industry: "education",
    location: "hk_island",
    description:
      "Teach English to HK students at ESF international schools. Support literacy development, creative writing, and conversational English.",
    requirements: ["Native or near-native English speaker", "Teaching experience preferred", "Patient and enthusiastic"],
    is_paid: true,
  },
  {
    title: "Online Learning Producer",
    org: "Coursera Hong Kong Partner",
    type: "internship",
    industry: "education",
    location: "hk_island",
    description:
      "Produce MOOC content for HK university courses on Coursera. Coordinate video production, instructional design, and platform management.",
    requirements: ["Education, Media or Marketing student", "Video production skills a plus", "Strong project management"],
    is_paid: true,
  },

  // ── Logistics & Supply Chain ──────────────────────────────────────────────
  {
    title: "Supply Chain Graduate",
    org: "Maersk Hong Kong",
    type: "graduate_program",
    industry: "logistics",
    location: "hk_island",
    description:
      "Join Maersk's 2-year global graduate programme based in HK. Work across ocean freight, inland logistics, and digital supply chain solutions.",
    requirements: ["Business, Engineering or Economics degree", "Interest in global trade", "Adaptable and analytical"],
    is_paid: true,
  },
  {
    title: "Logistics Operations Intern",
    org: "DHL Hong Kong",
    type: "internship",
    industry: "logistics",
    location: "new_territories",
    description:
      "Support air and sea freight operations at DHL's HK hub. Work on shipment tracking, customs clearance, and warehouse management.",
    requirements: ["Logistics, Business or Engineering student", "Cantonese preferred", "Detail-oriented and organised"],
    is_paid: true,
  },
  {
    title: "Aviation Operations Graduate",
    org: "Airport Authority Hong Kong",
    type: "graduate_program",
    industry: "logistics",
    location: "new_territories",
    description:
      "Manage terminal operations and business development at HK International Airport, the world's busiest cargo hub.",
    requirements: ["Business, Engineering or Aviation Management degree", "Strong problem-solving", "Good Chinese and English"],
    is_paid: true,
  },
  {
    title: "Port Operations Intern",
    org: "Hutchison Ports",
    type: "internship",
    industry: "logistics",
    location: "new_territories",
    description:
      "Work at one of the world's leading port operators. Gain exposure to container terminal operations, digital port systems, and trade flows.",
    requirements: ["Engineering, Business or Logistics student", "Interest in maritime trade", "Analytical mindset"],
    is_paid: true,
  },
  {
    title: "Last-Mile Delivery Analyst",
    org: "SF Express Hong Kong",
    type: "internship",
    industry: "logistics",
    location: "kowloon",
    description:
      "Optimise last-mile delivery routes and operations for SF Express's HK network using data analytics and operational research methods.",
    requirements: ["Industrial Engineering, Operations Research or CS student", "Python or SQL skills", "Data-driven mindset"],
    is_paid: true,
  },

  // ── Real Estate ──────────────────────────────────────────────────────────────
  {
    title: "Property Valuation Intern",
    org: "JLL Hong Kong",
    type: "internship",
    industry: "real_estate",
    location: "hk_island",
    description:
      "Assist senior valuers in appraising commercial, residential, and industrial properties across HK. Use market data and DCF models.",
    requirements: ["Real Estate, Finance or Economics student", "Excel proficiency", "HKIS student membership preferred"],
    is_paid: true,
  },
  {
    title: "Real Estate Investment Analyst",
    org: "Link REIT",
    type: "graduate_program",
    industry: "real_estate",
    location: "hk_island",
    description:
      "Support asset management and deal analysis at Asia's largest REIT. Work on property acquisition, disposal, and portfolio optimisation.",
    requirements: ["Finance, Real Estate or Economics degree", "Strong financial modelling skills", "Interest in property"],
    is_paid: true,
  },
  {
    title: "Leasing Executive Graduate",
    org: "Sun Hung Kai Properties",
    type: "graduate_program",
    industry: "real_estate",
    location: "hk_island",
    description:
      "Manage commercial and residential leasing for one of HK's largest developers. Negotiate leases, conduct market research, and manage tenant relationships.",
    requirements: ["Business, Real Estate or Marketing degree", "Good Cantonese and English", "Negotiation skills"],
    is_paid: true,
  },
  {
    title: "PropTech Product Intern",
    org: "Spacious.hk",
    type: "internship",
    industry: "real_estate",
    location: "hk_island",
    description:
      "Improve the product experience for HK's leading property listing platform. Work on search UX, data quality, and agent tools.",
    requirements: ["Product, CS or Business student", "Analytical and user-centric mindset", "Cantonese preferred"],
    is_paid: true,
  },

  // ── Legal ────────────────────────────────────────────────────────────────────
  {
    title: "Paralegal Intern",
    org: "Linklaters Hong Kong",
    type: "internship",
    industry: "legal",
    location: "hk_island",
    description:
      "Support Magic Circle lawyers on M&A, capital markets, and litigation matters. Research, document review, and drafting support.",
    requirements: ["Law student or graduate", "Excellent English legal writing", "Attention to detail"],
    is_paid: true,
  },
  {
    title: "Legal Research Graduate",
    org: "Hong Kong Law Society",
    type: "graduate_program",
    industry: "legal",
    location: "hk_island",
    description:
      "Conduct legal research and policy analysis for HK's professional legal regulatory body. Produce consultation papers and reform recommendations.",
    requirements: ["LLB or JD graduate", "Strong research and writing skills", "Interest in legal policy"],
    is_paid: true,
  },
  {
    title: "Compliance Analyst Intern",
    org: "SFC Hong Kong",
    type: "internship",
    industry: "legal",
    location: "hk_island",
    description:
      "Support market surveillance and regulatory compliance work at HK's securities regulator. Analyse trading data and review disclosure filings.",
    requirements: ["Law, Finance or Economics student", "Analytical mindset", "Interest in financial regulation"],
    is_paid: true,
  },
  {
    title: "IP Legal Intern",
    org: "Bird & Bird Hong Kong",
    type: "internship",
    industry: "legal",
    location: "hk_island",
    description:
      "Assist on intellectual property, tech, and media law matters. Work on trademark filings, licensing agreements, and IP disputes.",
    requirements: ["Law student", "IP and tech law interest", "Good English writing"],
    is_paid: true,
  },

  // ── Hospitality & Tourism ────────────────────────────────────────────────────
  {
    title: "Hotel Management Trainee",
    org: "Four Seasons Hong Kong",
    type: "graduate_program",
    industry: "hospitality",
    location: "hk_island",
    description:
      "18-month structured programme at Hong Kong's iconic luxury hotel. Rotate across rooms, F&B, events, and front office operations.",
    requirements: ["Hospitality Management degree", "Strong customer service orientation", "Fluent English, Cantonese a plus"],
    is_paid: true,
  },
  {
    title: "Tourism Research Intern",
    org: "Hong Kong Tourism Board",
    type: "internship",
    industry: "hospitality",
    location: "kowloon",
    description:
      "Support visitor research and market intelligence for HK's tourism promotion agency. Analyse visitor data and produce market strategy reports.",
    requirements: ["Tourism, Business or Economics student", "Research and data skills", "Good Chinese and English"],
    is_paid: true,
  },
  {
    title: "Event Management Intern",
    org: "AsiaWorld-Expo",
    type: "internship",
    industry: "hospitality",
    location: "new_territories",
    description:
      "Support operations for large-scale conventions, concerts, and trade shows at HK's premier event venue. Manage vendors, logistics, and on-site execution.",
    requirements: ["Events, Hospitality or Business student", "Excellent organisational skills", "Willing to work evenings/weekends"],
    is_paid: true,
  },
  {
    title: "F&B Management Graduate",
    org: "Maxim's Group Hong Kong",
    type: "graduate_program",
    industry: "hospitality",
    location: "hk_island",
    description:
      "Lead restaurant operations across Maxim's 1,000+ outlets in HK. Rotational programme across fine dining, casual, and catering segments.",
    requirements: ["Business, Hospitality or Management degree", "Operations mindset", "Good Cantonese"],
    is_paid: true,
  },

  // ── Research & Academia ────────────────────────────────────────────────────
  {
    title: "AI Research Intern",
    org: "HKUST Robotics Institute",
    type: "internship",
    industry: "technology",
    location: "new_territories",
    description:
      "Work on cutting-edge robotics and AI research. Contribute to publications and prototypes in areas of autonomous systems, perception, and planning.",
    requirements: ["CS, Robotics or EE degree", "Research experience", "PyTorch or ROS skills"],
    is_paid: true,
  },
  {
    title: "Climate Science Research Assistant",
    org: "HKU Department of Earth Sciences",
    type: "part_time",
    industry: "social_impact",
    location: "hk_island",
    description:
      "Support faculty research on climate change impacts in APAC. Data collection, analysis, and co-authoring of academic publications.",
    requirements: ["Earth Sciences, Environmental Science or related", "Python or R for data analysis", "Strong written English"],
    is_paid: true,
  },
  {
    title: "Policy Research Fellow",
    org: "Our Hong Kong Foundation",
    type: "fellowship",
    industry: "government",
    location: "hk_island",
    description:
      "Conduct independent policy research on HK's housing, economy, and innovation challenges. Produce flagship reports and engage government stakeholders.",
    requirements: ["Economics, Public Policy or related postgraduate degree", "Strong research and writing", "Mandarin a plus"],
    is_paid: true,
  },

  // ── Retail & Consumer ─────────────────────────────────────────────────────
  {
    title: "Retail Management Trainee",
    org: "Dairy Farm Group",
    type: "graduate_program",
    industry: "retail",
    location: "hk_island",
    description:
      "Fast-track management programme across Dairy Farm's HK retail brands including Wellcome, Mannings, and IKEA. Gain P&L exposure in 18 months.",
    requirements: ["Business, Operations or Marketing degree", "Leadership drive", "Cantonese proficiency"],
    is_paid: true,
  },
  {
    title: "E-commerce Operations Intern",
    org: "Zalora Hong Kong",
    type: "internship",
    industry: "retail",
    location: "hk_island",
    description:
      "Support inventory management, seller onboarding, and campaign execution for HK's leading fashion e-commerce platform.",
    requirements: ["Business, Marketing or Operations student", "Excel and data skills", "Organised and detail-oriented"],
    is_paid: true,
  },
  {
    title: "Brand Marketing Intern",
    org: "L'Oréal Hong Kong",
    type: "internship",
    industry: "retail",
    location: "hk_island",
    description:
      "Support beauty brand marketing campaigns for the HK market. Digital campaigns, influencer partnerships, and sales promotion planning.",
    requirements: ["Marketing, Business or Communications student", "Digital marketing interest", "Cantonese and English"],
    is_paid: true,
  },
  {
    title: "Category Management Graduate",
    org: "AS Watson Group",
    type: "graduate_program",
    industry: "retail",
    location: "kowloon",
    description:
      "Manage product assortment, pricing, and promotions for one of Asia's largest health and beauty retail groups. Work across Watsons and PARKnSHOP.",
    requirements: ["Business, Marketing or Economics degree", "Analytical mindset", "Cantonese proficiency"],
    is_paid: true,
  },

  // ── Startups & Entrepreneurship ───────────────────────────────────────────
  {
    title: "Startup Operations Intern",
    org: "Cyberport Hong Kong",
    type: "internship",
    industry: "technology",
    location: "hk_island",
    description:
      "Work inside one of HK's top startup incubators. Support startup founders with operations, go-to-market, and investor relations.",
    requirements: ["Business, CS or Engineering student", "Entrepreneurial mindset", "Self-starter with initiative"],
    is_paid: true,
  },
  {
    title: "Venture Capital Analyst Intern",
    org: "MindWorks Ventures",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "Evaluate early-stage tech startups for investment at a HK-focused VC firm. Conduct market research, due diligence, and write investment memos.",
    requirements: ["Finance, CS or Business student", "Interest in startups and technology", "Strong analytical writing"],
    is_paid: true,
  },
  {
    title: "Growth Hacker Intern",
    org: "GoGoX",
    type: "internship",
    industry: "technology",
    location: "kowloon",
    description:
      "Drive user acquisition and retention for HK's leading on-demand logistics app. Run A/B tests, optimise onboarding funnels, and analyse growth metrics.",
    requirements: ["Marketing, Data Science or Business student", "SQL and analytics tools", "Growth mindset"],
    is_paid: true,
  },
  {
    title: "Social Enterprise Incubatee",
    org: "Good Lab Hong Kong",
    type: "fellowship",
    industry: "social_impact",
    location: "kowloon",
    description:
      "Launch your own social enterprise with mentorship, co-working space, and a HK$30,000 seed grant from Good Lab's incubation programme.",
    requirements: ["Early-stage social enterprise idea", "Fresh graduates or recent grads", "Commitment to 6-month programme"],
    is_paid: true,
  },

  // ── Media & Communications ───────────────────────────────────────────────
  {
    title: "Journalism Intern",
    org: "South China Morning Post",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Write news articles and features for one of Asia's most respected English-language newspapers. Cover business, politics, and culture beats.",
    requirements: ["Journalism, Communications or related student", "Excellent English writing", "Curiosity and persistence"],
    is_paid: true,
  },
  {
    title: "PR & Communications Graduate",
    org: "Edelman Hong Kong",
    type: "graduate_program",
    industry: "creative",
    location: "hk_island",
    description:
      "Manage media relations and communications campaigns for Edelman's HK clients across finance, tech, and consumer sectors.",
    requirements: ["Communications, PR or English degree", "Strong written and verbal communication", "Media relations interest"],
    is_paid: true,
  },
  {
    title: "Digital Media Intern",
    org: "RTHK",
    type: "internship",
    industry: "creative",
    location: "kowloon",
    description:
      "Produce digital content for HK's public broadcaster including news, podcasts, and social media clips in English and Cantonese.",
    requirements: ["Media, Communications or Journalism student", "Video production or audio editing skills", "Bilingual preferred"],
    is_paid: true,
  },

  // ── Environment & Sustainability ─────────────────────────────────────────
  {
    title: "Carbon Markets Analyst Intern",
    org: "Hong Kong Exchanges and Clearing (HKEX)",
    type: "internship",
    industry: "finance",
    location: "hk_island",
    description:
      "Support the development of voluntary carbon markets and sustainability reporting frameworks at HK's stock exchange.",
    requirements: ["Finance, Economics or Environmental Science student", "ESG and carbon markets interest", "Strong research skills"],
    is_paid: true,
  },
  {
    title: "Circular Economy Fellow",
    org: "Plastic Free Seas",
    type: "fellowship",
    industry: "social_impact",
    location: "hk_island",
    description:
      "Drive circular economy projects tackling plastic pollution across HK schools, businesses, and government partners.",
    requirements: ["Environmental Science, Business or Design degree", "Project management experience", "Passion for sustainability"],
    is_paid: true,
  },
  {
    title: "Green Building Intern",
    org: "Swire Properties",
    type: "internship",
    industry: "real_estate",
    location: "hk_island",
    description:
      "Support sustainability and BEAM Plus green building certification projects for Swire's HK commercial portfolio including Pacific Place.",
    requirements: ["Building Services, Architecture or Environmental Engineering student", "Green building standards interest", "Analytical approach"],
    is_paid: true,
  },

  // ── Sport, Arts & Culture ────────────────────────────────────────────────
  {
    title: "Sports Marketing Intern",
    org: "Hong Kong Jockey Club",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Support marketing campaigns for horse racing and sports betting at HK's iconic institution. Work on fan engagement, sponsorships, and events.",
    requirements: ["Marketing, Business or Sports Management student", "Cantonese preferred", "Enthusiasm for sports"],
    is_paid: true,
  },
  {
    title: "Curatorial Intern",
    org: "M+ Museum Hong Kong",
    type: "internship",
    industry: "creative",
    location: "kowloon",
    description:
      "Assist curators at West Kowloon's world-class visual culture museum. Support exhibition research, collection management, and public programming.",
    requirements: ["Art History, Cultural Studies or Museum Studies student", "Research skills", "English and Chinese writing"],
    is_paid: true,
  },
  {
    title: "Festival Production Intern",
    org: "Hong Kong Arts Festival",
    type: "internship",
    industry: "creative",
    location: "hk_island",
    description:
      "Support production and logistics for HK's premiere annual arts festival. Manage artist liaison, venue coordination, and audience experience.",
    requirements: ["Arts Administration, Event Management or related student", "Organised and proactive", "Bilingual preferred"],
    is_paid: true,
  },
];

async function main() {
  console.log(`Seeding ${OPPORTUNITIES.length} opportunities...`);

  for (const opp of OPPORTUNITIES) {
    const textForEmbedding = `${opp.title} at ${opp.org}. ${opp.description} Requirements: ${opp.requirements.join(", ")}`;

    console.log(`  Embedding: ${opp.title}`);
    const embedding = await embedText(textForEmbedding);

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
