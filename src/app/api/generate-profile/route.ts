import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { generateEmbedding } from "@/lib/ai";
import { createServiceSupabaseClient } from "@/lib/supabase-server";
import { PERSONALITY_QUESTIONS } from "@/lib/personality-questions";
import { CVData, Interests, PersonalityAnswers, UserProfile, ProfileInsights } from "@/types";

const SYSTEM_PROMPT = `You are a career counsellor AI. Given a candidate's CV, personality Q&A answers, and interests, produce a structured JSON profile.

Return ONLY valid JSON with this exact shape:
{
  "user_profile": {
    "summary": string,       // 2-3 sentence narrative about this candidate
    "top_skills": string[],  // 6-8 skills inferred from CV + personality
    "career_domains": string[], // e.g. ["technology", "consulting"]
    "work_style": string     // 1-sentence preferred work style
  },
  "insights": {
    "strengths": [{ "title": string, "description": string }],    // exactly 3 items
    "growth_areas": [{ "title": string, "description": string }], // exactly 2 items
    "career_clusters": [{ "name": string, "score": number }],     // 4-6 items, score 0-100
    "skill_dimensions": {
      "technical": number,
      "communication": number,
      "leadership": number,
      "creativity": number,
      "analytical": number,
      "domain_expertise": number,
      "collaboration": number,
      "adaptability": number
    }
  }
}

All numeric scores are 0-100. Do not include any text outside the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      cvData,
      answers,
      interests,
    }: {
      userId: string;
      cvData: CVData;
      answers: PersonalityAnswers;
      interests: Interests;
    } = await req.json();

    const education = cvData.education
      .map((e) => `${e.degree} in ${e.field} at ${e.institution} (${e.start_year}–${e.end_year ?? "present"})`)
      .join("; ");

    const experience = cvData.experience
      .map((e) => `${e.title} at ${e.company} (${e.start_date}–${e.end_date ?? "present"}): ${e.description}`)
      .join("\n");

    const personalityLines = PERSONALITY_QUESTIONS.map((q) => {
      const selectedValue = answers[q.id];
      const selectedOption = q.options.find((o) => o.value === selectedValue);
      return `Q: ${q.question}\nA: ${selectedOption?.label ?? selectedValue ?? "No answer"}`;
    }).join("\n\n");

    const userMessage = `=== CV ===
Name: ${cvData.name}
Email: ${cvData.email ?? "N/A"}
Education: ${education || "N/A"}
Experience:
${experience || "N/A"}
Skills: ${cvData.skills.join(", ") || "N/A"}
Languages: ${cvData.languages.join(", ") || "N/A"}
Certifications: ${cvData.certifications.join(", ") || "N/A"}

=== PERSONALITY ===
${personalityLines}

=== INTERESTS ===
Favourite book: ${interests.favourite_book ?? "N/A"}
Favourite movie: ${interests.favourite_movie ?? "N/A"}
Other: ${interests.other ?? "N/A"}`;

    const text = await geminiChat([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ]);

    const parsed = JSON.parse(text);
    const userProfile: UserProfile = parsed.user_profile;
    const insights: ProfileInsights = parsed.insights;

    const embedding = await generateEmbedding(userProfile.summary);

    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        cv_data: cvData,
        rich_profile: userProfile,
        insights,
        interests,
        embedding,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Profile generation error:", err);
    return NextResponse.json({ error: "Failed to generate profile" }, { status: 500 });
  }
}
