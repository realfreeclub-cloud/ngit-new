"use client";

import { Trophy, Star, Calendar, CheckCircle2, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PublicResultsGridProps {
    results: any[];
}

export default function PublicResultsGrid({ results }: PublicResultsGridProps) {
    if (!results || results.length === 0) {
        return (
            <section className="py-20 bg-slate-50">
                <div className="container px-4 mx-auto text-center">
                    <p className="text-slate-500 font-medium">No official exam results available yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-4">
                            <TrendingUp className="w-4 h-4" /> Live Board
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            Latest Quiz & Exam Performance
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Real student performance data directly from our testing platform. Updates in real-time as students complete their assessments.
                        </p>
                    </div>
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
            </div>
        </section>
    );
}
