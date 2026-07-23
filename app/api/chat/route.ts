import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSupabaseServerClient } from "@/src/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const embeddingResponse = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: question,
    });

    const embedding = embeddingResponse.embeddings?.[0]?.values;

    if (!embedding) {
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 }
      );
    }

    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client not initialized" },
        { status: 500 }
      );
    }

    const { data: matches, error } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: embedding,
        match_count: 3,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        success: true,
        answer: "No relevant information found in the uploaded document.",
        matches: [],
      });
    }

    const context = matches.map((item: any) => item.chunk_text).join("\n\n");

    const prompt = `
You are an AI assistant.

Answer ONLY using the context below.

If the answer is not available in the context, reply exactly:

"I couldn't find the answer in the uploaded document."

Context:

${context}

Question:

${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      answer: response.text ?? "No answer generated.",
      matches,
    });
  } catch (error: any) {
  console.error("========== CHAT ERROR ==========");
  console.error(error);

  return NextResponse.json(
    {
      message: error?.message,
      status: error?.status,
      fullError: error,
    },
    {
      status: error?.status || 500,
    }
  );
}
}