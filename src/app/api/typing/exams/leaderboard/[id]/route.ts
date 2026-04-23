import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingResult from "@/models/TypingResult";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Fetch top 10 results for this exam, sorted by WPM (desc) and Accuracy (desc)
    const leaderboard = await TypingResult.find({ examId: params.id })
      .populate("userId", "name image")
      .sort({ wpm: -1, accuracy: -1 })
      .limit(10);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
