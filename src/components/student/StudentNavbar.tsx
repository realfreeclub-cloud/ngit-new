"use client";

import NotificationBell from "../shared/NotificationBell";
import { Search, LogOut, User, Settings, Shield, Menu, PlayCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StudentNavbarProps {
    onMenuToggle: () => void;
}

const quickLinks = [
    { label: "My Courses", href: "/student/courses", icon: PlayCircle, color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" },
    { label: "My Exams", href: "/student/quizzes", icon: Trophy, color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
];

export default function StudentNavbar({ onMenuToggle }: StudentNavbarProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <header className="bg-white border-b z-40 shrink-0">
            {/* Main row */}
            <div className="flex items-center justify-between px-4 md:px-8 h-16 gap-4">
                {/* Left — Hamburger + Search */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search */}
                    <div className="relative flex-1 max-w-sm hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search lessons, tests..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 h-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium outline-none"
                        />
                    </div>
                </div>

                {/* Right — Quick Links + Bell + Profile */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {/* Quick access pills — hidden on very small screens */}
                    <div className="hidden sm:flex items-center gap-2">
                        {quickLinks.map(link => {
                            const isActive = pathname.startsWith(link.href);
                            return (
                                <Link key={link.href} href={link.href}>
                                    <span className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/25"
                                            : link.color
                                    )}>
                                        <link.icon className="w-3.5 h-3.5" />
                                        <span className="hidden md:inline">{link.label}</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="w-px h-6 bg-slate-100 hidden sm:block" />

                    <NotificationBell />

                    <div className="w-px h-6 bg-slate-100" />

                    {/* Profile dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 hover:bg-slate-50 py-1.5 px-2 rounded-2xl transition-all group">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs font-black text-slate-900 leading-none group-hover:text-primary transition-colors truncate max-w-[100px]">
                                        {session?.user?.name || "Student"}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        Student
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-slate-900 border-2 border-slate-50 shadow-sm flex items-center justify-center text-white font-bold text-sm group-hover:bg-primary transition-colors">
                                    {session?.user?.name?.[0] || "S"}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72 rounded-[2rem] p-3 mt-2 shadow-2xl border-slate-100" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal p-4 bg-slate-50 rounded-2xl mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shrink-0">
                                        {session?.user?.name?.[0]}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-black leading-none text-slate-900">{session?.user?.name}</p>
                                        <p className="text-xs font-medium leading-none text-slate-500 mt-1 truncate">{session?.user?.email}</p>
                                        <Badge className="w-fit mt-2 bg-primary/10 text-primary border-none shadow-none text-[10px] font-black uppercase">
                                            Verified Student
                                        </Badge>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-2 bg-slate-100" />

                            <div className="space-y-1">
                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3" asChild>
                                    <Link href="/student/settings">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <User className="h-4 w-4" />
                                        </div>
                                        Profile Settings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3" asChild>
                                    <Link href="/student/attendance">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        Attendance
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3" asChild>
                                    <Link href="/student/settings">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Settings className="h-4 w-4" />
                                        </div>
                                        Account Settings
                                    </Link>
                                </DropdownMenuItem>
                            </div>

                            <DropdownMenuSeparator className="my-2 bg-slate-100" />

                            <DropdownMenuItem
                                className="rounded-xl p-3 font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer flex items-center gap-3"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile quick-access bar (full width second row) */}
            <div className="sm:hidden flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search lessons, tests..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-3 h-9 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium min-w-0"
                />
                {quickLinks.map(link => (
                    <Link key={link.href} href={link.href} className="shrink-0">
                        <span className={cn(
                            "flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all",
                            pathname.startsWith(link.href) ? "bg-primary text-white" : link.color
                        )}>
                            <link.icon className="w-3.5 h-3.5" />
                            {link.label}
                        </span>
                    </Link>
                ))}
            </div>
        </header>
    );
}
