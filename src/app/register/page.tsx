"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { registerUser } from "@/app/actions/registration";
import { GraduationCap, ArrowRight, Eye, EyeOff, Loader2, User, Mail, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
    });

    const set = (field: string, value: string) =>
        setForm((f) => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (form.mobile.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }

        setLoading(true);
        try {
            const result = await registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
                mobile: form.mobile,
            });
            if (result.success) {
                toast.success("Account created successfully!");
                router.push("/student/login");
            } else {
                toast.error(result.error || "Registration failed.");
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
            
            <header className="flex items-center justify-between px-8 py-8 md:px-12 relative z-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-white leading-none tracking-tight">NGIT <span className="text-primary">Hub</span></p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">Education Platform</p>
                    </div>
                </Link>
                <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:bg-white/10">
                    ← Back to Home
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-[450px]">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                            Create <span className="text-gradient">Account</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-base tracking-tight max-w-sm mx-auto">
                            Join our platform to access learning materials and track your progress.
                        </p>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-12 shadow-2xl animate-in zoom-in-95 fade-in duration-700">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={(e) => set("name", e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-600 rounded-3xl pl-14 pr-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) => set("email", e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-600 rounded-3xl pl-14 pr-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={form.mobile}
                                        onChange={(e) => set("mobile", e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-600 rounded-3xl pl-14 pr-6 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={(e) => set("password", e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/5 text-white placeholder:text-slate-700 rounded-3xl pl-14 pr-14 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all duration-300 group-hover:bg-white/[0.08]"
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-18 bg-primary hover:bg-slate-50 hover:text-slate-950 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 text-lg shadow-2xl shadow-primary/20 transition-all duration-500 active:scale-95 disabled:opacity-50 mt-4 group"
                            >
                                {loading ? (
                                    <><Loader2 className="w-6 h-6 animate-spin text-white" /> Creating Account...</>
                                ) : (
                                    <>Join Platform <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-10">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Already registered?</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <div className="text-center">
                            <Link href="/student/login">
                                <Button variant="outline" className="h-12 border-2 border-white/5 bg-transparent text-white font-black hover:bg-white/10 px-8 rounded-2xl w-full">
                                    Login to Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
