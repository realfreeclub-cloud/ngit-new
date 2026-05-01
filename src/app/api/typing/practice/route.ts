import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WordSet, { IWordSet } from "@/models/WordSet";
import PracticeEssay, { IPracticeEssay } from "@/models/PracticeEssay";
import CurrentPassage, { ICurrentPassage } from "@/models/CurrentPassage";
import TypingPassage from "@/models/TypingPassage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type")?.toUpperCase();
    const cat = searchParams.get("cat");
    const val = searchParams.get("val");
    const bookId = searchParams.get("bookId");
    const lang = searchParams.get("lang");

    await connectDB();

    if (type === 'BOOK' && bookId) {
        const query: any = { bookId };
        if (lang) query.language = lang;
        const passages = await TypingPassage.find(query).sort({ createdAt: 1 }).lean();
        return NextResponse.json(passages);
    }

    if (type === 'BOOK' && val) {
        if (!mongoose.Types.ObjectId.isValid(val as string)) {
            return NextResponse.json({ error: "Invalid chapter ID" }, { status: 400 });
        }
        const passage = await TypingPassage.findById(val).lean() as any;
        if (!passage) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        return NextResponse.json({
            title: passage.title,
            content: passage.content,
            duration: 10,
            backspaceMode: 'full',
            highlightMode: 'word'
        });
    }

    if (type === 'TAXONOMY') {
        const words = await WordSet.find().select('_id category value name language').lean();
        const essays = await PracticeEssay.find().select('_id topic title language').lean();
        const current = await CurrentPassage.find().select('_id title language createdAt').sort({ createdAt: -1 }).lean();
        return NextResponse.json({ words, essays, current });
    }

    if (type === 'WORD') {
        const set = await WordSet.findById(val).lean() as IWordSet | null;
        if (!set) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({
            title: set.name || `${set.category} Practice`,
            content: set.words.join(' '),
            duration: 5,
            backspaceMode: 'full',
            highlightMode: 'word'
        });
    }

    if (type === 'ESSAY') {
        const essay = await PracticeEssay.findById(val).lean() as IPracticeEssay | null;
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
        const passage = await CurrentPassage.findById(val).lean() as ICurrentPassage | null;
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
