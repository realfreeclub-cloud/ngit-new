"use client";

import { useEffect, useState } from "react";
import { getEnrolledCourses } from "@/app/actions/student/courses";
import { PlayCircle, Clock, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getEnrolledCourses();
            if (res.success) {
                setCourses(res.enrollments);
            } else {
                toast.error(res.error || "Failed to load courses");
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <BookOpen className="w-16 h-16 text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-900">No Active Courses</h2>
                <p className="text-slate-500 max-w-md">
                    You haven't enrolled in any courses yet. Explore our catalog to start learning.
                </p>
                <Link href="/courses">
                    <Button className="mt-4">Browse Courses</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900">My Courses</h1>
                <p className="text-slate-500 mt-2">Continue where you left off</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((enrollment) => (
                    <div
                        key={enrollment._id}
                        className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all overflow-hidden flex flex-col"
                    >
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                            {enrollment.courseId?.thumbnail ? (
                                <img
                                    src={enrollment.courseId.thumbnail}
                                    alt={enrollment.courseId.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                    <BookOpen className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                                <Link href={`/student/courses/${enrollment.courseId?._id}`}>
                                    <Button className="rounded-full w-14 h-14 bg-white text-primary hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                                        <PlayCircle className="w-6 h-6 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>{enrollment.courseId?.category || "General"}</span>
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Active</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {enrollment.courseId?.title || "Untitled Course"}
                            </h3>

                            <div className="mt-auto space-y-4 pt-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                        <span>Progress</span>
                                        <span>{enrollment.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${enrollment.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <Link href={`/student/courses/${enrollment.courseId?._id}`} className="block">
                                    <Button variant="outline" className="w-full rounded-xl font-bold border-2 hover:bg-slate-50 hover:text-primary hover:border-primary/20">
                                        Continue Learning
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
