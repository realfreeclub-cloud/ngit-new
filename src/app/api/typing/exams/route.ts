import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingExam from "@/models/TypingExam";
import "@/models/TypingPassage";
import TypingResult from "@/models/TypingResult";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    
    const now = new Date();
    const query: any = {
      status: "Active",
      startTime: { $lte: now },
      endTime: { $gte: now }
    };

    if (category && category !== "All") {
      query.category = category;
    }

    const exams = await TypingExam.find(query)
    .populate("passageId")
    .sort({ startTime: 1 });

    // Add participant count to each exam
    const examsWithCounts = await Promise.all(exams.map(async (exam) => {
      const count = await TypingResult.countDocuments({ examId: exam._id });
      return { ...exam.toObject(), participantCount: count };
    }));
    
    return NextResponse.json(examsWithCounts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch active exams" }, { status: 500 });
  }
}
