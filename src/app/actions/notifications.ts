"use server";

import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMyNotifications() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const notifications = await Notification.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return { success: true, notifications: JSON.parse(JSON.stringify(notifications)) };
    } catch (error) {
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await connectDB();
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function createNotification(userId: string, title: string, message: string, type: string = "INFO", link?: string) {
    try {
        await connectDB();
        await Notification.create({
            userId,
            title,
            message,
            type,
            link
        });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
