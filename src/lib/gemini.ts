import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const geminiFlash = openai("gpt-4o-mini");

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Non-streaming text generation. Strips markdown fences from the response. */
export async function geminiChat(
  messages: ChatMessage[],
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

  // Strip markdown code fences the model occasionally adds
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
}
