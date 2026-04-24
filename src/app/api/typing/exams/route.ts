import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingExam from "@/models/TypingExam";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const exams = await TypingExam.find({
      status: "Active",
      startTime: { $lte: now },
      endTime: { $gte: now }
    })
    .populate("passageId")
    .sort({ startTime: 1 });
    
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch active exams" }, { status: 500 });
  }
}
