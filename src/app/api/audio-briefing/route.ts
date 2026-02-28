import { NextRequest, NextResponse } from "next/server";
import { minimaxTTS } from "@/lib/minimax";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { userId }: { userId: string } = await req.json();
    const supabase = await createServerSupabaseClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("cv_data, insights")
      .eq("user_id", userId)
      .single();

    const { data: recommendations } = await supabase
      .from("recommendations")
      .select("fit_score, fit_explanation, opportunity:opportunities(title, org)")
      .eq("user_id", userId)
      .order("fit_score", { ascending: false })
      .limit(3);

    const name = profile?.cv_data?.name ?? "there";
    const insights = profile?.insights;

    const topStrengths = insights?.strengths
      ?.slice(0, 2)
      .map((s: { title: string }) => s.title)
      .join(" and ");

    const topClusters = insights?.career_clusters
      ?.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 2)
      .map((c: { name: string; score: number }) => `${c.name} at ${c.score}%`)
      .join(", ");

    const topRecs = recommendations
      ?.slice(0, 3)
      .map((r) => {
        const opp = r.opportunity as unknown as { title: string; org: string };
        return `${opp.title} at ${opp.org} with a ${r.fit_score}% fit score`;
      })
      .join("; ");

    const script = `
Welcome to your PathfinderHK career briefing, ${name}.

Based on your profile, your strongest areas are ${topStrengths ?? "your unique combination of skills and experiences"}.

Your highest career alignment is in ${topClusters ?? "multiple exciting fields"}.

Your top three recommended opportunities are: ${topRecs ?? "being prepared — check back soon"}.

These matches are based on your skills, personality, and values. Explore each one in your dashboard to see personalised action steps.

Good luck on your journey. PathfinderHK is here to guide you every step of the way.
    `.trim();

    const audioData = await minimaxTTS(script);

    return NextResponse.json({ audio: audioData, script });
  } catch (err) {
    console.error("Audio briefing error:", err);
    return NextResponse.json({ error: "Failed to generate audio briefing" }, { status: 500 });
  }
}
