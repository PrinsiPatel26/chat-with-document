import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: "The capital of India is New Delhi.",
    });

    return NextResponse.json({
      success: true,
      embeddingLength: response.embeddings?.[0]?.values?.length,
      embedding: response.embeddings?.[0]?.values?.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}