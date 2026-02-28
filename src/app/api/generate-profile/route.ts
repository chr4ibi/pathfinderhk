import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/bedrock";
import { createServiceSupabaseClient } from "@/lib/supabase-server";
import { CVData, PersonalityTraits, Interests } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      cvData,
      personalityTraits,
      interests,
    }: {
      userId: string;
      cvData: CVData;
      personalityTraits: PersonalityTraits;
      interests: Interests;
    } = await req.json();

    // Build a rich text representation for embedding
    const profileText = `
Name: ${cvData.name}
Education: ${cvData.education.map((e) => `${e.degree} in ${e.field} at ${e.institution}`).join(", ")}
Skills: ${cvData.skills.join(", ")}
Experience: ${cvData.experience.map((e) => `${e.title} at ${e.company}: ${e.description}`).join(" | ")}
Languages: ${cvData.languages.join(", ")}
Certifications: ${cvData.certifications.join(", ")}
Personality: collaborative=${personalityTraits.collaborative_vs_independent}, risk=${personalityTraits.risk_tolerant_vs_cautious}, creative=${personalityTraits.creative_vs_analytical}
Social impact driven: ${personalityTraits.social_impact_driven}
Interests: book=${interests.favourite_book ?? "N/A"}, movie=${interests.favourite_movie ?? "N/A"}, other=${interests.other ?? "N/A"}
    `.trim();

    const embedding = await generateEmbedding(profileText);

    const supabase = createServiceSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        cv_data: cvData,
        personality_traits: personalityTraits,
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
