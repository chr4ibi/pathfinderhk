import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { userId }: { userId: string } = await req.json();
    const supabase = await createServerSupabaseClient();
    const serviceSupabase = createServiceSupabaseClient();

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Vector similarity search — top 20 opportunities
    const { data: matches, error: matchErr } = await supabase.rpc(
      "match_opportunities",
      {
        query_embedding: profile.embedding,
        match_count: 20,
      }
    );

    if (matchErr) throw matchErr;

    const recommendations = await Promise.all(
      (matches as { id: string; title: string; org: string; description: string; requirements: string[] }[]).slice(0, 10).map(async (opp) => {
        const profileSummary = `
CV: ${JSON.stringify(profile.cv_data)}
Profile: ${JSON.stringify(profile.rich_profile)}
Interests: ${JSON.stringify(profile.interests)}
        `.trim();

        const text = await geminiChat([
          {
            role: "user",
            content: `Given this user profile:
${profileSummary}

And this opportunity:
Title: ${opp.title}
Organisation: ${opp.org}
Description: ${opp.description}
Requirements: ${opp.requirements?.join(", ")}

Return ONLY valid JSON:
{
  "fit_score": number (0-100),
  "fit_explanation": string (2-3 sentences why this is a good fit),
  "gaps": string (1-2 sentences on potential gaps),
  "actions": string[] (2-3 concrete steps to improve candidacy)
}`,
          },
        ]);

        const fitData = JSON.parse(text);

        return {
          opportunity_id: opp.id,
          user_id: userId,
          ...fitData,
        };
      })
    );

    const { error: upsertErr } = await serviceSupabase
      .from("recommendations")
      .upsert(recommendations);

    if (upsertErr) throw upsertErr;

    const { data: full } = await supabase
      .from("recommendations")
      .select("*, opportunity:opportunities(*)")
      .eq("user_id", userId)
      .order("fit_score", { ascending: false })
      .limit(10);

    return NextResponse.json({ recommendations: full });
  } catch (err) {
    console.error("Matching error:", err);
    return NextResponse.json({ error: "Failed to run matching" }, { status: 500 });
  }
}
