import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase-server";
import { ProfileInsights } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId }: { userId: string } = await req.json();
    const supabase = await createServerSupabaseClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("cv_data, personality_traits, interests")
      .eq("user_id", userId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const text = await geminiChat([
      {
        role: "user",
        content: `Based on this user profile:
CV: ${JSON.stringify(profile.cv_data)}
Personality: ${JSON.stringify(profile.personality_traits)}
Interests: ${JSON.stringify(profile.interests)}

Generate professional insights and return ONLY valid JSON:
{
  "strengths": [
    { "title": string, "description": string }
  ],
  "growth_areas": [
    { "title": string, "description": string }
  ],
  "career_clusters": [
    { "name": string, "score": number }
  ],
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
}`,
      },
    ]);

    const insights: ProfileInsights = JSON.parse(text);

    await createServiceSupabaseClient()
      .from("profiles")
      .update({ insights })
      .eq("user_id", userId);

    return NextResponse.json(insights);
  } catch (err) {
    console.error("Profile insights error:", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
