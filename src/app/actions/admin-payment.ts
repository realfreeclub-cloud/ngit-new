"use server";

import connectDB from "@/lib/db";
import Payment, { PaymentStatus } from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAdminFeeData() {
    try {
        await connectDB();
        // Force model registration
        await import("@/models/Course");
        await import("@/models/User");
        await import("@/models/Lesson");

        // Find all users who are Students
        const students = await User.find({ role: "STUDENT" })
            .select("name email phone createdAt")
            .lean();

        // Get all enrollments for students
        const studentIds = students.map((s: any) => s._id);
        const enrollments = await Enrollment.find({ userId: { $in: studentIds } })
            .populate("courseId", "title price category")
            .lean();

        // Get all successful/pending payments
        const payments = await Payment.find({ userId: { $in: studentIds } })
            .populate("courseId", "title price")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            students: JSON.parse(JSON.stringify(students)),
            enrollments: JSON.parse(JSON.stringify(enrollments)),
            payments: JSON.parse(JSON.stringify(payments))
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addManualPayment(userId: string, courseId: string, amount: number) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        // Create a manual payment record
        const payment = await Payment.create({
            userId,
            courseId,
            amount,
            status: PaymentStatus.SUCCESS,
            razorpayOrderId: `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        });

        // Ensure enrollment exists
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (!existingEnrollment) {
            await Enrollment.create({
                userId,
                courseId,
                enrolledAt: new Date(),
                progress: 0,
                isActive: true
            });
        }

        revalidatePath("/admin/players");
        revalidatePath("/admin/students/fees");
        return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function assignCourseOffline(studentId: string, courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        const existingEnrollment = await Enrollment.findOne({ userId: studentId, courseId });
        if (existingEnrollment) {
            return { success: false, error: "Student is already enrolled in this course." };
        }

        // Create enrollment directly (unpaid / offline managed)
        const enrollment = await Enrollment.create({
            userId: studentId,
            courseId,
            enrolledAt: new Date(),
            progress: 0,
            isActive: true
        });

        // Also create a pending/dummy offline payment record so it shows up in fee structures
        await Payment.create({
            userId: studentId,
            courseId,
            amount: 0, // Admin can set offline amount later or we mark it here
            status: PaymentStatus.PENDING,
            razorpayOrderId: `offline_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        });

        revalidatePath("/admin/students/enrollments");
        revalidatePath("/admin/students/fees");

        return { success: true, enrollment: JSON.parse(JSON.stringify(enrollment)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getGlobalPaymentsData() {
    try {
        await connectDB();
        await import("@/models/Course");
        await import("@/models/User");

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        const allPayments = await Payment.find({})
            .populate("userId", "name email")
            .populate("courseId", "title price")
            .sort({ createdAt: -1 })
            .lean();

        let totalRevenue = 0;
        let pendingCount = 0;
        let failedCount = 0;

        const formattedPayments = allPayments.map((p: any) => {
            if (p.status === "SUCCESS") {
                totalRevenue += p.amount;
            } else if (p.status === "PENDING") {
                pendingCount++;
            } else if (p.status === "FAILED") {
                failedCount++;
            }

            return {
                id: p.razorpayOrderId ?? p._id.toString(),
                student: p.userId ? p.userId.name : "Unknown Student",
                course: p.courseId ? p.courseId.title : "Unknown Course",
                amount: p.amount,
                status: p.status,
                date: new Date(p.createdAt).toLocaleString(),
            };
        });

        return {
            success: true,
            totalRevenue,
            pendingCount,
            failedCount,
            payments: JSON.parse(JSON.stringify(formattedPayments))
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
