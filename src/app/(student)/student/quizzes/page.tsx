"use client";

import { useEffect, useState } from "react";
import { getAvailableQuizzes } from "@/app/actions/student/quizzes";
import { Trophy, Clock, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StudentQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
            <div className="text-center py-20 px-4">
                <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No Tests Available</h3>
                <p className="text-slate-500 mt-2">Check back later for scheduled tests.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Mock Tests</h1>
                <p className="text-slate-500 mt-2">Evaluate your knowledge and improve your scores</p>
            </div>

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
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
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
        </div>
    );
}
