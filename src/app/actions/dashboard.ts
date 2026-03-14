"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Payment, { PaymentStatus } from "@/models/Payment";
import Attempt from "@/models/Attempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";

export async function getDashboardStats() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const [totalStudents, activeCourses, payments, attempts, recentStudents] = await Promise.all([
            User.countDocuments({ role: "STUDENT" }),
            Course.countDocuments({ isPublished: true }),
            Payment.find({ status: PaymentStatus.SUCCESS }).lean(),
            Attempt.find()
                .populate({ path: "studentId", select: "name email" })
                .populate({ path: "quizId", select: "title" })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            User.find({ role: "STUDENT" })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name email createdAt")
                .lean()
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const stats = {
            totalStudents,
            activeCourses,
            totalRevenue,
            pendingApprovals: 0,
            recentAttempts: JSON.parse(JSON.stringify(attempts)),
            recentStudents: JSON.parse(JSON.stringify(recentStudents))
        };

        return { success: true, stats };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getStudentDashboardData() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;

        const [enrollments, attempts, attendance] = await Promise.all([
            Enrollment.find({ userId }).populate({ path: "courseId", select: "title thumbnail" }).lean(),
            Attempt.find({ studentId: userId }).lean(),
            Attendance.find({ studentId: userId }).lean()
        ]);

        const activeCourses = enrollments.length;
        const avgProgress = activeCourses > 0 
            ? Math.round(enrollments.reduce((acc, e: any) => acc + (e.progress || 0), 0) / activeCourses)
            : 0;

        const attendancePercentage = attendance.length > 0
            ? Math.round((attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length / attendance.length) * 100)
            : 0;

        const testsCompleted = attempts.length;

        const stats = {
            avgProgress,
            activeCourses,
            attendancePercentage,
            testsCompleted,
            avgGrade: "A" // Placeholder if no grading logic yet
        };

        return {
            success: true,
            stats,
            enrollments: JSON.parse(JSON.stringify(enrollments)),
            userName: session.user.name,
            userId: session.user.id,
            progressTrend: [65, 72, 68, 85, 90, 88, 92] // Placeholder for chart until more data exists
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
