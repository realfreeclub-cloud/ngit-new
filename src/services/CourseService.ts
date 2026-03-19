"use server";

import connectDB from "@/lib/db";
import Course from "@/models/Course";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CourseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().min(0),
    category: z.string(),
    type: z.enum(["ONLINE", "OFFLINE"]).optional().default("ONLINE"),
    thumbnail: z.string().url(),
});

export async function createCourse(data: z.infer<typeof CourseSchema>) {
    try {
        await connectDB();

        const slug = data.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

        const course = await Course.create({
            ...data,
            slug,
        });

        revalidatePath("/admin/courses");
        return { success: true, course: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCourses(page: number = 1, limit: number = 20) {
    try {
        await connectDB();
        
        const skip = (page - 1) * limit;
        
        const courses = await Course.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title description price category thumbnail isPublished level instructor duration lessonCount enrollmentCount')
            .lean();
            
        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        return [];
    }
}
