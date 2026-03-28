"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", { email, password, redirect: false });

            if (res?.error) {
                if (res.error === "ACCOUNT_PENDING_APPROVAL") {
                    toast.error("Your account is pending admin approval. Please wait for activation.");
                } else {
                    toast.error("Invalid email or password. Please try again.");
                }
            } else {
                toast.success("Welcome back!");
                // Refresh server state first, then read updated session
                router.refresh();
                const response = await fetch("/api/auth/session");
                const session = await response.json();

                if (callbackUrl && !callbackUrl.startsWith("/admin")) {
                    router.push(callbackUrl);
                } else if (session?.user?.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/student");
                }
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full -mr-96 -mt-96 blur-[150px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full -ml-64 -mb-64 blur-[120px] opacity-30" />
            
            {/* Top bar */}
            <header className="flex items-center justify-between px-8 py-8 md:px-12 relative z-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-white leading-none tracking-tight">Student <span className="text-primary">Portal</span></p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">NGIT Education Hub</p>
                    </div>
                </Link>
                <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:bg-white/10">
                    ← Back to Platform
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-[450px]">
                    {/* Welcome Header */}
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                            Welcome <span className="text-gradient">Back</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-base tracking-tight max-w-sm mx-auto">
                            Unlock your educational potential. Log in to your personal learning dashboard.
                        </p>
                    </div>

                    {/* Premium Login Card */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl animate-in zoom-in-95 fade-in duration-700">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Account Identifier</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="Enter your student email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-600 rounded-3xl px-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Access Key</label>
                                    <Link href="#" className="text-[10px] text-primary font-black hover:text-white uppercase tracking-widest">Forgot Access?</Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-700 rounded-3xl px-6 pr-14 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-18 bg-primary hover:bg-slate-50 hover:text-slate-950 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 text-lg shadow-2xl shadow-primary/20 transition-all duration-500 active:scale-95 disabled:opacity-50 mt-4 group"
                            >
                                {loading ? (
                                    <><Loader2 className="w-6 h-6 animate-spin text-white" /> Accessing Portal...</>
                                ) : (
                                    <>Enter Classroom <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-10">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Credentials Required</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-500 font-bold mb-4">New student seeking enrollment?</p>
                            <Link href="/register">
                                <Button variant="outline" className="h-12 border-2 border-white/5 bg-transparent text-white font-black hover:bg-white/10 px-8 rounded-2xl">
                                    Submit Application
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Features section */}
                    <div className="grid grid-cols-3 gap-4 mt-12 opacity-60">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">{f.label.split(' ')[0]} {f.label.split(' ')[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Sticky Footer */}
            <footer className="px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/[0.02]">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                    NGIT Academy · Secure Portal Environment · 2025
                </p>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                    <Link href="#" className="hover:text-primary transition-colors">Privacy Framework</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Security Protocol</Link>
                </div>
            </footer>
        </div>
    );
}
