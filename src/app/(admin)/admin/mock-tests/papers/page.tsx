"use client";

import { Box, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaperSetsPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-100/50">
                <Box className="w-12 h-12" />
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Paper Sets Module</h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto text-lg leading-relaxed mb-10">
                The group-based paper management system is currently under heavy development. 
                Soon you'll be able to create sets for specific batches and courses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/mock-tests">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl font-black gap-2 border-2">
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Button>
                </Link>
                <Link href="/admin/quizzes">
                    <Button className="h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                        <Sparkles className="w-5 h-5" /> Manage Quizzes Instead
                    </Button>
                </Link>
            </div>
        </div>
    );
}
