import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { generateEmbedding } from "@/lib/ai";
import { createServiceSupabaseClient } from "@/lib/supabase-server";
import { buildUserInput, PROFILE_EXTRACTION_SYSTEM_PROMPT } from "@/lib/profile-extraction-prompt";
import { CVData, Interests, PersonalityAnswers, RichUserProfile } from "@/types";

function buildSummaryForEmbedding(cvData: CVData, richProfile: RichUserProfile): string {
  const { Psychometrics_BigFive: bf, Vocational_Interests_and_Values: viv, Domain_Skills_Languages: langs } = richProfile;

  const riasec = [
    ["Realistic", viv.riasec_realistic],
    ["Investigative", viv.riasec_investigative],
    ["Artistic", viv.riasec_artistic],
    ["Social", viv.riasec_social],
    ["Enterprising", viv.riasec_enterprising],
    ["Conventional", viv.riasec_conventional],
  ]
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([label]) => label)
    .join(", ");

  const spokenLangs = Object.entries(langs)
    .filter(([, score]) => (score as number) > 0)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([key]) => key.replace("lang_", ""))
    .join(", ");

  const education = cvData.education
    .map((e) => `${e.degree} in ${e.field} at ${e.institution}`)
    .join("; ");

  return `
Name: ${cvData.name}
Education: ${education || "N/A"}
Skills: ${cvData.skills.slice(0, 20).join(", ")}
Experience: ${cvData.experience.map((e) => `${e.title} at ${e.company}`).join("; ")}
Languages: ${spokenLangs || "N/A"}
Big Five: O=${bf.openness_overall} C=${bf.conscientiousness_overall} E=${bf.extraversion_overall} A=${bf.agreeableness_overall} N=${bf.neuroticism_overall}
Top RIASEC: ${riasec}
Certifications: ${cvData.certifications.slice(0, 10).join(", ")}
  `.trim();
}

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

    const userInput = buildUserInput(cvData, answers);

    const text = await geminiChat([
      { role: "system", content: PROFILE_EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: userInput },
    ]);

    const richProfile: RichUserProfile = JSON.parse(text);

    const summaryText = buildSummaryForEmbedding(cvData, richProfile);
    const embedding = await generateEmbedding(summaryText);

    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        cv_data: cvData,
        rich_profile: richProfile,
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
