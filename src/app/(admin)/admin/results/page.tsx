"use client";

import { useEffect, useState } from "react";
import { getMockTestResultsAdmin, deleteMockTestResult, publishMockTestResults } from "@/app/actions/mockTestResults";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, Filter, Download, Trash2, 
    CheckCircle2, XCircle, Clock, Eye, MoreVertical,
    Send, Settings as SettingsIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function MockTestResultsAdminPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [publishSettings, setPublishSettings] = useState({
        publishToStudentPanel: true,
        publishToPublicWebsite: false,
        customHeading: ""
    });

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        setLoading(true);
        const res = await getMockTestResultsAdmin();
        if (res.success) {
            setResults(res.results);
        } else {
            toast.error(res.error || "Failed to load results");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this result?")) return;
        const res = await deleteMockTestResult(id);
        if (res.success) {
            toast.success("Result deleted");
            loadResults();
        } else {
            toast.error(res.error);
        }
    };

    const handlePublish = async () => {
        if (!selectedQuizId) return toast.error("Please select a quiz to publish");
        const res = await publishMockTestResults(selectedQuizId, publishSettings);
        if (res.success) {
            toast.success(res.message);
            setIsPublishDialogOpen(false);
            loadResults();
        } else {
            toast.error(res.error);
        }
    };

    const filteredResults = results.filter(res => 
        res.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.mockTestId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mock Test Results</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and publish student performance rankings</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl h-12 font-bold gap-2 px-6 shadow-xl shadow-primary/20">
                                <Send className="w-5 h-5" />
                                Publish New Results
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black mb-4">Publish Results Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Select Mock Test</Label>
                                    <select 
                                        className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-bold"
                                        value={selectedQuizId}
                                        onChange={(e) => setSelectedQuizId(e.target.value)}
                                    >
                                        <option value="">Select a Test</option>
                                        {/* Simple unique mockTest extraction from already mapped results */}
                                        {Array.from(new Set(results.map(r => r.mockTestId?._id))).map((id: any) => {
                                            const quiz = results.find(r => r.mockTestId?._id === id)?.mockTestId;
                                            return <option key={id} value={id}>{quiz?.title}</option>
                                        })}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Custom Heading (Optional)</Label>
                                    <Input 
                                        placeholder="e.g. JEE Mock Test - March 2026"
                                        className="h-12 rounded-xl"
                                        value={publishSettings.customHeading}
                                        onChange={(e) => setPublishSettings({...publishSettings, customHeading: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl">
                                        <Switch 
                                            id="student-panel" 
                                            checked={publishSettings.publishToStudentPanel}
                                            onCheckedChange={(val: boolean) => setPublishSettings({...publishSettings, publishToStudentPanel: !!val})}
                                        />
                                        <Label htmlFor="student-panel" className="font-bold cursor-pointer">Publish to Student Panel</Label>
                                    </div>
                                    <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-2xl">
                                        <Switch 
                                            id="public-web" 
                                            checked={publishSettings.publishToPublicWebsite}
                                            onCheckedChange={(val: boolean) => setPublishSettings({...publishSettings, publishToPublicWebsite: !!val})}
                                        />
                                        <Label htmlFor="public-web" className="font-bold cursor-pointer">Publish to Public Website</Label>
                                    </div>
                                </div>

                                <Button className="w-full h-14 rounded-2xl font-black text-lg gap-2 mt-4" onClick={handlePublish}>
                                    <CheckCircle2 className="w-6 h-6" />
                                    Confirm & Publish
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="rounded-2xl h-12 font-bold px-4 border-2">
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Filters bar */}
            <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search student or test name..." 
                        className="pl-12 h-12 rounded-xl border-none bg-slate-50 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 bg-slate-50 border-none">
                        <Filter className="w-4 h-4" />
                        Course
                    </Button>
                    <Button variant="outline" className="rounded-xl h-12 font-bold gap-2 bg-slate-50 border-none">
                        <Filter className="w-4 h-4" />
                        Status
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-black text-slate-900 py-6 pl-8">Student</TableHead>
                            <TableHead className="font-black text-slate-900 py-6">Mock Test</TableHead>
                            <TableHead className="font-black text-slate-900 py-6 text-center">Score</TableHead>
                            <TableHead className="font-black text-slate-900 py-6 text-center">Rank</TableHead>
                            <TableHead className="font-black text-slate-900 py-6">Attempt Date</TableHead>
                            <TableHead className="font-black text-slate-900 py-6">Status</TableHead>
                            <TableHead className="font-black text-slate-900 py-6 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={7} className="h-20 bg-slate-50/20" />
                                </TableRow>
                            ))
                        ) : filteredResults.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-60 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <Clock className="w-12 h-12 text-slate-200" />
                                        <p className="text-slate-400 font-bold">No results found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredResults.map((res) => (
                                <TableRow key={res._id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                                                {res.studentId?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{res.studentId?.name}</p>
                                                <p className="text-xs font-bold text-slate-400">{res.studentId?.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 font-bold text-slate-700">{res.mockTestId?.title}</TableCell>
                                    <TableCell className="py-6 text-center">
                                        <span className="font-black text-slate-900">{res.score}</span>
                                        <span className="text-slate-400 font-bold"> / {res.totalMarks}</span>
                                    </TableCell>
                                    <TableCell className="py-6 text-center">
                                        {res.rank ? (
                                            <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-black text-sm">
                                                #{res.rank}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-400 font-medium">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-6 text-slate-500 font-bold">
                                        {new Date(res.attemptDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="py-6">
                                        {res.publishStatus === "PUBLISHED" ? (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-3 py-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Published
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-600 border-none font-black px-3 py-1">
                                                <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-6 text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl w-48">
                                                <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer">
                                                    <Eye className="w-4 h-4 mr-3 text-slate-400" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer">
                                                    <SettingsIcon className="w-4 h-4 mr-3 text-slate-400" /> Edit Visibility
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="rounded-xl font-bold py-3 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                    onClick={() => handleDelete(res._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" /> Delete Result
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
