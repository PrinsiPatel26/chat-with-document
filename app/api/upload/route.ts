import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getSupabaseServerClient } from "@/src/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isPdfFile(file: File, bytes: Uint8Array) {
  const isPdfMime = file.type === "application/pdf";
  const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const isPdfMagicHeader =
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d;

  return (isPdfMime || isPdfExtension) && isPdfMagicHeader;
}
function splitIntoChunks(text: string, maxWords = 250) {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/);

  const chunks: string[] = [];
  let currentChunk = "";
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);

    if (currentWordCount + words.length <= maxWords) {
      currentChunk += sentence + " ";
      currentWordCount += words.length;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + " ";
      currentWordCount = words.length;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (!isPdfFile(file, bytes)) {
      return NextResponse.json(
        { error: "Only valid PDF files are allowed" },
        { status: 400 }
      );
    }

    // const buffer = Buffer.from(arrayBuffer);
    // const uniqueName = `${Date.now()}-${randomUUID()}-${sanitizeFileName(file.name)}`;

    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    // const pdfData = await pdfParse(buffer);
    // const extractedText = pdfData.text;

    // console.log("===== Extracted PDF Text =====");
    // console.log(extractedText);
    // console.log("==============================");
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Split text into chunks
    const chunks = splitIntoChunks(extractedText);

    console.log("========== PDF CHUNKS ==========");

    chunks.forEach((chunk, index) => {
      console.log(`Chunk ${index + 1}`);
      console.log(chunk);
      console.log("--------------------------------");
    });

    console.log("================================");

    const uniqueName = `${Date.now()}-${randomUUID()}-${sanitizeFileName(file.name)}`;
    const supabase = getSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(uniqueName, buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (!error && data?.path) {
        return NextResponse.json({
          success: true,
          message: "File uploaded successfully",
          storage: "supabase",
          savedPath: `documents/${data.path}`,
          text: extractedText,
          chunks,
        });
      }
    }

    const tempDir = path.join(process.cwd(), "tmp", "uploads");
    await mkdir(tempDir, { recursive: true });
    const localPath = path.join(tempDir, uniqueName);
    await writeFile(localPath, buffer);

    return NextResponse.json({
      success: true,
      message: "File saved to temporary server storage",
      storage: "local-temp",
      savedPath: localPath,
      text: extractedText,
      chunks,
    });

  } catch (error) {
    console.error("Upload failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}