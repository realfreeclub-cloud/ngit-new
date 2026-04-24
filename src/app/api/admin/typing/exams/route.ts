import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingExam from "@/models/TypingExam";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const exams = await TypingExam.find()
      .populate("passageId")
      .sort({ startTime: -1 });
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    // Auto-fill missing required fields
    const examData = {
      ...data,
      startTime: data.startTime || new Date(),
      endTime: data.endTime || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      status: data.status || "Active",
    };

    const exam = await TypingExam.create(examData);
    return NextResponse.json({ success: true, exam: exam.toObject() }, { status: 201 });
  } catch (error: any) {
    console.error("Exam Creation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create exam" }, { status: 500 });
  }
}
