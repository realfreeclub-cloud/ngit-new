"use server";

import connectDB from "@/lib/db";
import User, { UserRole } from "@/models/User";
import StudentProfile from "@/models/StudentProfile";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function registerStudent(formData: {
    // Step 1 – Personal Info
    name: string;
    dateOfBirth: string;
    fatherName: string;
    motherName: string;
    aadharNo: string;
    category: string;
    // Step 2 – Contact
    localAddress: string;
    localPhone: string;
    email: string;
    permanentAddress: string;
    permanentPhone: string;
    // Step 3 – Academic
    course: string;
    // Step 4 – Account
    password: string;
    photoUrl?: string;
}) {
    try {
        await connectDB();

        // Check if email already exists
        const existing = await User.findOne({ email: formData.email });
        if (existing) {
            return { success: false, error: "An account with this email already exists." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(formData.password, 12);

        // Create user account (inactive until admin approves)
        const user = await User.create({
            name: formData.name,
            email: formData.email,
            password: hashedPassword,
            role: UserRole.STUDENT,
            isActive: false, // pending admin approval
        });

        // Save full student profile
        await StudentProfile.create({
            userId: user._id,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            aadharNo: formData.aadharNo,
            category: formData.category,
            localAddress: formData.localAddress,
            localPhone: formData.localPhone,
            permanentAddress: formData.permanentAddress,
            permanentPhone: formData.permanentPhone,
            course: formData.course,
            photoUrl: formData.photoUrl || "",
            status: "Pending",
        });

        revalidatePath("/admin/students");

        return { success: true, userId: user._id.toString() };
    } catch (error: any) {
        console.error("Registration Error:", error);
        return { success: false, error: error.message || "Registration failed. Please try again." };
    }
}

export async function getStudentRegistrations() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const profiles = await StudentProfile.find({})
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, students: JSON.parse(JSON.stringify(profiles)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function approveStudent(profileId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const profile = await StudentProfile.findByIdAndUpdate(
            profileId,
            { status: "Approved" },
            { new: true }
        );

        if (!profile) return { success: false, error: "Profile not found" };

        // Activate the user account so they can login
        await User.findByIdAndUpdate(profile.userId, { isActive: true });

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function rejectStudent(profileId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const profile = await StudentProfile.findByIdAndDelete(profileId);
        if (!profile) return { success: false, error: "Profile not found" };

        // Also delete the user account
        await User.findByIdAndDelete(profile.userId);

        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
