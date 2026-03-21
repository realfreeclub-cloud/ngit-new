"use server";

import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Payment, { PaymentStatus } from "@/models/Payment";
import Enrollment from "@/models/Enrollment";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/services/RazorpayService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import mongoose from "mongoose";

export async function initiatePayment(courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new Error("Unauthorized");
        }

        let course;
        if (mongoose.Types.ObjectId.isValid(courseId)) {
            course = await Course.findById(courseId);
        } else {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) {
            return { success: false, error: "Course not found. Check identifier." };
        }

        // Calculate pending balance instead of blindly tracking existing enrollment
        const successfulPayments = await Payment.find({
            userId: session.user.id,
            courseId: course._id,
            status: PaymentStatus.SUCCESS
        });

        const totalPaid = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
        const balance = course.price - totalPaid;

        if (balance <= 0) {
            // Check if enrollment already exists
            const existing = await Enrollment.findOne({ userId: session.user.id, courseId: course._id });
            if (!existing) {
                await Enrollment.create({
                    userId: session.user.id,
                    courseId: course._id,
                    enrolledAt: new Date(),
                    progress: 0,
                    isActive: true
                });
                revalidatePath("/student", "layout");
                revalidatePath("/", "layout");
                return { success: true, instant: true };
            }
            return { success: false, error: "Course is already in your dashboard" };
        }

        // Create Razorpay Order with specific balance mapping
        const order = await createRazorpayOrder(balance);

        // Save Intention in DB
        await Payment.create({
            userId: session.user.id,
            courseId: course._id,
            amount: balance,
            razorpayOrderId: order.id,
            status: PaymentStatus.PENDING,
        });

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            courseTitle: course.title,
            userName: session.user.name,
            userEmail: session.user.email,
        };
    } catch (error: any) {
        console.error("Initiate Payment Error:", error);
        return { success: false, error: error.message };
    }
}

export async function verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
) {
    try {
        await connectDB();

        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            throw new Error("Invalid signature");
        }

        // Update Payment Status
        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId },
            {
                razorpayPaymentId,
                razorpaySignature,
                status: PaymentStatus.SUCCESS,
            },
            { new: true }
        );

        if (!payment) {
            throw new Error("Payment record not found");
        }

        // Check/Create Enrollment (Idempotency)
        const existingEnrollment = await Enrollment.findOne({
            userId: payment.userId,
            courseId: payment.courseId
        });

        if (!existingEnrollment) {
            await Enrollment.create({
                userId: payment.userId,
                courseId: payment.courseId,
                enrolledAt: new Date(),
                progress: 0,
                isActive: true
            });
        }

        // Notify user
        await createNotification(
            payment.userId.toString(),
            "Payment Successful!",
            `You have successfully enrolled in the course. Start learning now!`,
            "SUCCESS",
            `/student/courses/${payment.courseId}`
        );

        revalidatePath("/student");
        return { success: true };
    } catch (error: any) {
        console.error("Verify Payment Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getMyFees() {
    try {
        await connectDB();
        // Force model registration
        await import("@/models/Course");
        await import("@/models/User");
        await import("@/models/Lesson");

        const session = await getServerSession(authOptions);
        if (!session || !session.user) throw new Error("Unauthorized");

        const userId = session.user.id;

        const enrollments = await Enrollment.find({ userId })
            .populate("courseId", "title price category")
            .lean();

        const payments = await Payment.find({ userId })
            .populate("courseId", "title price")
            .lean();

        return {
            success: true,
            user: { name: session.user.name, email: session.user.email },
            enrollments: JSON.parse(JSON.stringify(enrollments)),
            payments: JSON.parse(JSON.stringify(payments))
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
