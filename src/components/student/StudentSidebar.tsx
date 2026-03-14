"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    PlayCircle,
    BookOpen,
    HelpCircle,
    FileText,
    Trophy,
    UserCircle,
    TrendingUp,
    ClipboardList,
    Award,
    Settings,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const menuItems = [
    { label: "Dashboard", href: "/student", icon: Home },
    { label: "My Courses", href: "/student/courses", icon: PlayCircle },
    { label: "My Exams", href: "/student/quizzes", icon: Trophy },
    { label: "Study Material", href: "/student/materials", icon: BookOpen },
    { label: "Results", href: "/student/results", icon: TrendingUp },
    { label: "Payments", href: "/student/fees", icon: CreditCard },
    { label: "Attendance", href: "/student/attendance", icon: ClipboardList },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "Profile", href: "/student/settings", icon: UserCircle },
];

export default function StudentSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-8">
                <h1 className="text-2xl font-bold tracking-tight">NGIT LMS</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            pathname === item.href
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-6 border-t border-slate-800">
                <div className="bg-slate-800 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Enrolled Course</p>
                    <p className="text-sm font-semibold truncate">IIT-JEE Foundation 2026</p>
                </div>
            </div>
        </aside>
    );
}
