"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    Home, PlayCircle, BookOpen, Trophy, TrendingUp,
    ClipboardList, Award, UserCircle, CreditCard,
    GraduationCap, X, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const menuItems = [
    { label: "Dashboard", href: "/student", icon: Home },
    { label: "My Courses", href: "/student/courses", icon: PlayCircle },
    { label: "My Mock Tests", href: "/student/quizzes", icon: Trophy },
    { label: "My Results", href: "/student/results", icon: TrendingUp },
    { label: "Study Material", href: "/student/materials", icon: BookOpen },
    { label: "Payments", href: "/student/fees", icon: CreditCard },
    { label: "Attendance", href: "/student/attendance", icon: ClipboardList },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "Profile", href: "/student/settings", icon: UserCircle },
];

interface StudentSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        onClose();
    }, [pathname]);

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 h-full w-72 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ease-in-out",
                "lg:relative lg:translate-x-0 lg:w-64 lg:shrink-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                    <Link href="/student" className="flex items-center gap-3 group" onClick={onClose}>
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-black tracking-tight text-white leading-none">Student Portal</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">NGIT Institute</p>
                        </div>
                    </Link>
                    {/* Close button — mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                                {item.label}
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer — student info */}
                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                            {session?.user?.name?.[0] || "S"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Student"}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Session</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
