"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Welcome back!");

                // Fetch session to get role
                const response = await fetch('/api/auth/session');
                const session = await response.json();

                if (session?.user?.role === 'ADMIN') {
                    router.push("/admin");
                } else {
                    router.push("/student");
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                        <GraduationCap className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Sign In</h1>
                    <p className="text-slate-500 mt-2">Access your genius portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            className="h-14 rounded-2xl px-6"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-14 rounded-2xl px-6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        disabled={loading}
                        className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm">
                    Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register Today</Link>
                </p>
            </div>
        </div>
    );
}
