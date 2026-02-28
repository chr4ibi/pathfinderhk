import { createServerSupabaseClient } from "@/lib/supabase-server";

interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  role: string;
  parts?: UIMessagePart[];
  content?: string;
}

function extractText(msg: UIMessage): string {
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
  }
  return msg.content ?? "";
}

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  const supabase = await createServerSupabaseClient();

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

Always personalise your responses to the user's actual profile and interests above.`;

  const minimaxMessages = [
    { role: "system" as const, content: systemPrompt },
    ...(messages as UIMessage[]).map((m) => ({
      role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: extractText(m),
    })),
  ];

  // Call MiniMax with streaming enabled
  const res = await fetch(
    `https://api.minimax.chat/v1/text/chatcompletion_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "abab6.5s-chat",
        messages: minimaxMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    }
  );

  if (!res.ok || !res.body) {
    const err = await res.text();
    return new Response(
      `3:${JSON.stringify(`MiniMax error: ${err}`)}\n`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Vercel-AI-Data-Stream": "v1" } }
    );
  }

  const encoder = new TextEncoder();
  const msgId = `msg_${Date.now()}`;

  // Transform MiniMax SSE → Vercel AI SDK data stream format (v1)
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`f:{"messageId":"${msgId}"}\n`));

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      controller.enqueue(
        encoder.encode(
          `e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0},"isContinued":false}\n`
        )
      );
      controller.enqueue(
        encoder.encode(
          `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}
