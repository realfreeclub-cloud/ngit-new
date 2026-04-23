import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingResult from "@/models/TypingResult";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Prevent duplicate submissions for the same exam by the same user
    const existingResult = await TypingResult.findOne({
      userId: session.user.id,
      examId: data.examId
    });

    if (existingResult) {
      return NextResponse.json({ error: "Exam already submitted" }, { status: 400 });
    }

    const result = await TypingResult.create({
      userId: session.user.id,
      ...data
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Result Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit results" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const results = await TypingResult.find({ userId: session.user.id })
      .populate("examId")
      .sort({ createdAt: -1 });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
