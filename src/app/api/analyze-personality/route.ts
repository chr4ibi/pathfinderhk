import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { PersonalityTraits } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { answers }: { answers: Record<string, string> } = await req.json();

    const answersText = Object.entries(answers)
      .map(([qId, answer]) => `${qId}: ${answer}`)
      .join("\n");

    const content = await geminiChat([
      {
        role: "system",
        content: `You are a personality analyst. Analyse the following questionnaire answers and extract personality dimensions.
Return ONLY valid JSON with scores from -100 to 100 where applicable:
{
  "collaborative_vs_independent": number,  // -100 = very independent, 100 = very collaborative
  "risk_tolerant_vs_cautious": number,     // -100 = very cautious, 100 = very risk-tolerant
  "creative_vs_analytical": number,        // -100 = very analytical, 100 = very creative
  "detail_oriented_vs_big_picture": number,// -100 = very detail-oriented, 100 = big-picture
  "leadership_potential": number,          // 0-100
  "social_impact_driven": number           // 0-100
}`,
      },
      {
        role: "user",
        content: `Questionnaire answers:\n${answersText}\n\nReturn only JSON.`,
      },
    ]);

    const traits: PersonalityTraits = JSON.parse(content);
    return NextResponse.json(traits);
  } catch (err) {
    console.error("Personality analysis error:", err);
    return NextResponse.json({ error: "Failed to analyse personality" }, { status: 500 });
  }
}
