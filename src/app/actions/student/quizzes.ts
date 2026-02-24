"use server";

import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import Attempt from "@/models/Attempt";
import Answer from "@/models/Answer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Enrollment from "@/models/Enrollment";

export async function getAvailableQuizzes() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const activeEnrollments = await Enrollment.find({ userId: session.user.id, isActive: true }).lean();
        const enrolledCourseIds = activeEnrollments.map(e => e.courseId);

        const quizzes = await Quiz.find({
            courseId: { $in: enrolledCourseIds },
            isPublished: true
        }).sort({ createdAt: -1 });

        return {
            success: true,
            quizzes: JSON.parse(JSON.stringify(quizzes))
        };
    } catch (error) {
        console.error("Get Quizzes Error:", error);
        return { success: false, error: "Failed to load quizzes" };
    }
}

export async function getQuiz(quizId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const quiz = await Quiz.findById(quizId).populate("questions").lean();
        if (!quiz) return { success: false, error: "Quiz not found" };

        const questionsList = (quiz.questions as any[]).map((q: any) => ({
            _id: q._id,
            content: q.content,
            options: q.options?.map((opt: any) => ({ _id: opt._id, text: opt.text })), // Hide isCorrect
            marks: q.marks,
            type: q.type
        }));

        return {
            success: true,
            quiz: { ...JSON.parse(JSON.stringify(quiz)), questions: questionsList }
        };
    } catch (error) {
        console.error("Get Quiz Error:", error);
        return { success: false, error: "Failed to load quiz" };
    }
}

export async function submitQuiz(quizId: string, answers: Record<string, string>, timeTaken: number) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!quiz) return { success: false, error: "Quiz not found" };

        let score = 0;
        const totalMarks = quiz.settings?.totalMarks || 0;

        const attempt = await Attempt.create({
            studentId: session.user.id,
            quizId: quiz._id,
            status: "SUBMITTED",
            startTime: new Date(Date.now() - timeTaken * 1000),
            endTime: new Date(),
            totalScore: 0,
            totalMarks,
            securityLogs: { tabSwitchCount: 0, violations: [] }
        });

        // Loop questions & save answers
        for (const question of (quiz.questions as any[])) {
            const selectedOptionId = answers[question._id.toString()];
            const isCorrect = question.options?.find((o: any) => o._id.toString() === selectedOptionId)?.isCorrect || false;

            if (isCorrect) {
                score += question.marks || 1;
            }

            await Answer.create({
                attemptId: attempt._id,
                questionId: question._id,
                selectedOptionIds: selectedOptionId ? [selectedOptionId] : [],
                timeTakenSeconds: 0,
                evaluation: {
                    isEvaluated: true,
                    isCorrect,
                    marksAwarded: isCorrect ? (question.marks || 1) : 0
                }
            });
        }

        attempt.totalScore = score;
        attempt.isPassed = score >= (quiz.settings?.passingMarks || 0);
        await attempt.save();

        return {
            success: true,
            attemptId: attempt._id.toString(),
            score,
            totalMarks,
            isPassed: attempt.isPassed
        };

    } catch (error) {
        console.error("Submit Quiz Error:", error);
        return { success: false, error: "Failed to submit quiz" };
    }
}

export async function getQuizAnalysis(attemptId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const attempt = await Attempt.findById(attemptId).populate("quizId").lean();

        if (!attempt) return { success: false, error: "Attempt not found" };
        if (attempt.studentId.toString() !== session.user.id) return { success: false, error: "Unauthorized" };

        return {
            success: true,
            attempt: JSON.parse(JSON.stringify(attempt))
        };
    } catch (error) {
        console.error("Get Analysis Error:", error);
        return { success: false, error: "Failed to load analysis" };
    }
}
