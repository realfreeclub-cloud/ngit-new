"use server";

import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAdminQuizzes() {
    try {
        await connectDB();
        const quizzes = await Quiz.find()
            .populate("courseId", "title")
            .sort({ createdAt: -1 })
            .lean();
        return { success: true, quizzes: JSON.parse(JSON.stringify(quizzes)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createAdminQuiz(data: any) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

        const quiz = await Quiz.create({
            title: data.title,
            courseId: data.courseId,
            settings: {
                timeLimit: data.timeLimit || 30,
                totalMarks: data.totalMarks || 10,
                passingMarks: data.passingMarks || 4,
                shuffleQuestions: false,
                shuffleOptions: false,
                availableLanguages: ["en"],
            },
            schedule: {
                startDate: new Date(),
                endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days default
                gracePeriodMinutes: 0
            },
            security: {
                maxAttempts: 1,
                preventTabSwitch: false,
                requireFullscreen: false,
                trackIpDevice: false,
            },
            questions: [], // We'll handle this in the advanced ui
            instructions: {
                en: data.description || "",
            },
            isPublished: true,
        });

        revalidatePath("/admin/mock-tests/list");
        return { success: true, quiz: JSON.parse(JSON.stringify(quiz)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
