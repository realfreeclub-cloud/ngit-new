import LoginForm from "@/components/auth/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
            {/* Security background vibe */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full -mr-64 -mt-64 blur-[120px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full -ml-32 -mb-32 blur-[100px] opacity-30" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-12 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl border-2 border-slate-800 group hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="h-10 w-10 text-rose-500 shadow-rose-500/50" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
                    Command <span className="text-rose-500">Center</span>
                </h2>
                <p className="mt-4 text-slate-500 font-bold tracking-tight uppercase tracking-[0.2em] text-[10px]">
                    Authorized Personnel Only • Secure Access
                </p>
            </div>

            <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 fade-in duration-700">
                <LoginForm
                    title="Sign In"
                    description="Enter your administrative credentials to continue."
                    role="ADMIN"
                />
            </div>
            
            <p className="mt-12 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] relative z-10">
                NGIT Security Protocol v4.0.2
            </p>
        </div>
    );
}
