"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/services/CourseService";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Search,
    Filter,
    BookOpen,
    Clock,
    Users,
    Trophy
} from "lucide-react";
import Link from "next/link";

export default function PublicCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // For demo, if empty, show some static ones
            const data = await getCourses();
            setCourses(data.length > 0 ? data : [
                {
                    _id: "1",
                    title: "IIT-JEE Foundation 2026",
                    description: "A comprehensive program designed to build strong foundations in physics, chemistry and mathematics for future IIT aspirants.",
                    price: 19999,
                    category: "Academic",
                    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070",
                    stats: { students: "1.2k", hours: "350+", tests: "45" }
                },
                {
                    _id: "2",
                    title: "NEET Medical Batch",
                    description: "Intensive biology and chemistry training with regular doubt-clearing sessions and mock medical entrance exams.",
                    price: 18500,
                    category: "Medical",
                    thumbnail: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2070",
                    stats: { students: "850", hours: "400+", tests: "50" }
                },
                {
                    _id: "3",
                    title: "Advanced Coding & DSA",
                    description: "Master data structures and algorithms with real-world problems and professional mentor support.",
                    price: 9999,
                    category: "Technical",
                    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
                    stats: { students: "2.1k", hours: "200+", tests: "30" }
                }
            ]);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="pb-32 bg-slate-50/50">
            {/* Hero / Header */}
            <section className="bg-slate-900 text-white py-24 mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -top-1/2 -left-1/4" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <span className="text-primary font-black uppercase tracking-widest text-sm bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            Academic excellence
                        </span>
                        <h1 className="text-6xl font-black leading-tight">Elite Programs for <span className="text-primary">Genius</span> Minds</h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Choose from our meticulously crafted curriculum designed to challenge, inspire, and prepare you for the world's most competitive exams.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-24 relative z-20">
                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 mb-16">
                    <div className="flex-1 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input placeholder="Search for your dream program..." className="w-full h-16 rounded-[1.5rem] bg-slate-50 border-none pl-16 pr-8 font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="lg" className="h-16 rounded-[1.5rem] px-8 border-slate-100 bg-white gap-2 font-bold font-primary">
                            <Filter className="w-5 h-5" /> Category
                        </Button>
                        <Button size="lg" className="h-16 rounded-[1.5rem] px-12 font-bold shadow-lg shadow-primary/20">Search Courses</Button>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-primary text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        {course.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 space-y-6">
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{course.title}</h3>
                                <p className="text-slate-500 leading-relaxed line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex items-center justify-between border-y border-slate-50 py-6">
                                    <div className="flex flex-col items-center">
                                        <Users className="w-5 h-5 text-primary mb-1" />
                                        <p className="text-xs font-black text-slate-900">{course.stats?.students || '450'}+</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Students</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="flex flex-col items-center">
                                        <Clock className="w-5 h-5 text-indigo-500 mb-1" />
                                        <p className="text-xs font-black text-slate-900">{course.stats?.hours || '300'} hrs</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Content</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100" />
                                    <div className="flex flex-col items-center">
                                        <Trophy className="w-5 h-5 text-emerald-500 mb-1" />
                                        <p className="text-xs font-black text-slate-900">{course.stats?.tests || '25'}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mock Tests</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Enrollment Fee</p>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{course.price.toLocaleString()}</p>
                                    </div>
                                    <Link href={`/courses/${course._id}`}>
                                        <Button size="lg" className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/10">
                                            View Syllabus <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Snippet for Courses */}
            <div className="container mx-auto px-4 mt-32">
                <div className="bg-slate-950 rounded-[4rem] p-16 text-center text-white space-y-8 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <h2 className="text-4xl font-black">Confused about which program to pick?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Our educational consultants are ready to help you map out your academic journey. Get a free counseling session today.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="rounded-full px-12 h-14 font-bold">Request Counseling</Button>
                        <Button variant="outline" size="lg" className="rounded-full px-12 h-14 font-bold border-white/20 text-white">Call Us Now</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
