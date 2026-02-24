"use server";

import connectDB from "@/lib/db";
import Attempt from "@/models/Attempt";
import Quiz from "@/models/Quiz";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Attendance from "@/models/Attendance";
import { AttendanceStatus } from "@/types/attendance";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getStudentResults() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;

        // All quiz attempts by student, populated with quiz info
        const attempts = await Attempt.find({ studentId: userId })
            .populate({ path: "quizId", model: Quiz, populate: { path: "courseId", model: Course } })
            .sort({ endTime: -1 })
            .lean();

        // All enrollments for course-level data
        const enrollments = await Enrollment.find({ userId })
            .populate({ path: "courseId", model: Course })
            .lean();

        // Attendance summary
        const attendanceRecords = await Attendance.find({ studentId: userId }).lean();
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(
            (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LATE
        ).length;
        const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

        // Aggregate stats
        const totalAttempts = attempts.length;
        const passedAttempts = attempts.filter((a) => a.isPassed).length;
        const avgScore =
            totalAttempts > 0
                ? Math.round(
                    attempts.reduce((acc, a) => acc + (a.totalScore / a.totalMarks) * 100, 0) / totalAttempts
                )
                : 0;

        // Best score per quiz
        const quizBestMap = new Map<string, number>();
        for (const a of attempts) {
            const qid = (a.quizId as any)?._id?.toString();
            if (!qid) continue;
            const pct = Math.round((a.totalScore / a.totalMarks) * 100);
            if (!quizBestMap.has(qid) || pct > (quizBestMap.get(qid) as number)) {
                quizBestMap.set(qid, pct);
            }
        }

        return {
            success: true,
            attempts: JSON.parse(JSON.stringify(attempts)),
            enrollments: JSON.parse(JSON.stringify(enrollments)),
            stats: {
                totalAttempts,
                passedAttempts,
                avgScore,
                attendancePercentage,
                activeCourses: enrollments.length,
                avgProgress:
                    enrollments.length > 0
                        ? Math.round(
                            enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) /
                            enrollments.length
                        )
                        : 0,
            },
        };
    } catch (error) {
        console.error("Get Student Results Error:", error);
        return { success: false, error: "Failed to load results" };
    }
}
