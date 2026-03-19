"use client";

import { useEffect, useState } from "react";
import {
    PlayCircle,
    BookOpen,
    Trophy,
    Clock,
    ChevronRight,
    ArrowUpRight,
    CheckCircle2,
    QrCode,
    TrendingUp,
    CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentDashboardData } from "@/app/actions/dashboard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StudentQRModal from "@/components/student/StudentQRModal";
import PerformanceChart from "@/components/student/PerformanceChart";

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qrOpen, setQrOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const res = await getStudentDashboardData();
            if (res.success) {
                setData(res);
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) {
        return <div className="p-8 animate-pulse text-slate-400 font-medium">Loading your genius portal...</div>;
    }

    const {
        stats,
        enrollments,
        userName,
        userId,
        progressTrend
    } = data || {
        stats: { avgProgress: 0, activeCourses: 0, attendancePercentage: 0, testsCompleted: 0, avgGrade: '-' },
        enrollments: [],
        userName: 'Student',
        userId: '',
        progressTrend: []
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Welcome back, {userName?.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 mt-2 font-medium">You have <span className="text-primary font-bold">{stats.activeCourses} active courses</span> in your learning path.</p>
                </div>
                <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 border-2 border-white shadow-sm" />
                    ))}
                    <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-primary text-white text-[10px] font-black border-2 border-white">
                        +12
                    </div>
                </div>
            </header>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { label: "Overall Progress", val: `${stats.avgProgress}%`, icon: CheckCircle2, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Attendance", val: `${stats.attendancePercentage}%`, icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Active Courses", val: stats.activeCourses.toString(), icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Tests Passed", val: stats.testsCompleted.toString(), icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
                    </div>
                ))}

                {/* QR Code Quick Action */}
                <button
                    onClick={() => setQrOpen(true)}
                    className="bg-slate-900 p-6 rounded-[2rem] border border-slate-900 shadow-xl hover:scale-105 transition-transform group text-left relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/40 transition-colors" />
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4 text-white relative z-10">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 relative z-10">Digital Identity</p>
                    <p className="text-xl font-black text-white mt-1 relative z-10 flex items-center gap-2">
                        My QR <ChevronRight className="w-4 h-4 text-primary" />
                    </p>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Progress Chart */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Learning Momentum</h2>
                                    <p className="text-xs text-slate-500 font-medium">Your weekly learning engagement score</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {['Week', 'Month', 'Year'].map(t => (
                                    <button key={t} className={cn(
                                        "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                        t === 'Week' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                                    )}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <PerformanceChart data={progressTrend} />
                    </div>

                    {/* Continue Learning */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
                            <Link href="/student/courses">
                                <Button variant="ghost" className="text-primary font-bold gap-2">View All <ChevronRight className="w-4 h-4" /></Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {enrollments.length > 0 ? enrollments.map((en: any) => (
                                <div key={en._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-primary/50 transition-all flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-2xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors" />
                                        <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">{en.courseId.title}</h3>
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-wider">
                                                    Next: {en.lastWatchedLessonId?.title || "Orientation Session"}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase italic">In Progress</span>
                                        </div>
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
                                                <span>Progress</span>
                                                <span>{en.progress}% Complete</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-primary h-full transition-all duration-1000"
                                                    style={{ width: `${en.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Link href={`/student/courses/${en.courseId._id}`}>
                                            <Button className="w-full h-11 rounded-xl mt-4 font-bold gap-2">
                                                Resume Learning <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-slate-50 border-2 border-dashed rounded-[2.5rem] p-12 text-center">
                                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">No active courses</h3>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">Explore our signature programs and start your genius journey today.</p>
                                    <Link href="/courses">
                                        <Button className="mt-6 rounded-xl font-bold">Browse Courses</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <h3 className="text-xl font-bold relative z-10">Upcoming Test</h3>
                        {data?.upcomingQuiz ? (
                            <div className="mt-6 flex flex-col gap-4 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Trophy className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{data.upcomingQuiz.title}</p>
                                        <p className="text-xs text-slate-400">Time Limit: {data.upcomingQuiz.settings?.timeLimit || 0} mins</p>
                                    </div>
                                </div>
                                <Link href="/student/quizzes">
                                    <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold relative z-10">
                                        Start Now
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-6 flex items-center gap-4 relative z-10 opacity-50">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <CalendarCheck className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold">No Tests Pending</p>
                                    <p className="text-xs text-slate-400">Check back later!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary/5 rounded-[2.5rem] p-8 space-y-4">
                        <h3 className="font-bold text-slate-900">Learning Tips</h3>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                        Revise your {i === 1 ? 'Calculus' : 'Physics'} notes before attempting tomorrow's session.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <StudentQRModal
                isOpen={qrOpen}
                onClose={() => setQrOpen(false)}
                studentId={userId}
                studentName={userName}
            />
        </div>
    );
}
