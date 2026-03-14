"use client";

import { useEffect, useState } from "react";
import { getAvailableQuizzes } from "@/app/actions/student/quizzes";
import { Trophy, Clock, Target, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const res = await getAvailableQuizzes();
            if (res.success) {
                setQuizzes(res.quizzes);
            } else {
                toast.error(res.error || "Failed to load tests");
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Exams</h1>
                    <p className="text-slate-500 mt-1 font-medium">Evaluate your knowledge and track your scores</p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <Trophy className="w-16 h-16 text-slate-200 mb-4" />
                    <h2 className="text-xl font-black text-slate-900">No Exams Assigned Yet</h2>
                    <p className="text-slate-500 max-w-sm mt-2 font-medium text-sm">
                        No tests are scheduled for you right now. Check back later or explore available quizzes.
                    </p>
                </div>
                <ExploreExamsBanner />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">My Exams</h1>
                    <p className="text-slate-500 mt-1 font-medium">Evaluate your knowledge and improve your scores</p>
                </div>
                <Link href="/exams">
                    <button className="flex items-center gap-2 border-2 border-amber-400/30 text-amber-600 font-black px-5 py-2.5 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all text-sm">
                        <Sparkles className="w-4 h-4" />
                        Explore More Exams
                    </button>
                </Link>
            </div>

            {/* Quiz cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-1">
                                    {quiz.subject || "General"}
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
                                    {quiz.title}
                                </h3>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                <Trophy className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm font-medium text-slate-500 mb-8">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {quiz.timeLimit} mins
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-slate-400" />
                                {quiz.totalMarks} Marks
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/student/quizzes/${quiz._id}`} className="flex-1">
                                <Button className="w-full h-12 rounded-xl font-bold text-base hover:scale-[1.02] transition-transform">
                                    Start Test
                                </Button>
                            </Link>
                            <Link href={`/student/quizzes/${quiz._id}/analysis`} className="flex-1">
                                <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-base border-2 hover:bg-slate-50 text-slate-500 hover:text-slate-900">
                                    View Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Explore Banner ── */}
            <ExploreExamsBanner />
        </div>
    );
}

function ExploreExamsBanner() {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-8 md:p-10 shadow-2xl shadow-orange-500/25">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-white text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full mb-4 text-xs font-black uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> Exam Catalog
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                        Ready for a New Challenge?
                    </h2>
                    <p className="text-orange-100 font-medium mt-2 max-w-md text-sm md:text-base">
                        Explore publicly available mock tests and practice exams. Sharpen your skills and get exam-ready.
                    </p>
                </div>
                <Link href="/exams" className="shrink-0">
                    <button className="group flex items-center gap-3 bg-white text-orange-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all hover:shadow-2xl text-base whitespace-nowrap">
                        <Trophy className="w-5 h-5" />
                        Explore All Exams
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
