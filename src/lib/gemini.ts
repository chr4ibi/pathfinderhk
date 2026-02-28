import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const geminiFlash = google("gemini-1.5-flash");

interface GeminiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Non-streaming text generation. Strips markdown fences from the response. */
export async function geminiChat(
  messages: GeminiMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const { text } = await generateText({
    model: geminiFlash,
    system: systemMsg?.content,
    messages: chatMessages,
    temperature: options.temperature ?? 0.3,
    maxOutputTokens: options.maxTokens ?? 2048,
  });

  // Strip markdown code fences Gemini occasionally adds
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}
