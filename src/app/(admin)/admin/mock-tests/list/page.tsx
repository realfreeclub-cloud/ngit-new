"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { getAdminQuizzes, toggleQuizStatus } from "@/app/actions/admin-quizzes";

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTitle, setSearchTitle] = useState("");
    const [filterExamCode, setFilterExamCode] = useState("ALL");

    useEffect(() => {
        const fetchQuizzes = async () => {
            const res = await getAdminQuizzes();
            if (res.success) {
                setQuizzes(res.quizzes || []);
            } else {
                toast.error(res.error || "Failed to load quizzes");
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Quiz & Mock Test Engine</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Create online tests, assign them to students, and analyze performance.</p>
                </div>
                <Link href="/admin/mock-tests/new">
                    <Button className="h-12 px-6 rounded-2xl gap-2 font-bold shadow-xl shadow-primary/20">
                        <PlusCircle className="w-5 h-5" /> Create New Quiz
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Quizzes</p>
                    <p className="text-4xl font-black text-slate-900 mt-2">{quizzes.length}</p>
                </div>
            </div>

            <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Find mock tests by name..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="w-full h-12 bg-white border rounded-xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select 
                            className="h-12 bg-white border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary outline-none font-medium text-slate-700"
                            value={filterExamCode}
                            onChange={(e) => setFilterExamCode(e.target.value)}
                        >
                            <option value="ALL">All Exam Codes</option>
                            <option value="M1-R5">M1-R5</option>
                            <option value="M2-R5">M2-R5</option>
                            <option value="M3-R5">M3-R5</option>
                            <option value="M4-R5">M4-R5</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-slate-400 font-medium animate-pulse">
                        Loading test banks...
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Quiz details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Time & Marks</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600">
                            {quizzes.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic font-medium">No quizzes published yet. Start creating!</td>
                                </tr>
                            )}
                            {quizzes.filter(quiz => 
                                (filterExamCode === "ALL" || quiz.examCode === filterExamCode) &&
                                (quiz.title.toLowerCase().includes(searchTitle.toLowerCase()))
                            ).map((quiz) => (
                                <tr key={quiz._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{quiz.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Course: {quiz.courseId?.title || "Standalone"}
                                                    </p>
                                                    {quiz.isMockTest && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[8px] px-1.5 h-4">MOCK</Badge>}
                                                    {quiz.isPublished ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[8px] px-1.5 h-4">LIVE</Badge> : <Badge className="bg-slate-100 text-slate-400 hover:bg-slate-100 border-none text-[8px] px-1.5 h-4">DRAFT</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                            <Clock className="w-4 h-4 text-slate-400" /> {quiz.timeLimit} mins
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                                            Total: {quiz.totalMarks} Marks | Questions: {quiz.questions?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1 items-start">
                                            {quiz.pricing?.type === "PAID" ? (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    PAID (₹{quiz.pricing.amount})
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    FREE TEST
                                                  </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                onClick={async () => {
                                                    const res = await toggleQuizStatus(quiz._id, !quiz.isPublished);
                                                    if (res.success) {
                                                        toast.success("Status updated");
                                                        window.location.reload();
                                                    }
                                                }}
                                                variant="outline" 
                                                className={`h-9 px-3 rounded-xl text-[10px] font-black uppercase ${quiz.isPublished ? "text-rose-500 border-rose-100 font-black" : "text-emerald-500 border-emerald-100 font-black"}`}
                                            >
                                                {quiz.isPublished ? "Unpublish" : "Publish"}
                                            </Button>
                                            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-primary" asChild>
                                                <Link href={`/admin/mock-tests/edit/${quiz._id}`}><FileText className="w-4 h-4" /></Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
