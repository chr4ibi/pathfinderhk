import { NextRequest, NextResponse } from "next/server";
import { generateText, FilePart } from "ai";
import { claudeSonnet } from "@/lib/ai";
import { CVData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const { text } = await generateText({
      model: claudeSonnet,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: base64,
              mediaType,
            } satisfies FilePart,
            {
              type: "text",
              text: `Extract structured data from this CV and return ONLY valid JSON matching this schema:
{
  "name": string,
  "email": string | null,
  "education": [{ "institution": string, "degree": string, "field": string, "start_year": number, "end_year": number | null, "gpa": string | null }],
  "skills": string[],
  "experience": [{ "company": string, "title": string, "start_date": string, "end_date": string | null, "description": string }],
  "languages": string[],
  "certifications": string[]
}
Return only JSON, no markdown, no explanation.`,
            },
          ],
        },
      ],
    });

    const cvData: CVData = JSON.parse(text);
    return NextResponse.json(cvData);
  } catch (err) {
    console.error("CV parse error:", err);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
