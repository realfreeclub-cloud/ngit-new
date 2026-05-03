import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingExam from "@/models/TypingExam";
import "@/models/TypingPassage";
import "@/models/TypingBook";
import TypingResult from "@/models/TypingResult";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const lang = searchParams.get("language") || searchParams.get("lang");
    const bookId = searchParams.get("bookId");
    const govExamId = searchParams.get("govExamId");
    const difficulty = searchParams.get("difficulty");
    
    const now = new Date();
    const query: any = { status: "Active" };

    // Only apply date constraints for general timed exams, 
    // allow practice flow to access all active tests.
    if (!govExamId && !bookId) {
        query.startTime = { $lte: now };
        query.endTime = { $gte: now };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (lang) {
      query.language = lang;
    }

    if (bookId && bookId !== "All") {
      query.bookId = bookId;
    }

    if (govExamId && govExamId !== "null" && govExamId !== "undefined") {
      query.govExamId = govExamId;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const exams = await TypingExam.find(query)
    .populate("passageId")
    .populate({ path: "bookId", strictPopulate: false })
    .populate({ path: "rulePresetId", strictPopulate: false })
    .sort({ createdAt: -1 });

    // Add participant count to each exam
    const examsWithCounts = await Promise.all(exams.map(async (exam) => {
      const count = await TypingResult.countDocuments({ examId: exam._id });
      return { ...exam.toObject(), participantCount: count };
    }));
    
    return NextResponse.json(examsWithCounts);
  } catch (error) {
    console.error("Exams API Error:", error);
    return NextResponse.json({ error: "Failed to fetch active exams" }, { status: 500 });
  }
}
