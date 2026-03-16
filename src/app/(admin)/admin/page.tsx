import { getDashboardStats } from "@/app/actions/dashboard";
import {
    Users,
    BookOpen,
    Wallet,
    AlertCircle,
    TrendingUp,
    ShieldAlert,
    Award,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const res = await getDashboardStats();

    // Fallback if DB fetch fails or no internet/permissions
    const s = res.success ? (res.stats as any) : {
        totalStudents: 0,
        activeCourses: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
        recentAttempts: [],
        recentStudents: []
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Command Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time overview of your institute's performance.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/mock-tests/new">
                        <Button className="h-12 font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                            Create Exam
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Active Students"
                    value={s.totalStudents}
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    trend="+15% this month"
                />
                <MetricCard
                    label="Published Courses"
                    value={s.activeCourses}
                    icon={<BookOpen className="w-6 h-6 text-purple-500" />}
                    trend="2 drafts pending"
                />
                <MetricCard
                    label="Gross Revenue"
                    value={`₹${s.totalRevenue.toLocaleString()}`}
                    icon={<Wallet className="w-6 h-6 text-emerald-500" />}
                    trend="+25% vs last month"
                />
                <MetricCard
                    label="Pending Tasks"
                    value={s.pendingApprovals}
                    icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
                    trend="Needs attention"
                    alert={true}
                />
            </div>

            {/* Mock Test Specific Analytics Widget */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-primary/10" />
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Award className="w-8 h-8 text-primary" />
                            Mock Test Performance Hub
                        </h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Comprehensive Assessment Metrics</p>
                    </div>
                    <Link href="/admin/results">
                        <Button className="rounded-2xl h-14 px-8 font-black gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            Release Rankings <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12 relative z-10">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conducted</p>
                        <p className="text-3xl font-black text-slate-900">{s.mockMetrics?.totalTests || 0}</p>
                        <p className="text-[10px] font-bold text-slate-500">Live Assessments</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Attempts</p>
                        <p className="text-3xl font-black text-slate-900">{s.mockMetrics?.totalAttempts || 0}</p>
                        <p className="text-[10px] font-bold text-emerald-500">↑ High Engagement</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Score</p>
                        <p className="text-3xl font-black text-indigo-600 font-mono">{s.mockMetrics?.highestScore || 0}</p>
                        <p className="text-[10px] font-bold text-slate-500">Peak Performance</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Score</p>
                        <p className="text-3xl font-black text-slate-900">{s.mockMetrics?.avgScore || 0}</p>
                        <p className="text-[10px] font-bold text-slate-500">Cohort Median</p>
                    </div>
                    <div className="space-y-2 lg:pl-8 lg:border-l border-slate-100">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Pending</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-black text-rose-600">{s.mockMetrics?.pending || 0}</p>
                            {s.mockMetrics?.pending > 0 && <span className="animate-ping w-2 h-2 rounded-full bg-rose-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-rose-400 uppercase">To Publish</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Global Live Feed */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border shadow-sm flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> Recent Exam Submissions
                        </h2>
                        <Link href="/admin/results"><Button variant="outline" size="sm">View All</Button></Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {s.recentAttempts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Award className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-medium">No recent exam submissions.</p>
                            </div>
                        ) : (
                            s.recentAttempts.map((attempt: any) => (
                                <div key={attempt._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                            {attempt.studentId?.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{attempt.studentId?.name || "Unknown Student"}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                                Exam: {attempt.quizId?.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-lg ${attempt.isPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {attempt.totalScore} / {attempt.totalMarks}
                                        </p>
                                        {attempt.securityLogs?.tabSwitchCount > 0 ? (
                                            <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded flex items-center justify-end gap-1 mt-1">
                                                <ShieldAlert className="w-3 h-3" /> Flagged
                                            </span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                                                {attempt.isPassed ? "Passed" : "Failed"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right panel - Recent Registrations */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-lg text-white flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-black flex items-center gap-2">
                            New Registrations
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {s.recentStudents.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-600 font-medium">
                                No new signups.
                            </div>
                        ) : (
                            s.recentStudents.map((u: any) => (
                                <div key={u._id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-emerald-400">
                                        {u.name?.charAt(0) || "S"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-slate-100 truncate">{u.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link href="/admin/students" className="mt-4">
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12">
                            Manage Directory
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, alert }: any) {
    return (
        <div className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all hover:shadow-md ${alert ? 'bg-orange-50/50 border-orange-100' : 'bg-white'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${alert ? 'bg-orange-100' : 'bg-slate-50'}`}>
                {icon}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${alert ? 'text-orange-700' : 'text-slate-400'}`}>
                {label}
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className={`text-xs font-bold mt-4 ${alert ? 'text-orange-600' : 'text-emerald-600'}`}>
                {trend}
            </p>
        </div>
    );
}
