"use client";

import NotificationBell from "../shared/NotificationBell";
import { Search, LogOut, User, Settings, Shield } from "lucide-react";
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

export default function StudentNavbar() {
    const { data: session } = useSession();

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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-4 hover:bg-slate-50 p-2 rounded-2xl transition-all group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-slate-900 leading-none group-hover:text-primary transition-colors">
                                    {session?.user?.name || "Student"}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Role: {session?.user?.role || "STUDENT"}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-50 shadow-sm flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                {session?.user?.name?.[0] || "S"}
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 rounded-[2rem] p-3 mt-2 shadow-2xl border-slate-100" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal p-4 bg-slate-50 rounded-2xl mb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
                                    {session?.user?.name?.[0]}
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-black leading-none text-slate-900">{session?.user?.name}</p>
                                    <p className="text-xs font-medium leading-none text-slate-500 mt-1 truncate max-w-[150px]">{session?.user?.email}</p>
                                    <Badge className="w-fit mt-2 bg-primary/10 text-primary border-none shadow-none text-[10px] font-black uppercase tracking-tighter">
                                        Verified Student
                                    </Badge>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2 bg-slate-100" />
                        
                        <div className="space-y-1">
                            <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3 transition-colors" asChild>
                                <Link href="/student/settings">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3 transition-colors" asChild>
                                <Link href="/student/attendance">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    ID Card & Portal
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="rounded-xl p-3 font-bold text-slate-600 focus:text-primary focus:bg-primary/5 cursor-pointer flex items-center gap-3 transition-colors" asChild>
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
                            className="rounded-xl p-3 font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer flex items-center gap-3 transition-colors" 
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
        </header>
    );
}
