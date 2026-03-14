"use client";

import { useEffect, useState } from "react";
import { getDetailedResult } from "@/app/actions/mockTestResults";
import { 
    Clock, Trophy, Target, TrendingUp, Calendar, 
    ArrowLeft, CheckCircle2, XCircle, AlertCircle, 
    MousePointer2, HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function DetailedResultPage() {
    const params = useParams();
    const [data, setData] = useState<{ result: any; answers: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResultData();
    }, [params.id]);

    const loadResultData = async () => {
        setLoading(true);
        if (typeof params.id !== "string") return;
        
        const res = await getDetailedResult(params.id);
        if (res.success) {
            setData({ result: res.result, answers: res.answers });
        } else {
            toast.error(res.error || "Failed to load detailed result");
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

    if (!data || !data.result) {
        return (
            <div className="text-center py-20 animate-in fade-in duration-500">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                <h2 className="text-xl font-black text-slate-900">Result Not Found</h2>
                <p className="text-slate-500 mt-2">The result you're looking for doesn't exist or you don't have access.</p>
                <Link href="/student/results">
                    <Button className="mt-6">Back to Results</Button>
                </Link>
            </div>
        );
    }

    const { result, answers } = data;
    const { analysis, mockTestId } = result;
    const isPass = result.score >= (result.totalMarks * 0.4);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <Link href="/student/results">
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{mockTestId?.title}</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Detailed Performance Analysis</p>
                </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-primary" /> Total Score
                            </p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-6xl font-black">{result.score}</span>
                                <span className="text-2xl font-bold text-slate-400">/ {result.totalMarks}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {isPass ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1 font-black uppercase text-xs tracking-widest">Passed Target</Badge>
                                ) : (
                                    <Badge className="bg-rose-500/20 text-rose-400 border-none px-3 py-1 font-black uppercase text-xs tracking-widest">Needs Improvement</Badge>
                                )}
                                <span className="text-sm font-medium text-slate-400">{result.course}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 text-center min-w-[120px]">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                                <p className="text-3xl font-black text-white">#{result.rank || "-"}</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10 text-center min-w-[120px]">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Percentile</p>
                                <p className="text-3xl font-black text-white">{result.percentile?.toFixed(1) || "-"}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accuracy Card */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] p-8 flex flex-col justify-center text-center group hover:border-primary/20 transition-all">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/5 transition-colors">
                        <Target className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-4xl font-black text-slate-900 mb-1">{analysis?.accuracy?.toFixed(0) || 0}%</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Overall Accuracy</p>
                    <p className="text-xs font-medium text-slate-500 mt-2">
                        {analysis?.correctAnswers} of {analysis?.correctAnswers + analysis?.incorrectAnswers} answered correctly
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Correct</p>
                    <p className="text-2xl font-black text-slate-900">{analysis?.correctAnswers || 0}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-rose-500" /> Incorrect</p>
                    <p className="text-2xl font-black text-slate-900">{analysis?.incorrectAnswers || 0}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Skipped</p>
                    <p className="text-2xl font-black text-slate-900">{analysis?.unattemptedQuestions || 0}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> Total Time</p>
                    <p className="text-2xl font-black text-slate-900">
                        {Math.floor((analysis?.timeTaken || 0) / 60)}m {(analysis?.timeTaken || 0) % 60}s
                    </p>
                </div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <MousePointer2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Question Analysis</h2>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">Review your answers and explanations</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {answers.map((answer, index) => {
                            const isCorrect = answer.evaluation?.isCorrect;
                            const isSkipped = !answer.selectedOptionIds || answer.selectedOptionIds.length === 0;

                            return (
                                <div key={answer._id} className="p-8 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm">
                                                {index + 1}
                                            </span>
                                            {isSkipped ? (
                                                <Badge className="bg-slate-100 text-slate-500 border-none font-bold">Unattempted</Badge>
                                            ) : isCorrect ? (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold"><CheckCircle2 className="w-3 h-3 mr-1" /> Correct</Badge>
                                            ) : (
                                                <Badge className="bg-rose-50 text-rose-600 border-none font-bold"><XCircle className="w-3 h-3 mr-1" /> Incorrect</Badge>
                                            )}
                                        </div>
                                        {/* Display marks awarded */}
                                        <span className={`font-black tracking-tight ${isCorrect ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            +{answer.evaluation?.marksAwarded || 0}
                                        </span>
                                    </div>
                                    
                                    <div className="prose prose-slate max-w-none text-slate-900 font-medium mb-6" dangerouslySetInnerHTML={{ __html: answer.questionId?.content || "Question content hidden" }} />
                                    
                                    {/* Selected Options Display (Simple text mapping assumed if populated, else just basic UI block) */}
                                    {!isSkipped && (
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Answer ID(s)</p>
                                            <p className="text-slate-700 font-medium">{answer.selectedOptionIds?.join(", ")}</p>
                                        </div>
                                    )}

                                    {/* Show explanation if available */}
                                    {answer.questionId?.explanation && (
                                        <div className="mt-4 bg-primary/5 rounded-2xl p-4 border border-primary/10">
                                            <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Explanation</p>
                                            <div className="prose prose-sm prose-slate max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: answer.questionId.explanation }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {answers.length === 0 && (
                            <div className="p-16 text-center">
                                <p className="text-slate-500 font-bold">No detailed question analysis available for this attempt.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
