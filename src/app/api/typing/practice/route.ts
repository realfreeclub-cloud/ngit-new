import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WordSet, { IWordSet } from "@/models/WordSet";
import PracticeEssay, { IPracticeEssay } from "@/models/PracticeEssay";
import CurrentPassage, { ICurrentPassage } from "@/models/CurrentPassage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type")?.toUpperCase();
    const cat = searchParams.get("cat");
    const val = searchParams.get("val");

    await connectDB();

    if (type === 'WORD') {
        const set = await WordSet.findOne({ category: cat, value: val }).lean() as IWordSet | null;
        if (!set) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({
            title: `${cat} Practice: ${val}`,
            content: set.words.join(' '),
            duration: 5,
            backspaceMode: 'full',
            highlightMode: 'word'
        });
    }

    if (type === 'ESSAY') {
        const essay = await PracticeEssay.findOne({ topic: cat, title: val }).lean() as IPracticeEssay | null;
        if (!essay) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({
            title: essay.title,
            content: essay.content,
            duration: 10,
            backspaceMode: 'full',
            highlightMode: 'word'
        });
    }

    if (type === 'CURRENT') {
        const passage = await CurrentPassage.findOne().sort({ date: -1 }).lean() as ICurrentPassage | null;
        if (!passage) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({
            title: passage.title,
            content: passage.content,
            duration: 10,
            backspaceMode: 'full',
            highlightMode: 'word'
        });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
