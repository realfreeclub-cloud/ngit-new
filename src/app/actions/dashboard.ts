"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Payment, { PaymentStatus } from "@/models/Payment";
import Attempt from "@/models/Attempt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        // Let's pretend some placeholder growth for wow factor in the UI
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

        const stats = {
            avgProgress: 0,
            activeCourses: 0,
            attendancePercentage: 0,
            testsCompleted: 0,
            avgGrade: "A"
        };

        return {
            success: true,
            stats,
            enrollments: [],
            userName: session.user.name,
            userId: session.user.id,
            progressTrend: []
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
