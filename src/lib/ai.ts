import { createAnthropic } from "@ai-sdk/anthropic";
import OpenAI from "openai";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Primary model for CV parsing, matching, insights, chatbot
export const claudeSonnet = anthropic("claude-3-5-sonnet-20241022");

// OpenAI embeddings — text-embedding-3-small produces 1536 dims, matching existing pgvector schema
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 1536,
  });
  return response.data[0].embedding;
}
