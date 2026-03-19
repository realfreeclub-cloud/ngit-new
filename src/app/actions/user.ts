"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateUserDetails(data: { name?: string; image?: string }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const userId = session.user.id;
        const updated = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true }
        );

        if (!updated) return { success: false, error: "User not found" };

        revalidatePath("/", "layout");
        return { 
            success: true, 
            user: { 
                name: updated.name, 
                image: updated.image 
            } 
        };
    } catch (error: any) {
        console.error("Update User Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateUserPassword(data: { current: string; new: string }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const user = await User.findById(session.user.id);
        if (!user || !user.password) return { success: false, error: "User not found or password login not enabled" };

        const isMatch = await bcrypt.compare(data.current, user.password);
        if (!isMatch) return { success: false, error: "Current password does not match" };

        const hashed = await bcrypt.hash(data.new, 10);
        user.password = hashed;
        await user.save();

        return { success: true };
    } catch (error: any) {
        console.error("Update Password Error:", error);
        return { success: false, error: error.message };
    }
}
