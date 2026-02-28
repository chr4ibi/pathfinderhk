import { NextRequest, NextResponse } from "next/server";
import { geminiChat } from "@/lib/gemini";
import { CVData } from "@/types";

async function extractText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (file.type === "application/pdf") {
    // Dynamic import avoids Next.js fs-related bundling issues with pdf-parse
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}

const CV_PARSE_PROMPT = `Extract structured data from the CV text below and return ONLY valid JSON matching this schema:
{
  "name": string,
  "email": string | null,
  "education": [{ "institution": string, "degree": string, "field": string, "start_year": number, "end_year": number | null, "gpa": string | null }],
  "skills": string[],
  "experience": [{ "company": string, "title": string, "start_date": string, "end_date": string | null, "description": string }],
  "languages": string[],
  "certifications": string[]
}
Return only JSON, no markdown, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await extractText(file);

    const response = await geminiChat([
      {
        role: "system",
        content: CV_PARSE_PROMPT,
      },
      {
        role: "user",
        content: text,
      },
    ]);

    // Strip markdown code fences MiniMax sometimes adds
    const cleaned = response.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const cvData: CVData = JSON.parse(cleaned);
    return NextResponse.json(cvData);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("CV parse error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
