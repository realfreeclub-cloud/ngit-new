"use server";

import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Enrollment from "@/models/Enrollment";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// --- STUDENT ACTIONS ---

export async function getCourseDetails(courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return { success: false, error: "Invalid Course ID" };
        }

        const course = await Course.findById(courseId).lean();
        if (!course) return { success: false, error: "Course not found" };

        // Fetch Lessons ordered
        const lessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean();

        // Fetch Enrollment Status
        const enrollment = await Enrollment.findOne({
            userId: session.user.id,
            courseId
        }).populate({ path: "lastWatchedLessonId", model: Lesson }).lean();

        // Extract completed lesson IDs as plain strings for easy comparison
        const completedLessonIds: string[] = (enrollment?.completedLessons ?? []).map(
            (id: any) => id.toString()
        );

        return {
            success: true,
            course: JSON.parse(JSON.stringify(course)),
            lessons: JSON.parse(JSON.stringify(lessons)),
            enrollment: JSON.parse(JSON.stringify(enrollment)),
            completedLessonIds,
            userId: session.user.id
        };
    } catch (error) {
        console.error("Get Course Details Error:", error);
        return { success: false, error: "Failed to load course details" };
    }
}

export async function getLesson(lessonId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const lesson = await Lesson.findById(lessonId).lean();
        if (!lesson) return { success: false, error: "Lesson not found" };

        return {
            success: true,
            lesson: JSON.parse(JSON.stringify(lesson)),
        };
    } catch (error) {
        console.error("Get Lesson Error:", error);
        return { success: false, error: "Failed to load lesson" };
    }
}

// --- ADMIN ACTIONS ---

export async function createCourse(data: any) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const course = await Course.create(data);
        revalidatePath("/admin/courses");
        revalidatePath("/", "layout");
        return { success: true, courseId: course._id.toString() };
    } catch (error: any) {
        console.error("Create Course Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await Course.findByIdAndDelete(courseId);
        await Lesson.deleteMany({ courseId }); // Delete associated lessons

        revalidatePath("/admin/courses");
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createLesson(courseId: string, data: any) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const lastLesson = await Lesson.findOne({ courseId }).sort({ order: -1 });
        const order = lastLesson ? lastLesson.order + 1 : 1;

        const lessonData: any = {
            courseId,
            title: data.title,
            description: data.description ?? "",
            type: data.type,
            isFree: data.isFree ?? false,
            duration: data.duration ?? "",
            order,
        };

        // VIDEO / PDF: store the URL
        if (data.type !== "QUIZ") {
            lessonData.contentUrl = data.contentUrl ?? "";
        }
        // QUIZ: store quizId reference (clear contentUrl)
        if (data.type === "QUIZ" && data.quizId) {
            lessonData.quizId = new mongoose.Types.ObjectId(data.quizId);
        }

        const lesson = await Lesson.create(lessonData);
        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, lesson: JSON.parse(JSON.stringify(lesson)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/** Fetch all published quizzes for a course — used in the admin lesson modal quiz dropdown */
export async function getQuizzesForCourse(courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const quizzes = await Quiz.find({ 
            courseId,
            isMockTest: { $ne: true }
        })
            .select("_id title settings isPublished")
            .sort({ createdAt: -1 })
            .lean();

        const flatQuizzes = quizzes.map(q => ({
            _id: q._id,
            title: q.title,
            timeLimit: q.settings?.timeLimit || 30,
            totalMarks: q.settings?.totalMarks || 10,
            passingMarks: q.settings?.passingMarks || 4,
            isPublished: q.isPublished
        }));

        return { success: true, quizzes: JSON.parse(JSON.stringify(flatQuizzes)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createCourseQuiz(courseId: string, data: any) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const quiz = await Quiz.create({
            title: data.title,
            courseId,
            isMockTest: false,
            isPublished: data.isPublished ?? true,
            settings: data.settings || {
                timeLimit: 30,
                totalMarks: 0,
                passingMarks: 0,
                shuffleQuestions: true,
                shuffleOptions: true,
                availableLanguages: ["en"]
            },
            questions: data.questions || [],
            instructions: data.instructions || { en: "Course Assessment" }
        });

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true, quizId: quiz._id.toString() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLesson(lessonId: string, courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await Lesson.findByIdAndDelete(lessonId);
        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getCourseForAdmin(courseId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return { success: false, error: "Invalid Course ID" };
        }

        const course = await Course.findById(courseId).lean();
        if (!course) return { success: false, error: "Course not found" };

        const lessons = await Lesson.find({ courseId }).sort({ order: 1 }).lean();

        // Real enrollment count
        const enrollmentCount = await Enrollment.countDocuments({ courseId });

        return {
            success: true,
            course: JSON.parse(JSON.stringify(course)),
            lessons: JSON.parse(JSON.stringify(lessons)),
            enrollmentCount,
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch course details" };
    }
}

export async function updateCourse(courseId: string, data: Partial<{
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    syllabusUrl: string;
    duration: string;
    isPublished: boolean;
}>) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const updated = await Course.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        ).lean();

        revalidatePath(`/admin/courses/${courseId}`);
        revalidatePath("/admin/courses");
        revalidatePath("/", "layout");
        return { success: true, course: JSON.parse(JSON.stringify(updated)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function togglePublish(courseId: string, isPublished: boolean) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        await Course.findByIdAndUpdate(courseId, { $set: { isPublished } });
        revalidatePath(`/admin/courses/${courseId}`);
        revalidatePath("/admin/courses");
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateLesson(lessonId: string, courseId: string, data: any) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const update: any = {
            title: data.title,
            description: data.description ?? "",
            type: data.type,
            isFree: data.isFree ?? false,
            duration: data.duration ?? "",
        };

        if (data.type === "QUIZ") {
            // QUIZ type: store linked quizId, clear contentUrl
            update.quizId = data.quizId ? new mongoose.Types.ObjectId(data.quizId) : null;
            update.contentUrl = "";
        } else {
            // VIDEO / PDF: store URL, clear quizId
            update.contentUrl = data.contentUrl ?? "";
            update.quizId = null;
        }

        await Lesson.findByIdAndUpdate(lessonId, { $set: update });
        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function getAllCourses() {
    try {
        await connectDB();
        const courses = await Course.find({}).select("title _id").sort({ title: 1 }).lean();
        return { success: true, courses: JSON.parse(JSON.stringify(courses)) };
    } catch (error) {
        return { success: false, error: "Failed to fetch courses" };
    }
}

export async function getPublicCourses() {
    try {
        await connectDB();
        const courses = await Course.find({ isPublished: true })
            .sort({ createdAt: -1 })
        return { success: true, courses: JSON.parse(JSON.stringify(courses)) };
    } catch (error) {
        return { success: false, courses: [] };
    }
}

export async function getPublicCourse(identifier: string) {
    try {
        await connectDB();
        
        let course;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            course = await Course.findById(identifier).populate("instructorIds", "name image").lean();
        } else {
            course = await Course.findOne({ slug: identifier, isPublished: true }).populate("instructorIds", "name image").lean();
        }

        if (!course) return { success: false, error: "Course not found" };

        const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).select("title type duration isFree").lean();

        return { 
            success: true, 
            course: JSON.parse(JSON.stringify(course)),
            lessons: JSON.parse(JSON.stringify(lessons))
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch course" };
    }
}
