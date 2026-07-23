import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  return NextResponse.json({
    exists: !!apiKey,
    startsWith: apiKey?.substring(0, 6),
    endsWith: apiKey?.substring(apiKey.length - 6),
    length: apiKey?.length,
  });
}