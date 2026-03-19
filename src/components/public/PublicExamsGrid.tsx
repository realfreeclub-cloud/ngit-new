"use client";

import { FileText, Clock, Target, Calendar, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";

interface PublicExamsGridProps {
    exams: any[];
    data?: any;
}

export default function PublicExamsGrid({ exams, data }: PublicExamsGridProps) {
    const { data: session } = useSession();
    const title = data?.section_name || "Available Practice Assessments";
    const subtitle = data?.subtitle || "MOCK TESTS";
    const description = data?.description || (exams?.length === 0 ? "No public exams are available at the moment. Please check back later for new test series and assignments." : "Challenge yourself with our curated list of mock exams and standard tests to sharpen your skills for final success.");
    
    if (!exams || exams.length === 0) {
        return (
            <section id="exams" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container px-4 mx-auto relative z-10">
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
        <section id="exams" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -ml-64 -mb-64" />

            <div className="container px-4 mx-auto relative z-10">
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((exam, idx) => {
                        const startUrl = session?.user?.role === "STUDENT" 
                            ? `/student/quizzes` 
                            : "/student/login";

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={exam._id}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all group flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                            {exam.courseId?.title || "General"}
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                                            {exam.title}
                                        </h3>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {exam.settings?.timeLimit || 0} Mins
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <Target className="w-4 h-4 text-slate-400" />
                                        {exam.settings?.totalMarks || 0} Marks
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <Link href={startUrl}>
                                        <Button variant="outline" className="rounded-xl font-bold border-2 hover:bg-slate-50">
                                            {session?.user ? "Go to Dashboard" : "Login to Start"}
                                        </Button>
                                    </Link>
                                    <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="mt-12 text-center">
                    <Link href="/exams" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
                        View All Public Exams
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
