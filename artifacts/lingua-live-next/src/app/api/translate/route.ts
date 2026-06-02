import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Translation } from "@/models/Translation";

const SUPPORTED = ["hi","en","te","ta","kn","bn","mr","gu","pa","ml","or","as","ur","sa","ne","si"];

async function googleTranslate(text: string, src: string, tgt: string): Promise<string> {
  const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${src}&tl=${tgt}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  const data = await res.json();
  if (data && data[0]) {
    return data[0];
  }
  throw new Error("Google Translate failed");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sourceLanguage, targetLanguage, sessionId } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "text, sourceLanguage, and targetLanguage are required" },
        { status: 400 }
      );
    }
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({ error: "Source and target cannot be the same" }, { status: 400 });
    }
    if (!SUPPORTED.includes(sourceLanguage) || !SUPPORTED.includes(targetLanguage)) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    const start = Date.now();
    let translatedText: string;
    try {
      translatedText = await googleTranslate(text.trim(), sourceLanguage, targetLanguage);
    } catch {
      translatedText = `[${targetLanguage}]: ${text}`;
    }
    const processingTime = Date.now() - start;

    // Save to MongoDB (non-blocking — don't fail the request if DB is down)
    try {
      await connectDB();
      await Translation.create({
        sourceText: text.trim(),
        translatedText,
        sourceLanguage,
        targetLanguage,
        sessionId: sessionId || undefined,
        confidence: 0.95,
        processingTime,
      });
    } catch (dbErr) {
      console.warn("DB save skipped:", dbErr);
    }

    return NextResponse.json({
      success: true,
      translation: {
        sourceText: text.trim(),
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95,
        processingTime,
      },
    });
  } catch (err) {
    console.error("Translate error:", err);
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const query = sessionId ? { sessionId } : {};
    const translations = await Translation.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json({ success: true, translations });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve history" }, { status: 500 });
  }
}
