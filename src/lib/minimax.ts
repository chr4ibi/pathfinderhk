const MINIMAX_BASE_URL = "https://api.minimax.chat/v1";

interface MinimaxMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface MinimaxChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Call MiniMax LLM for personality trait extraction.
 * Returns the assistant message content as a string.
 */
export async function minimaxChat(
  messages: MinimaxMessage[],
  options: MinimaxChatOptions = {}
): Promise<string> {
  const { model = "abab6.5s-chat", temperature = 0.3, max_tokens = 1024 } = options;

  const res = await fetch(
    `${MINIMAX_BASE_URL}/text/chatcompletion_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax chat error: ${err}`);
  }

  const data = await res.json();

  if (data.base_resp?.status_code !== 0) {
    throw new Error(`MiniMax error ${data.base_resp?.status_code}: ${data.base_resp?.status_msg}`);
  }

  if (!data.choices?.length) {
    throw new Error(`MiniMax returned no choices. Full response: ${JSON.stringify(data)}`);
  }

  return data.choices[0].message.content as string;
}

/**
 * Generate audio using MiniMax TTS and return a URL to the audio.
 */
export async function minimaxTTS(text: string): Promise<string> {
  const res = await fetch(
    `https://api.minimax.chat/v1/t2a_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "speech-01-turbo",
        text,
        stream: false,
        voice_setting: {
          voice_id: "Friendly_Person",
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: "mp3",
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax TTS error: ${err}`);
  }

  const data = await res.json();

  if (data.base_resp?.status_code !== 0) {
    throw new Error(`MiniMax TTS failed: ${data.base_resp?.status_msg}`);
  }

  // MiniMax returns audio as hex-encoded mp3 in data.data.audio
  const hexAudio = data.data?.audio as string | undefined;
  if (!hexAudio) throw new Error("MiniMax TTS: no audio data in response");

  const base64 = Buffer.from(hexAudio, "hex").toString("base64");
  return `data:audio/mp3;base64,${base64}`;
}
