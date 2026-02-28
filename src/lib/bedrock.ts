import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

export const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION ?? "ap-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

// Primary model for CV parsing, matching, insights, chatbot
export const claudeSonnet = bedrock("anthropic.claude-3-5-sonnet-20241022-v2:0");

// Embeddings model for vectorisation (1536 dims)
export const EMBEDDING_MODEL = "amazon.titan-embed-text-v1";

export async function generateEmbedding(text: string): Promise<number[]> {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import(
    "@aws-sdk/client-bedrock-runtime"
  );

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION ?? "ap-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const response = await client.send(
    new InvokeModelCommand({
      modelId: EMBEDDING_MODEL,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({ inputText: text }),
    })
  );

  const parsed = JSON.parse(Buffer.from(response.body).toString());
  return parsed.embedding as number[];
}
