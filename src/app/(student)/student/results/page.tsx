"use client";

import { useEffect, useState } from "react";
import { getStudentResults } from "@/app/actions/results";
import {
    Trophy, TrendingUp, CheckCircle2, XCircle, Clock,
    BookOpen, BarChart3, CalendarCheck, Star, ChevronRight,
    Award, Target, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Attempt {
    _id: string;
    score: number;
    totalMarks: number;
    isPassed: boolean;
    completedAt: string;
    timeTaken: number;
    quizId: {
        _id: string;
        title: string;
        isMockTest: boolean;
        courseId: { title: string };
    };
}

interface Enrollment {
    _id: string;
    progress: number;
    courseId: { _id: string; title: string };
}

interface Stats {
    totalAttempts: number;
    passedAttempts: number;
    avgScore: number;
    attendancePercentage: number;
    activeCourses: number;
    avgProgress: number;
}

function ScoreRing({ pct }: { pct: number }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    const color =
        pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

    return (
        <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle
                cx="44" cy="44" r={r}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
                style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <text x="44" y="49" textAnchor="middle" fontSize="14" fontWeight="900" fill={color}>
                {pct}%
            </text>
        </svg>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
    bg,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub?: string;
    color: string;
    bg: string;
}) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4", bg, color)}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
        </div>
    );
}

function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
}

function getGrade(pct: number) {
    if (pct >= 90) return { label: "A+", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (pct >= 75) return { label: "A", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (pct >= 60) return { label: "B", color: "text-blue-600", bg: "bg-blue-50" };
    if (pct >= 50) return { label: "C", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "F", color: "text-red-600", bg: "bg-red-50" };
}

export default function StudentResultsPage() {
    const [data, setData] = useState<{
        attempts: Attempt[];
        enrollments: Enrollment[];
        stats: Stats;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"All" | "Mock" | "Quiz">("All");

    useEffect(() => {
        getStudentResults().then((res) => {
            if (res.success) {
                setData({
                    attempts: (res.attempts as Attempt[]) ?? [],
                    enrollments: (res.enrollments as Enrollment[]) ?? [],
                    stats: res.stats as Stats,
                });
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 w-64 bg-slate-100 rounded-2xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-36 bg-slate-100 rounded-[2rem]" />
                    ))}
                </div>
                <div className="h-96 bg-slate-100 rounded-[2.5rem]" />
            </div>
        );
    }

    const attempts = data?.attempts ?? [];
    const enrollments = data?.enrollments ?? [];
    const stats = data?.stats ?? {
        totalAttempts: 0,
        passedAttempts: 0,
        avgScore: 0,
        attendancePercentage: 0,
        activeCourses: 0,
        avgProgress: 0,
    };

    const filtered = attempts.filter((a) => {
        if (filter === "Mock") return a.quizId?.isMockTest;
        if (filter === "Quiz") return !a.quizId?.isMockTest;
        return true;
    });

    const passRate =
        stats.totalAttempts > 0
            ? Math.round((stats.passedAttempts / stats.totalAttempts) * 100)
            : 0;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Results</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Track your academic performance and quiz history
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                    {(["All", "Mock", "Quiz"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-sm font-bold transition-all",
                                filter === f
                                    ? "bg-primary text-white shadow-md shadow-primary/30"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            {f === "All" ? "All Tests" : f === "Mock" ? "Mock Tests" : "Quizzes"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Target}
                    label="Tests Taken"
                    value={stats.totalAttempts.toString()}
                    sub="Total attempts"
                    color="text-primary"
                    bg="bg-primary/10"
                />
                <StatCard
                    icon={Flame}
                    label="Pass Rate"
                    value={`${passRate}%`}
                    sub={`${stats.passedAttempts} passed`}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
                <StatCard
                    icon={BarChart3}
                    label="Avg. Score"
                    value={`${stats.avgScore}%`}
                    sub="Across all tests"
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    icon={CalendarCheck}
                    label="Attendance"
                    value={`${stats.attendancePercentage}%`}
                    sub="Class presence"
                    color="text-amber-600"
                    bg="bg-amber-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Results Table */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Test History</h2>

                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 text-center">
                            <Trophy className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No results yet</h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                                Complete a quiz or mock test and your results will appear here.
                            </p>
                            <Link href="/student/quizzes">
                                <Button className="mt-6 rounded-xl font-bold gap-2">
                                    Take a Test <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((attempt) => {
                                const pct = Math.round((attempt.score / attempt.totalMarks) * 100);
                                const grade = getGrade(pct);
                                return (
                                    <div
                                        key={attempt._id}
                                        className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-6 flex items-center gap-6 hover:border-primary/30 hover:shadow-md transition-all group"
                                    >
                                        {/* Score Ring */}
                                        <div className="shrink-0">
                                            <ScoreRing pct={pct} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-slate-900 truncate">
                                                    {attempt.quizId?.title ?? "Unknown Test"}
                                                </h3>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    attempt.quizId?.isMockTest
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {attempt.quizId?.isMockTest ? "Mock Test" : "Quiz"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                {attempt.quizId?.courseId?.title ?? "—"}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                                    {attempt.score}/{attempt.totalMarks} marks
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {formatTime(attempt.timeTaken)}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(attempt.completedAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit", month: "short", year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Grade + Status */}
                                        <div className="shrink-0 flex flex-col items-center gap-2">
                                            <span className={cn(
                                                "text-2xl font-black px-3 py-1 rounded-xl",
                                                grade.bg, grade.color
                                            )}>
                                                {grade.label}
                                            </span>
                                            {attempt.isPassed ? (
                                                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                                                    <CheckCircle2 className="w-3 h-3" /> Passed
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-wider">
                                                    <XCircle className="w-3 h-3" /> Failed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Course Progress */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Course Progress</h3>
                                <p className="text-xs text-slate-400">Overall completion</p>
                            </div>
                        </div>
                        {enrollments.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No enrolled courses</p>
                        ) : (
                            <div className="space-y-5">
                                {enrollments.map((en) => (
                                    <div key={en._id}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <p className="text-sm font-bold text-slate-700 truncate">
                                                {en.courseId?.title}
                                            </p>
                                            <span className="text-xs font-black text-primary">{en.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${en.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Award className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Performance Summary</h3>
                                    <p className="text-xs text-slate-400">Your academic standing</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: "Average Score", value: `${stats.avgScore}%` },
                                    { label: "Tests Passed", value: `${stats.passedAttempts}/${stats.totalAttempts}` },
                                    { label: "Course Progress", value: `${stats.avgProgress}%` },
                                    { label: "Attendance", value: `${stats.attendancePercentage}%` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                                        <span className="text-xs text-slate-400 font-medium">{label}</span>
                                        <span className="text-sm font-black text-white">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400">Overall Grade</p>
                                    <p className={cn("text-3xl font-black mt-0.5", getGrade(stats.avgScore).color)}>
                                        {getGrade(stats.avgScore).label}
                                    </p>
                                </div>
                                <div className="w-16 h-16">
                                    <ScoreRing pct={stats.avgScore} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Link */}
                    <Link href="/student/quizzes">
                        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex items-center justify-between group hover:bg-primary/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Take a Mock Test</p>
                                    <p className="text-xs text-slate-400">Improve your ranking</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
