"use client";

import { useEffect, useState, useRef } from "react";
import { Megaphone, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Notification {
    id: string | number;
    text: string;
    link?: string;
    type?: "info" | "urgent" | "event";
}

interface NotificationScrollerProps {
    notifications: Notification[];
}

export default function NotificationScroller({ notifications = [] }: NotificationScrollerProps) {
    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="bg-slate-900 text-white overflow-hidden relative border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 flex items-center h-12">
                {/* Label */}
                <div className="flex items-center gap-2 bg-primary px-4 h-full relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
                    <Megaphone className="w-4 h-4 text-white" />
                    <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Updates</span>
                </div>

                {/* Marquee Container */}
                <div className="flex-1 overflow-hidden h-full flex items-center relative">
                    <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
                        {notifications.map((item, index) => (
                            <div key={item.id || index} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-white/90">
                                    {item.text}
                                </span>
                                {item.link && (
                                    <Link
                                        href={item.link}
                                        className="flex items-center gap-1 text-[10px] font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors text-primary-light uppercase tracking-tighter"
                                    >
                                        View <ChevronRight className="w-3 h-3" />
                                    </Link>
                                )}
                                {/* Separator */}
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                            </div>
                        ))}
                        {/* Repeat for continuous flow if content is short */}
                        {notifications.map((item, index) => (
                            <div key={`dup-${item.id || index}`} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-white/90">
                                    {item.text}
                                </span>
                                {item.link && (
                                    <Link
                                        href={item.link}
                                        className="flex items-center gap-1 text-[10px] font-bold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors text-primary-light uppercase tracking-tighter"
                                    >
                                        View <ChevronRight className="w-3 h-3" />
                                    </Link>
                                )}
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
