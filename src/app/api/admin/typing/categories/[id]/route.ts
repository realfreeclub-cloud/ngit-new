import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TypingCategory from "@/models/TypingCategory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await TypingCategory.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
