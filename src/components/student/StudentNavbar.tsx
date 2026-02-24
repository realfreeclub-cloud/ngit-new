"use client";

import NotificationBell from "../shared/NotificationBell";
import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function StudentNavbar() {
    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 z-40">
            <div className="flex items-center gap-6 flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search lessons, tests or materials..."
                        className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 h-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <NotificationBell />
                </div>

                <div className="w-px h-8 bg-slate-100" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black text-slate-900 leading-none">Aryan Malhotra</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">IIT-JEE Batch #26</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-50 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                        AM
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="rounded-2xl h-12 w-12 text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
