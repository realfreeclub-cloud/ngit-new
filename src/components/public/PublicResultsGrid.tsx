"use client";

import { Trophy, Star, Calendar, CheckCircle2, TrendingUp, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface PublicResultsGridProps {
    results: any[];
    data?: any;
}

export default function PublicResultsGrid({ results, data }: PublicResultsGridProps) {
    const title = data?.section_name || "Latest Performance & Rankings";
    const subtitle = data?.subtitle || "LIVE BOARD";
    const description = data?.description || (results?.length === 0 ? "No official exam results are available at this moment. Check back soon for updates on student performance." : "Real-time updates on student achievements and test outcomes directly from our official evaluation platform.");
    if (!results || results.length === 0) {
        return (
            <section id="results" className="py-24 bg-white">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-3">
                            {subtitle}
                        </p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                            {title}
                        </h2>
                        <p className="text-lg text-slate-600">
                            {description}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="results" className="py-24 bg-white">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-3">
                        {subtitle}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600">
                        {description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={item._id}
                            className="bg-slate-50 rounded-3xl p-6 border border-slate-200 hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative w-12 h-12">
                                    {item.studentId?.photoUrl ? (
                                        <Image src={item.studentId.photoUrl} alt={item.studentId.name} fill className="rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                            {item.studentId?.name?.charAt(0) || <User className="w-5 h-5" />}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full" />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-slate-900 truncate">{item.studentId?.name || "Anonymous Student"}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.quizId?.title}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Score</span>
                                    <span className="font-black text-blue-600 text-lg">
                                        {item.totalScore} / {item.totalMarks}
                                    </span>
                                </div>
                                
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(item.totalScore / item.totalMarks) * 100}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(item.endTime).toLocaleDateString()}
                                    </div>
                                    {item.isPassed && (
                                        <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase tracking-tighter">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link href="/results" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
                        View Full Performance Board
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
