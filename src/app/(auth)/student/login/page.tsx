import LoginForm from "@/components/auth/LoginForm";
import { GraduationCap } from "lucide-react";

export default function StudentLoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/20">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Student Portal
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Access your learning dashboard and resources.
                </p>
            </div>

            <LoginForm
                title="Student Sign In"
                description="Secure access for enrolled students"
                role="STUDENT"
            />
        </div>
    );
}
