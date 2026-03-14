"use client";

import { motion } from "framer-motion";
import { CheckCircle, Target, Eye, BookOpen, Award, Rocket, MonitorPlay } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm uppercase tracking-wider mb-6"
                    >
                        About Us
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight"
                    >
                        National Genius Institute of Technology
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed"
                    >
                        Empowering students with digital skills, practical knowledge, and career guidance for success.
                    </motion.p>
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] transform -rotate-3 scale-105 opacity-20" />
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[500px]">
                            <Image
                                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
                                alt="Students learning in IT lab"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">About NGIT</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                National Genius Institute of Technology (NGIT) is a professional training institute located in Prayagraj. The institute provides a wide range of computer courses, diploma programs, government exam preparation, and typing training in both Hindi and English languages.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                NGIT aims to empower students with digital skills, practical knowledge, and career guidance so they can succeed in competitive exams and professional careers.
                            </p>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Diploma Programs",
                                "Computer Courses",
                                "Govt. Exam Prep",
                                "Typing (Hindi/English)"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                    <span className="font-semibold text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Mission and Vision section */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10" />
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                            <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            To provide affordable and practical education that prepares students for real-world careers and government examinations.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-10 rounded-3xl shadow-xl shadow-purple-900/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10" />
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-8">
                            <Eye className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            To become a leading skill development institute that helps youth build strong digital and professional capabilities.
                        </p>
                    </motion.div>
                </div>

                {/* Statistics / Highlights */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        <div className="space-y-2">
                            <BookOpen className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <h4 className="text-4xl font-extrabold text-blue-400">50+</h4>
                            <p className="text-slate-400 font-medium">Courses Available</p>
                        </div>
                        <div className="space-y-2">
                            <Award className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <h4 className="text-4xl font-extrabold text-purple-400">16+</h4>
                            <p className="text-slate-400 font-medium">Expert Faculty</p>
                        </div>
                        <div className="space-y-2">
                            <Rocket className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                            <h4 className="text-4xl font-extrabold text-emerald-400">100%</h4>
                            <p className="text-slate-400 font-medium">Speed Guarantee</p>
                        </div>
                        <div className="space-y-2">
                            <MonitorPlay className="w-10 h-10 text-orange-400 mx-auto mb-4" />
                            <h4 className="text-4xl font-extrabold text-orange-400">Smart</h4>
                            <p className="text-slate-400 font-medium">Classrooms & Online</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
