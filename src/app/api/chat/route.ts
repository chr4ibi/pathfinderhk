import { streamText, tool } from "ai";
import { claudeSonnet } from "@/lib/bedrock";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  const supabase = await createServerSupabaseClient();

  // Fetch user context
  const { data: profile } = await supabase
    .from("profiles")
    .select("cv_data, personality_traits, interests, insights")
    .eq("user_id", userId)
    .single();

  const { data: recommendations } = await supabase
    .from("recommendations")
    .select("fit_score, fit_explanation, gaps, actions, opportunity:opportunities(*)")
    .eq("user_id", userId)
    .order("fit_score", { ascending: false })
    .limit(10);

  const systemPrompt = `You are PathfinderHK's AI Career Advisor — a supportive, knowledgeable guide for Hong Kong students and early-career professionals.

## User Profile
${JSON.stringify(profile, null, 2)}

## Current Top Recommendations
${JSON.stringify(recommendations, null, 2)}

## Your Role
- Answer career questions with specific, actionable advice
- Explain recommendations in depth when asked
- Suggest learning paths for skill gaps
- Be encouraging but honest about gaps
- Keep responses concise and focused on Hong Kong context
- Use the available tools to search for specific opportunities or explain recommendations in more detail

Always personalise your responses to the user's actual profile and interests above.`;

  const result = streamText({
    model: claudeSonnet,
    system: systemPrompt,
    messages,
    tools: {
      searchOpportunities: tool({
        description: "Search for Hong Kong opportunities matching specific criteria",
        inputSchema: z.object({
          query: z.string().describe("Search query, e.g. 'fintech internship' or 'NGO volunteer'"),
          type: z.enum(["internship", "graduate_program", "fellowship", "volunteer", "full_time"]).optional(),
          industry: z.string().optional(),
        }),
        execute: async ({ query, type, industry }) => {
          let q = supabase
            .from("opportunities")
            .select("id, title, org, type, industry, location, description, deadline")
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

          if (type) q = q.eq("type", type);
          if (industry) q = q.ilike("industry", `%${industry}%`);

          const { data, error } = await q.limit(5);
          if (error) return { error: error.message };
          return data ?? [];
        },
      }),

      explainRecommendation: tool({
        description: "Get detailed information about a specific recommendation",
        inputSchema: z.object({
          opportunityTitle: z.string().describe("Title of the opportunity to explain"),
        }),
        execute: async ({ opportunityTitle }) => {
          // Find the opportunity by title first
          const { data: opp } = await supabase
            .from("opportunities")
            .select("id")
            .ilike("title", `%${opportunityTitle}%`)
            .limit(1)
            .single();

          if (!opp) return { error: "Opportunity not found" };

          const { data, error } = await supabase
            .from("recommendations")
            .select("fit_score, fit_explanation, gaps, actions, opportunity:opportunities(*)")
            .eq("user_id", userId)
            .eq("opportunity_id", opp.id)
            .single();

          if (error) return { error: "Recommendation not found" };
          return data;
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
