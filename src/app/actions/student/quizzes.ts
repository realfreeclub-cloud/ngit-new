"use server";

import connectDB from "@/lib/db";
import Quiz from "@/models/Quiz";
import Attempt from "@/models/Attempt";
import Answer from "@/models/Answer";
import User, { UserRole } from "@/models/User";
import Enrollment from "@/models/Enrollment";
import PaidTestRequest, { RequestStatus } from "@/models/PaidTestRequest";
import { z } from "zod";
import { createSafeAction } from "@/lib/safe-action";
import { RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

const QuizIdSchema = z.object({
    quizId: z.string().min(1)
});

export const getAvailableQuizzes = createSafeAction(
    { requireAuth: true, roles: [UserRole.STUDENT, UserRole.ADMIN] },
    async (_, session) => {
        await connectDB();
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

        return JSON.parse(JSON.stringify(quizzesWithAccess));
    }
);

export const getQuiz = createSafeAction(
    { schema: QuizIdSchema, requireAuth: true, roles: [UserRole.STUDENT, UserRole.ADMIN] },
    async ({ quizId }, session) => {
        await connectDB();
        const quiz = await Quiz.findById(quizId).populate("questions").lean();
        if (!quiz) throw new Error("Assessment not found in our records.");

        // 2. Pricing/Access Check for Mock Tests
        if (quiz.isMockTest) {
            if (quiz.pricing?.type === "PAID") {
                const request = await PaidTestRequest.findOne({ 
                    studentId: session.user.id, 
                    mockTestId: quizId,
                    status: RequestStatus.APPROVED 
                });
                if (!request) {
                    throw new Error("ACCESS_DENIED: This is a premium mock test. Access must be approved by admin after payment.");
                }
            }
        } else {
            // 3. Enrollment Check for Course-specific Quizzes
            const enrollment = await Enrollment.findOne({
                userId: session.user.id,
                courseId: quiz.courseId,
                isActive: true
            });
            if (!enrollment) {
                throw new Error("ENROLLMENT_REQUIRED: This assessment is part of a course you are not enrolled in.");
            }
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

        return { ...JSON.parse(JSON.stringify(quiz)), questions: questionsList };
    }
);

const SubmitQuizSchema = z.object({
    quizId: z.string().min(1),
    answers: z.record(z.any()),
    timeTaken: z.number().min(0)
});

export const submitQuiz = createSafeAction(
    { schema: SubmitQuizSchema, requireAuth: true, roles: [UserRole.STUDENT, UserRole.ADMIN], rateLimit: RATE_LIMIT_CONFIGS.SENSITIVE },
    async ({ quizId, answers, timeTaken }, session) => {
        await connectDB();
        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!quiz) throw new Error("Quiz not found");

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
            if (!question) continue;
            const userAnswer = answers[question._id?.toString()];
            let isCorrect = false;
            let marksAwarded = 0;

            if (userAnswer === undefined || userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
                unattemptedCount++;
            } else {
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
                timeTakenSeconds: 0,
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
            attemptId: attempt._id.toString(),
            score,
            totalMarks,
            metrics: { correctCount, incorrectCount, unattemptedCount },
            isPassed: attempt.isPassed
        };
    }
);

const AttemptIdSchema = z.object({
    attemptId: z.string().min(1)
});

export const getQuizAnalysis = createSafeAction(
    { schema: AttemptIdSchema, requireAuth: true, roles: [UserRole.STUDENT, UserRole.ADMIN] },
    async ({ attemptId }, session) => {
        await connectDB();
        const attempt = await Attempt.findById(attemptId).populate("quizId").lean();

        if (!attempt) throw new Error("Attempt not found");
        if (attempt.studentId.toString() !== session.user.id && session.user.role !== UserRole.ADMIN) {
             throw new Error("Unauthorized access to result analysis");
        }

        return JSON.parse(JSON.stringify(attempt));
    }
);
