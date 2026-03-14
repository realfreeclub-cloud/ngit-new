"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
    GraduationCap, ArrowRight, Eye, EyeOff,
    BookOpen, Trophy, BarChart2, Loader2
} from "lucide-react";

const features = [
    { icon: BookOpen, label: "Access all course materials" },
    { icon: Trophy, label: "Take exams & mock tests" },
    { icon: BarChart2, label: "Track your results & progress" },
];

export default function StudentLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", { email, password, redirect: false });
            if (res?.error) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Welcome back!");
                const response = await fetch("/api/auth/session");
                const session = await response.json();
                if (session?.user?.role === "ADMIN") router.push("/admin");
                else router.push("/student");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 md:px-10">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white leading-none">Student Portal</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">NGIT Institute</p>
                    </div>
                </Link>
                <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
                    ← Back to Home
                </Link>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-sm">
                    {/* Hero text */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/30">
                            <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Student Login</h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium">
                            Access your personalised learning dashboard
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-13 bg-white/8 border border-white/15 text-white placeholder:text-slate-500 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Password</label>
                                    <Link href="#" className="text-[10px] text-primary font-bold hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-13 bg-white/8 border border-white/15 text-white placeholder:text-slate-500 rounded-2xl px-5 py-4 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-base shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
                                ) : (
                                    <>Sign In <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <p className="text-center text-sm text-slate-400">
                            New to NGIT?{" "}
                            <Link href="/register" className="text-primary font-black hover:underline">
                                Register Now
                            </Link>
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                                <f.icon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[11px] font-bold text-slate-300">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[10px] text-slate-600 pb-6 font-bold uppercase tracking-widest">
                NGIT Institute · Secure Student Login · 2025
            </p>
        </div>
    );
}
