const MINIMAX_BASE_URL = "https://api.minimax.chat/v1";

export { minimaxChat } from "./minimax";

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `${MINIMAX_BASE_URL}/embeddings?GroupId=${process.env.MINIMAX_GROUP_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "embo-01",
        input: [text],
        type: "db",
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax embeddings error: ${err}`);
  }

  const data = await res.json();

  // Handle both response formats MiniMax may return
  if (Array.isArray(data.vectors?.[0])) return data.vectors[0];
  if (Array.isArray(data.data?.[0]?.embedding)) return data.data[0].embedding;

  throw new Error(`MiniMax embeddings: unexpected response: ${JSON.stringify(data)}`);
}
