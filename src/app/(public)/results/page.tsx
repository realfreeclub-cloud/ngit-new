"use client";

import { useEffect, useState } from "react";
import { getPublicMockTestResults } from "@/app/actions/mockTestResults";
import { 
    Search, Filter, Calendar, MapPin, Target,
    Trophy, ChevronRight, CheckCircle2, Medal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PublicResultsPage() {
    const [sections, setSections] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        setLoading(true);
        const res = await getPublicMockTestResults();
        if (res.success) {
            setSections(res.sections);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            {/* Header Section */}
            <div className="bg-slate-900 border-b border-slate-800 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full flex justify-between pointer-events-none gap-8 opacity-10">
                    <div className="w-[800px] h-[800px] bg-primary rounded-full blur-[100px] -ml-[400px] -mt-[400px]" />
                    <div className="w-[600px] h-[600px] bg-blue-500 rounded-full blur-[100px] -mr-[300px] mt-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest mb-6 backdrop-blur">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        Performance Hub
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
                        Mock Test Results & Rankings
                    </h1>
                    <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Explore the performance of our top achievers across various tests and courses.
                    </p>

                    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex flex-col md:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input 
                                placeholder="Search by student name or test..." 
                                className="pl-12 h-14 bg-white/5 border-none text-white focus-visible:ring-1 focus-visible:ring-primary/50 text-base font-medium rounded-xl placeholder:text-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="h-14 px-8 rounded-xl font-black gap-2 hover:scale-[1.02] transition-transform text-white shadow-xl shadow-primary/20">
                            Search Results
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Leaderboards...</p>
                    </div>
                ) : Object.keys(sections).length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-24 text-center border border-slate-100 shadow-xl shadow-slate-200/20">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Target className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No Public Results Available</h2>
                        <p className="text-slate-500 font-medium max-w-md mx-auto">
                            There are currently no mock test results published for public viewing. Check back later or log in to view your personal results.
                        </p>
                    </div>
                ) : (
                    Object.entries(sections).map(([heading, sectionResults]) => {
                        const filtered = sectionResults.filter(r => 
                            r.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.mockTestId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        if (filtered.length === 0) return null;

                        return (
                            <section key={heading} className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                                {/* Section Heading */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className="bg-primary/10 text-primary border-none shadow-none font-black uppercase tracking-widest text-[10px] px-2 py-0.5">
                                                Test Results
                                            </Badge>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" /> Published Recently
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                            {heading}
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                        <Target className="w-5 h-5 text-slate-400" />
                                        <span className="font-black text-slate-900">{filtered.length} <span className="text-slate-500 font-medium text-sm">Students Ranked</span></span>
                                    </div>
                                </div>

                                {/* Results Table */}
                                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden border-none bg-white">
                                    <div className="overflow-x-auto">
                                        <Table className="w-full text-left">
                                            <TableHeader className="bg-slate-900">
                                                <TableRow className="hover:bg-transparent border-none">
                                                    <TableHead className="py-6 px-8 text-white font-black uppercase tracking-widest text-xs rounded-tl-3xl">Rank</TableHead>
                                                    <TableHead className="py-6 text-white font-black uppercase tracking-widest text-xs">Student</TableHead>
                                                    <TableHead className="py-6 text-white font-black uppercase tracking-widest text-xs">Course / Batch</TableHead>
                                                    <TableHead className="py-6 text-center text-white font-black uppercase tracking-widest text-xs">Score</TableHead>
                                                    <TableHead className="py-6 pr-8 text-right text-white font-black uppercase tracking-widest text-xs rounded-tr-3xl">Percentile</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="divide-y divide-slate-50">
                                                {filtered.map((r, index) => {
                                                    const isTop3 = r.rank <= 3;
                                                    return (
                                                        <TableRow key={r._id} className="hover:bg-slate-50/50 transition-colors border-none group">
                                                            <TableCell className="py-5 px-8">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                                                    r.rank === 1 ? "bg-yellow-100 text-yellow-600 border-2 border-yellow-200" :
                                                                    r.rank === 2 ? "bg-slate-200 text-slate-700 border-2 border-slate-300" :
                                                                    r.rank === 3 ? "bg-orange-100 text-orange-700 border-2 border-orange-200" :
                                                                    "bg-slate-50 text-slate-500 border border-slate-100"
                                                                }`}>
                                                                    {isTop3 ? <Medal className="w-6 h-6" /> : r.rank || "-"}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-[1rem] bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                                                                        {r.studentId?.name?.[0] || "?"}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-slate-900 text-base">{r.studentId?.name || "Anonymous Student"}</p>
                                                                        {isTop3 && <p className="text-[10px] font-black uppercase tracking-widest text-primary">Top Performer</p>}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-5">
                                                                <p className="font-bold text-slate-700">{r.course || r.mockTestId?.courseId?.title || "General"}</p>
                                                                <p className="text-xs font-medium text-slate-400 mt-0.5">{r.batch || "Standard Batch"}</p>
                                                            </TableCell>
                                                            <TableCell className="py-5 text-center">
                                                                <span className="font-black text-xl text-slate-900">{r.score}</span>
                                                                <span className="text-sm font-bold text-slate-400">/{r.totalMarks}</span>
                                                            </TableCell>
                                                            <TableCell className="py-5 pr-8 text-right">
                                                                <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-black shadow-none rounded-xl text-sm hover:bg-blue-100">
                                                                    {r.percentile ? `${r.percentile.toFixed(1)}%` : "-"}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </section>
                        );
                    })
                )}
            </div>
        </div>
    );
}
