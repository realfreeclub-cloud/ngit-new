import LoginForm from "@/components/auth/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-600 p-3 rounded-full shadow-lg shadow-red-500/20">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Admin Portal
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Restricted access for authorized personnel only.
                </p>
            </div>

            <LoginForm
                title="Admin Sign In"
                description="Use your administrative credentials"
                role="ADMIN"
            />
        </div>
    );
}
