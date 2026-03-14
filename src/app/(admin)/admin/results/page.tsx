"use client";

import { useState, useEffect } from "react";
import { 
    Search, 
    Filter, 
    Calendar, 
    BookOpen, 
    User, 
    ChevronRight, 
    Download, 
    CheckCircle2, 
    XCircle,
    Info,
    LayoutGrid,
    Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getAdminResults } from "@/app/actions/results";
import { getAdminQuizzes } from "@/app/actions/admin-quizzes";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        courseType: "ALL" as "ALL" | "ONLINE" | "OFFLINE",
        quizId: "ALL",
        date: ""
    });
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    useEffect(() => {
        loadQuizzes();
        fetchResults();
    }, []);

    const loadQuizzes = async () => {
        const res = await getAdminQuizzes();
        if (res.success) {
            setQuizzes(res.quizzes);
        }
    };

    const fetchResults = async () => {
        setLoading(true);
        const res = await getAdminResults({
            courseType: filters.courseType === "ALL" ? undefined : filters.courseType,
            quizId: filters.quizId === "ALL" ? undefined : filters.quizId,
            date: filters.date || undefined
        });
        if (res.success) {
            setResults(res.results);
        } else {
            toast.error(res.error || "Failed to load results");
        }
        setLoading(false);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchResults();
    }, [filters]);

    const exportToCsv = () => {
        if (results.length === 0) return toast.error("No data to export");
        
        const headers = ["Student", "Email", "Quiz", "Course", "Type", "Score", "Total", "Percentage", "Status", "Date"];
        const rows = results.map(r => [
            r.studentId?.name,
            r.studentId?.email,
            r.quizId?.title,
            r.quizId?.courseId?.title,
            r.quizId?.courseId?.type,
            r.totalScore,
            r.totalMarks,
            Math.round((r.totalScore / r.totalMarks) * 100) + "%",
            r.isPassed ? "Pass" : "Fail",
            format(new Date(r.endTime), "PPpp")
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `results_${format(new Date(), "yyyy-MM-dd")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-white/50">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-blue-600" />
                        Student Results
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">Monitor performance across online & offline courses.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white border p-1 rounded-xl flex gap-1">
                        <Button 
                            variant={viewMode === "table" ? "secondary" : "ghost"} 
                            size="sm" 
                            onClick={() => setViewMode("table")}
                            className="rounded-lg h-9"
                        >
                            <TableIcon className="w-4 h-4 mr-2" /> Table
                        </Button>
                        <Button 
                            variant={viewMode === "grid" ? "secondary" : "ghost"} 
                            size="sm" 
                            onClick={() => setViewMode("grid")}
                            className="rounded-lg h-9"
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" /> Grid
                        </Button>
                    </div>
                    <Button onClick={exportToCsv} variant="outline" className="rounded-xl h-11 px-6 font-bold border-2 hover:bg-slate-50">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Course Type</label>
                    <Select value={filters.courseType} onValueChange={(v) => handleFilterChange("courseType", v)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="ALL">All Courses</SelectItem>
                            <SelectItem value="ONLINE">Online Courses</SelectItem>
                            <SelectItem value="OFFLINE">Offline Courses</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Quiz Selection</label>
                    <Select value={filters.quizId} onValueChange={(v) => handleFilterChange("quizId", v)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20">
                            <SelectValue placeholder="All Quizzes" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="ALL">All Quizzes</SelectItem>
                            {quizzes.map(q => (
                                <SelectItem key={q._id} value={q._id}>{q.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Result Date</label>
                    <div className="relative">
                        <Input 
                            type="date" 
                            className="h-12 rounded-xl border-slate-200 pl-10 focus:ring-blue-500/20" 
                            value={filters.date}
                            onChange={(e) => handleFilterChange("date", e.target.value)}
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Search Student</label>
                    <div className="relative">
                        <Input 
                            placeholder="Name or Email..."
                            className="h-12 rounded-xl border-slate-200 pl-10 focus:ring-blue-500/20" 
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Fetching Results...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-300 py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Info className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">No results found</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">Try adjusting your filters or search criteria to find what you're looking for.</p>
                    <Button 
                        variant="link" 
                        className="text-blue-600 font-bold mt-4"
                        onClick={() => setFilters({ courseType: "ALL", quizId: "ALL", date: "" })}
                    >
                        Clear All Filters
                    </Button>
                </div>
            ) : viewMode === "table" ? (
                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden border-none bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white border-none">
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Quiz & Course</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Score</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results.map((r) => (
                                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden border border-slate-200">
                                                    {r.studentId?.photoUrl ? (
                                                        <img src={r.studentId.photoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-5 h-5 opacity-50" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{r.studentId?.name || "Unknown Patient"}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{r.studentId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-800 text-sm">{r.quizId?.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">{r.quizId?.courseId?.type}</span>
                                                    <span className="text-xs text-slate-500 font-medium truncate max-w-[150px] inline-block">{r.quizId?.courseId?.title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${r.isPassed ? "bg-emerald-500" : "bg-rose-500"}`} 
                                                        style={{ width: `${(r.totalScore / r.totalMarks) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="font-black text-slate-900 text-sm">{r.totalScore}/{r.totalMarks}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">
                                                {Math.round((r.totalScore / r.totalMarks) * 100)}% Performance
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            {r.isPassed ? (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-100 px-3 py-1 rounded-full">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Passed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-rose-50 text-rose-600 border-none shadow-none font-bold uppercase tracking-widest text-[10px] hover:bg-rose-100 px-3 py-1 rounded-full">
                                                    <XCircle className="w-3 h-3 mr-1" /> Failed
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-sm font-bold text-slate-900">{format(new Date(r.endTime), "dd MMM, yyyy")}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(r.endTime), "p")}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((r) => (
                        <div key={r._id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 -mr-16 -mt-16 rounded-full ${r.isPassed ? "bg-emerald-500" : "bg-rose-500"}`} />
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden border-2 border-white shadow-md">
                                    {r.studentId?.photoUrl ? (
                                        <img src={r.studentId.photoUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 opacity-50" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-900 truncate">{r.studentId?.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium truncate">{r.studentId?.email}</p>
                                </div>
                                {r.isPassed ? (
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.quizId?.courseId?.type} Course</span>
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm line-clamp-1">{r.quizId?.title}</p>
                                    <p className="text-xs text-slate-500 font-medium truncate">{r.quizId?.courseId?.title}</p>
                                </div>

                                <div className="flex items-center justify-between px-1">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                                        <p className="text-xl font-black text-slate-900">{r.totalScore}<span className="text-slate-300 text-sm">/{r.totalMarks}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage</p>
                                        <p className={`text-xl font-black ${r.isPassed ? "text-emerald-600" : "text-rose-600"}`}>
                                            {Math.round((r.totalScore / r.totalMarks) * 100)}%
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase">{format(new Date(r.endTime), "PP")}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
