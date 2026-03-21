"use server";

import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import Question from "@/models/Question";
import Attempt from "@/models/Attempt";
import Answer from "@/models/Answer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Enrollment from "@/models/Enrollment";

import PaidTestRequest, { RequestStatus } from "@/models/PaidTestRequest";

export async function getAvailableQuizzes() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const activeEnrollments = await Enrollment.find({ userId: session.user.id, isActive: true }).lean();
        const enrolledCourseIds = activeEnrollments.map(e => e.courseId);

        const [quizzes, requests] = await Promise.all([
            Quiz.find({
                $or: [
                    { courseId: { $in: enrolledCourseIds } },
                    { isMockTest: true }
                ],
                isPublished: true
            }).sort({ createdAt: -1 }),
            PaidTestRequest.find({ studentId: session.user.id }).lean()
        ]);

        const quizzesWithAccess = quizzes.map(quiz => {
            const request = requests.find(r => r.mockTestId.toString() === quiz._id.toString());
            return {
                ...quiz.toObject(),
                accessRequest: request ? { status: request.status } : null
            };
        });

        return {
            success: true,
            quizzes: JSON.parse(JSON.stringify(quizzesWithAccess))
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
        if (!quiz) return { success: false, error: "Assessment not found in our records." };

        // 2. Pricing/Access Check for Mock Tests
        if (quiz.isMockTest) {
            if (quiz.pricing?.type === "PAID") {
                const request = await PaidTestRequest.findOne({ 
                    studentId: session.user.id, 
                    mockTestId: quizId,
                    status: RequestStatus.APPROVED 
                });
                if (!request) return { 
                    success: false, 
                    error: "ACCESS_DENIED", 
                    message: "This is a premium mock test. Access must be approved by admin after payment."
                };
            }
        } else {
            // 3. Enrollment Check for Course-specific Quizzes
            const enrollment = await Enrollment.findOne({
                userId: session.user.id,
                courseId: quiz.courseId,
                isActive: true
            });
            if (!enrollment) return {
                success: false,
                error: "ENROLLMENT_REQUIRED",
                message: "This assessment is part of a course you are not enrolled in."
            };
        }

        const questionsList = (quiz.questions as any[]).map((q: any) => {
            if (!q) return null;
            return {
                _id: q._id ? q._id.toString() : null,
                content: q.content,
                options: q.options?.map((opt: any) => ({ 
                    _id: opt._id ? opt._id.toString() : null, 
                    text: opt.text, 
                    pair: opt.pair 
                })), // Hide isCorrect
                marks: q.marks,
                type: q.type,
                assertion: q.assertion,
                reason: q.reason
            };
        }).filter(Boolean);

        return {
            success: true,
            quiz: { ...JSON.parse(JSON.stringify(quiz)), questions: questionsList }
        };
    } catch (error: any) {
        console.error("Get Quiz Error:", error);
        return { success: false, error: "Failed to load quiz", message: String(error.message || error) };
    }
}

export async function submitQuiz(quizId: string, answers: Record<string, any>, timeTaken: number) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");

        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!quiz) return { success: false, error: "Quiz not found" };

        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;
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

        for (const question of (quiz.questions as any[])) {
            if (!question) continue; // Skip missing/unpopulated questions
            const userAnswer = answers[question._id?.toString()];
            let isCorrect = false;
            let marksAwarded = 0;

            if (userAnswer === undefined || userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
                unattemptedCount++;
            } else {
                // Evaluation logic based on type
                if (question.type === "MCQ_SINGLE") {
                    const correctOption = question.options.find((o: any) => o.isCorrect);
                    isCorrect = correctOption?._id.toString() === userAnswer;
                } else if (question.type === "MCQ_MULTIPLE") {
                    const correctIds = question.options.filter((o: any) => o.isCorrect).map((o: any) => o._id.toString());
                    isCorrect = Array.isArray(userAnswer) && 
                                userAnswer.length === correctIds.length && 
                                userAnswer.every(id => correctIds.includes(id));
                } else if (question.type === "NUMERIC") {
                    isCorrect = parseFloat(userAnswer) === question.numericAnswer;
                } else if (question.type === "TRUE_FALSE") {
                    isCorrect = userAnswer === (question.options?.[0]?.isCorrect ? "true" : "false");
                } else if (question.type === "ASSERTION_REASON") {
                    // Assuming numericAnswer for A-R matches option index 0-3
                    isCorrect = parseInt(userAnswer) === question.numericAnswer;
                }

                if (isCorrect) {
                    marksAwarded = question.marks || 4;
                    score += marksAwarded;
                    correctCount++;
                } else {
                    marksAwarded = -(question.negativeMarks || 1);
                    score += marksAwarded;
                    incorrectCount++;
                }
            }

            await Answer.create({
                attemptId: attempt._id,
                questionId: question._id,
                selectedOptionIds: Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []),
                numericAnswer: question.type === "NUMERIC" ? userAnswer : undefined,
                timeTakenSeconds: 0, // Could be tracked per Q in future
                evaluation: {
                    isEvaluated: true,
                    isCorrect,
                    marksAwarded
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
            metrics: { correctCount, incorrectCount, unattemptedCount },
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
