"use client";

import { useEffect, useState } from "react";
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    FileUp, 
    Download,
    HelpCircle,
    ChevronDown,
    BrainCircuit,
    Sparkles,
    CheckCircle2,
    XCircle,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { getQuestions, deleteQuestion } from "@/app/actions/questions";

export default function QuestionBankPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [filterDifficulty, setFilterDifficulty] = useState("ALL");
    const [filterExamCode, setFilterExamCode] = useState("ALL");

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        const res = await getQuestions();
        if (res.success) {
            setQuestions(res.questions);
        } else {
            toast.error(res.error);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        const res = await deleteQuestion(id);
        if (res.success) {
            toast.success("Question deleted successfully");
            loadQuestions();
        } else {
            toast.error(res.error);
        }
    };

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.content?.en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             q.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             q.topic?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "ALL" || q.type === filterType;
        const matchesDifficulty = filterDifficulty === "ALL" || q.difficulty === filterDifficulty;
        const matchesExamCode = filterExamCode === "ALL" || q.examCode === filterExamCode;
        return matchesSearch && matchesType && matchesDifficulty && matchesExamCode;
    });

    return (
        <div className="space-y-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BrainCircuit className="w-10 h-10 text-primary" />
                        Question Bank
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your institution's intellectual assets and test resources.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Link href="/admin/mock-tests/questions/import">
                        <Button variant="outline" className="rounded-2xl h-14 font-black gap-2 px-6 border-2 border-slate-100 bg-white hover:bg-slate-50">
                            <FileUp className="w-5 h-5 text-slate-400" />
                            Import Excel
                        </Button>
                    </Link>
                    <Link href="/admin/mock-tests/questions/new">
                        <Button className="rounded-2xl h-14 font-black gap-2 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                            <Plus className="w-5 h-5" />
                            Add Question
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Questions", value: questions.length, icon: HelpCircle, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Physics", value: questions.filter(q => q.subject === "Physics").length, icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Chemistry", value: questions.filter(q => q.subject === "Chemistry").length, icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Mathematics", value: questions.filter(q => q.subject === "Mathematics").length, icon: BrainCircuit, color: "text-indigo-500", bg: "bg-indigo-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                        placeholder="Search by question content, subject or topic..." 
                        className="pl-14 h-14 rounded-2xl border-none bg-slate-50 font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <select 
                        className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[160px]"
                        value={filterExamCode}
                        onChange={(e) => setFilterExamCode(e.target.value)}
                    >
                        <option value="ALL">All Exam Codes</option>
                        <option value="M1-R5">M1-R5</option>
                        <option value="M2-R5">M2-R5</option>
                        <option value="M3-R5">M3-R5</option>
                        <option value="M4-R5">M4-R5</option>
                    </select>
                    <select 
                        className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[160px]"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="MCQ_SINGLE">Single MCQ</option>
                        <option value="MCQ_MULTIPLE">Multiple MCQ</option>
                        <option value="NUMERIC">Numeric</option>
                        <option value="ASSERTION_REASON">Assertion-Reason</option>
                        <option value="MATCH_THE_FOLLOWING">Match Matrix</option>
                    </select>
                    <select 
                        className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[160px]"
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                        <option value="ALL">All Levels</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8 pl-10">Question Detail</TableHead>
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8">Subject / Topic</TableHead>
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8 text-center">Type</TableHead>
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8 text-center">Marks</TableHead>
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8 text-center">Difficulty</TableHead>
                            <TableHead className="font-black text-white text-[10px] uppercase tracking-widest py-8 text-right pr-10">Control</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={6} className="h-24 bg-slate-50/20" />
                                </TableRow>
                            ))
                        ) : filteredQuestions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-32 text-center text-slate-400">
                                    <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                    <p className="font-black uppercase tracking-widest text-xs">No questions found matching filters</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuestions.map((q) => (
                                <TableRow key={q._id} className="group hover:bg-slate-50/50 transition-all border-slate-50">
                                    <TableCell className="py-8 pl-10 max-w-md">
                                        <div className="prose prose-sm font-bold text-slate-900 line-clamp-2" dangerouslySetInnerHTML={{ __html: q.content?.en }} />
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 bg-white">ID: {q._id.slice(-6)}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 bg-white">Code: {q.examCode || "N/A"}</Badge>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 bg-white">Course: {q.courseId?.title}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8">
                                        <p className="font-black text-slate-800 uppercase tracking-tight">{q.subject}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{q.topic}</p>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase py-1">
                                            {q.type.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900">+{q.marks}</span>
                                            <span className="text-[10px] font-bold text-rose-500">-{q.negativeMarks}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-8 text-center">
                                        <Badge className={`border-none font-black text-[10px] uppercase py-1 ${
                                            q.difficulty === "EASY" ? "bg-emerald-50 text-emerald-600" :
                                            q.difficulty === "MEDIUM" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                        }`}>
                                            {q.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-8 text-right pr-10">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100" asChild>
                                                <Link href={`/admin/mock-tests/questions/edit/${q._id}`}><Edit className="w-5 h-5 text-slate-600" /></Link>
                                            </Button>
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-rose-50 hover:text-rose-600" onClick={() => handleDelete(q._id)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
