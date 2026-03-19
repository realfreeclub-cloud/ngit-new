"use client";

import { ChevronLeft, ChevronRight, GraduationCap, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Faculty {
    id: number | string;
    name: string;
    subject: string;
    qualification: string;
    experience: string;
    specialization: string;
    image?: string;
}

const defaultFaculty: Faculty[] = [
    {
        id: 1,
        name: "Javed Akhtar",
        subject: "Managing Director",
        qualification: "MCA, PGDCA",
        experience: "15+ Years",
        specialization: "Software Development & IT Strategy",
    },
    {
        id: 2,
        name: "Mohd. Anas",
        subject: "Senior Faculty",
        qualification: "MCA",
        experience: "8 Years",
        specialization: "Advanced Programming & Data Science",
    },
    {
        id: 3,
        name: "Saurabh Mishra",
        subject: "Lab Instructor",
        qualification: "B.Tech",
        experience: "6 Years",
        specialization: "Hardware & Networking Expert",
    },
    {
        id: 4,
        name: "Arifa Khatoon",
        subject: "Typing Expert",
        qualification: "MA, ADCA",
        experience: "10 Years",
        specialization: "Expert Bilingual Typing Specialist",
    },
];

export default function FacultySection({ members, data }: { members?: any[], data?: any }) {
    const [page, setPage] = useState(0);
    const itemsPerPage = 4;

    const title = data?.section_name || "Learn from the Industry Masters";
    const subtitle = data?.subtitle || "Our Faculty";
    
    const displayFaculty = members && members.length > 0 ? members.map((m, i) => ({
        id: m._id || i,
        name: m.name,
        subject: m.position,
        qualification: m.qualification || m.degree || "Expert",
        experience: m.experience || "N/A",
        specialization: m.bio ? m.bio.substring(0, 80) + "..." : m.position + " at NGIT",
        image: m.image
    })) : defaultFaculty;

    const totalPages = Math.ceil(displayFaculty.length / itemsPerPage);
    const visibleFaculty = displayFaculty.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <section id="faculty" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <div className="container px-6 mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
                                {subtitle}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            {title}
                        </h2>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all disabled:opacity-30 disabled:pointer-events-none group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all disabled:opacity-30 disabled:pointer-events-none group"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence mode="wait">
                        {visibleFaculty.map((faculty, idx) => (
                            <motion.div
                                key={faculty.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group h-full"
                            >
                                <div className="h-full flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                                    {/* Status Badge */}
                                    <div className="absolute top-6 right-6 p-2 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative w-40 h-40 mb-8 rounded-[2.5rem] overflow-hidden bg-slate-50 border-8 border-slate-50 group-hover:border-primary/5 transition-all duration-500">
                                        {faculty.image ? (
                                            <Image 
                                                src={faculty.image} 
                                                alt={faculty.name} 
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <GraduationCap className="w-20 h-20" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">
                                            {faculty.name}
                                        </h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            {faculty.subject}
                                        </p>
                                    </div>
                                    
                                    {/* Metrics */}
                                    <div className="w-full grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Exp</p>
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight">{faculty.experience}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Degree</p>
                                            <p className="text-sm font-black text-slate-900 italic tracking-tight">{faculty.qualification}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 w-full">
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic opacity-80 line-clamp-2">
                                            "{faculty.specialization}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Scroll Indicator Dots */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={cn(
                                "transition-all duration-500 rounded-full h-1.5",
                                page === i ? "w-10 bg-primary shadow-lg" : "w-2 bg-slate-200"
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
