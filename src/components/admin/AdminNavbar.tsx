"use client";

import NotificationBell from "../shared/NotificationBell";
import { Search, Menu, LogOut, User, Settings } from "lucide-react";
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

interface AdminNavbarProps {
    onMenuClick?: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const { data: session } = useSession();

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-muted/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="w-px h-6 bg-slate-200" />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 hover:bg-slate-50 p-1 rounded-xl transition-all">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{session?.user?.name || "NGIT Admin"}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Super Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-200 border-2 border-white">
                                {session?.user?.name?.[0] || "A"}
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 rounded-2xl p-2 mt-2 shadow-2xl border-slate-100" align="end">
                        <DropdownMenuLabel className="font-bold text-xs text-slate-400 uppercase tracking-widest px-3 mb-1">Account Management</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer gap-3" asChild>
                            <Link href="/admin/settings">
                                <User className="w-4 h-4" /> Profile Info
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer gap-3" asChild>
                            <Link href="/admin/settings">
                                <Settings className="w-4 h-4" /> System Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                            className="rounded-xl p-3 font-bold text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer gap-3"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            <LogOut className="w-4 h-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
