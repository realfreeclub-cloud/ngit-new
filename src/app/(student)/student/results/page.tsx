"use client";

import { useEffect, useState } from "react";
import { getStudentResults } from "@/app/actions/mockTestResults";
import { Clock, Trophy, Target, TrendingUp, Calendar, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function StudentResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        setLoading(true);
        const res = await getStudentResults();
        if (res.success) {
            setResults(res.results);
        } else {
            toast.error(res.error || "Failed to load results");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Results</h1>
                    <p className="text-slate-500 mt-1 font-medium">Track your performance across mock tests</p>
                </div>
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <Trophy className="w-16 h-16 text-slate-200 mb-4" />
                    <h2 className="text-xl font-black text-slate-900">No Results Found</h2>
                    <p className="text-slate-500 max-w-sm mt-2 font-medium text-sm">
                        You haven't received any results yet. Complete mock tests to see your scoring and rankings here.
                    </p>
                    <Link href="/student/quizzes" className="mt-8">
                        <Button className="rounded-xl font-bold gap-2">
                            Take a Test <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Results</h1>
                <p className="text-slate-500 mt-1 font-medium">Track your performance and ranking across mock tests</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((res) => {
                    // Logic to determine pass/fail based on basic 40% criteria if not strictly stored
                    const isPass = res.score >= (res.totalMarks * 0.4); 
                    
                    return (
                        <div key={res._id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden flex flex-col h-full">
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 -mr-16 -mt-16 rounded-full ${isPass ? "bg-emerald-500" : "bg-rose-500"}`} />
                            
                            <div className="flex-1 space-y-4 mb-6 relative">
                                <div className="flex justify-between items-start">
                                    <span className="inline-block px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest border border-slate-100">
                                        {new Date(res.attemptDate).toLocaleDateString()}
                                    </span>
                                    {isPass ? (
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-xs font-black uppercase tracking-widest">Pass</Badge>
                                    ) : (
                                        <Badge className="bg-rose-50 text-rose-600 border-none px-2 py-0.5 text-xs font-black uppercase tracking-widest">Fail</Badge>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                                        {res.mockTestId?.title || "Mock Test Assessment"}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500">{res.course || "General Category"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Target className="w-3 h-3" /> Score
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">{res.score}</span>
                                        <span className="text-sm font-bold text-slate-400">/{res.totalMarks}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Trophy className="w-3 h-3" /> Rank 
                                    </p>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-blue-600">#{res.rank || "-"}</span>
                                        <span className="text-xs font-bold text-blue-400 mt-0.5">{res.percentile ? `${res.percentile}%ile` : "-"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6 bg-slate-50 rounded-xl p-3 px-4 border border-slate-100">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-300" /> {Math.floor(res.analysis?.timeTaken / 60) || 0}m {res.analysis?.timeTaken % 60 || 0}s</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-300" /> Attempted</span>
                            </div>

                            <div className="mt-auto">
                                <Link href={`/student/results/${res._id}`}>
                                    <Button className="w-full h-12 rounded-xl font-bold gap-2 text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        View Detailed Analysis
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
