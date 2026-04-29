import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingPassage from "@/models/TypingPassage";
import TypingExam from "@/models/TypingExam";
import TypingCategory from "@/models/TypingCategory";
import WordSet from "@/models/WordSet";
import PracticeEssay from "@/models/PracticeEssay";
import CurrentPassage from "@/models/CurrentPassage";
import TypingResult from "@/models/TypingResult";
import TypingBook from "@/models/TypingBook";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [passages, exams, categories, wordSets, essays, current, books] = await Promise.all([
      TypingPassage.find().sort({ createdAt: -1 }),
      TypingExam.find().populate("passageId").populate({ path: "bookId", strictPopulate: false }).sort({ createdAt: -1 }),
      TypingCategory.find().sort({ name: 1 }),
      WordSet.find().sort({ category: 1 }),
      PracticeEssay.find().sort({ topic: 1 }),
      CurrentPassage.find().sort({ date: -1 }),
      TypingBook.find().sort({ name: 1 })
    ]);

    // Fetch results separately to prevent user population errors blocking the dashboard
    let results: any[] = [];
    try {
      results = await TypingResult.find().populate({ path: "userId", model: User }).sort({ createdAt: -1 }).limit(100);
    } catch (resultErr: any) {
      console.warn("Results fetch warning:", resultErr.message);
    }

    return NextResponse.json({
      passages,
      exams,
      categories,
      wordSets,
      essays,
      current,
      results,
      books
    });
  } catch (error: any) {
    console.error("DASHBOARD_FETCH_ERROR:", {
      message: error.message,
      stack: error.stack,
      error
    });
    return NextResponse.json({ error: "Failed to fetch dashboard data: " + error.message }, { status: 500 });
  }
}
