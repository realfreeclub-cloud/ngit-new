"use server";

import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { revalidatePath } from "next/cache";

export async function createEvent(data: any) {
    try {
        await connectDB();

        const event = await Event.create({
            ...data,
            date: new Date(data.date),
        });

        revalidatePath("/admin/events");
        revalidatePath("/", "layout");
        return { success: true, event: JSON.parse(JSON.stringify(event)) };
    } catch (error: any) {
        console.error("Create Event Error:", error);
        return { success: false, error: error.message || "Failed to create event" };
    }
}

export async function deleteEvent(id: string) {
    try {
        await connectDB();
        await Event.findByIdAndDelete(id);
        revalidatePath("/admin/events");
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete event" };
    }
}

export async function getEvents() {
    try {
        await connectDB();
        const events = await Event.find().sort({ date: 1 }).lean();
        return { success: true, events: JSON.parse(JSON.stringify(events)) };
    } catch (error) {
        return { success: false, error: "Failed to fetch events" };
    }
}
