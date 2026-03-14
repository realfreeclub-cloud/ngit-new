"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, GraduationCap, Keyboard, Ribbon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const courseCategories = [
    {
        title: "Computer Courses",
        icon: <Monitor className="w-10 h-10 text-blue-500" />,
        description: "Professional IT and computer application programs.",
        courses: ["CCC", "O Level", "DCA", "ADCA", "DOAP", "PGDCA", "Tally with GST"],
        color: "bg-blue-50",
        borderColor: "border-blue-100"
    },
    {
        title: "University Courses",
        icon: <GraduationCap className="w-10 h-10 text-purple-500" />,
        description: "Degree programs to build your academic foundation.",
        courses: ["BCA", "BBA", "BA", "B.Com", "MA", "MBA"],
        color: "bg-purple-50",
        borderColor: "border-purple-100"
    },
    {
        title: "Skill Courses",
        icon: <Keyboard className="w-10 h-10 text-orange-500" />,
        description: "Practical skills for immediate employment opportunities.",
        courses: ["Hindi Typing", "English Typing", "Shorthand (Hindi & English)", "Spoken English"],
        color: "bg-orange-50",
        borderColor: "border-orange-100"
    },
    {
        title: "Special Programs",
        icon: <Ribbon className="w-10 h-10 text-emerald-500" />,
        description: "Specialized training and government exam preparation.",
        courses: ["Yoga Teacher Diploma", "Government Exam Preparation", "Online Test Series"],
        color: "bg-emerald-50",
        borderColor: "border-emerald-100"
    }
];

export default function PublicCoursesPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header / Hero */}
            <section className="relative overflow-hidden mb-16 px-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 rounded-3xl mx-4 lg:mx-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay rounded-3xl mx-4 lg:mx-10" />
                
                <div className="relative z-10 container mx-auto px-4 py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-200 font-semibold text-sm uppercase tracking-wider mb-6 backdrop-blur-md"
                    >
                        Our Programs
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto"
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">50+ Courses</span> in Hindi & English
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Whether you are looking for computer training, university degrees, or government exam preparation, NGIT has a course designed for your success.
                    </motion.p>
                </div>
            </section>

            {/* Courses Categories Grid */}
            <div className="container mx-auto px-4 lg:px-10">
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {courseCategories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-[2rem] bg-white border ${category.borderColor} shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
                        >
                            <div className={`w-20 h-20 rounded-2xl ${category.color} flex items-center justify-center mb-6`}>
                                {category.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">{category.title}</h3>
                            <p className="text-slate-600 mb-8 text-lg">{category.description}</p>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                                {category.courses.map((course, cIdx) => (
                                    <div key={cIdx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <span className="font-medium text-slate-700">{course}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Admission CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-blue-600 rounded-[3rem] p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Ready to start your journey?</h2>
                        <p className="text-xl text-blue-100 font-medium">
                            Join NGIT today and take the first step towards a successful career. Admissions are currently open!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/register">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-white text-blue-600 hover:bg-slate-100 rounded-full shadow-lg hover:scale-105 transition-transform">
                                    Apply for Admission
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold border-white/30 text-white hover:bg-white/10 rounded-full hover:scale-105 transition-transform">
                                    Contact Counselor <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
