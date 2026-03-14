"use client";

import { motion } from "framer-motion";
import { Quote, Users, Laptop, TrendingUp, Keyboard } from "lucide-react";
import Image from "next/image";

export default function PublicFacultyPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-10">
                {/* Director Message Section */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-16 text-center">
                    Leadership & Faculty
                </h1>

                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full opacity-50 blur-3xl" />
                    <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <div className="relative w-72 h-72 md:w-96 md:h-96">
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent z-10 rounded-[3rem]" />
                                <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-6 scale-105" />
                                <Image
                                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" // Using an elegant placeholder instead of a missing image
                                    alt="Md. Javed Siddiqui - Director"
                                    fill
                                    className="object-cover rounded-[3rem] shadow-xl z-0"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">
                                Message from Director
                            </div>
                            <div>
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Md. Javed Siddiqui</h2>
                                <h3 className="text-xl text-slate-500 font-medium tracking-wide">Director, National Genius Institute of Technology</h3>
                            </div>

                            <div className="relative mt-10">
                                <Quote className="w-20 h-20 text-blue-100 absolute -top-8 -left-6 -z-10" />
                                <blockquote className="text-2xl text-slate-800 font-medium leading-relaxed italic z-10 relative">
                                    "हर बड़ा सपना छोटे कदमों से शुरू होता है। NGIT में हम सिर्फ कंप्यूटर नहीं सिखाते बल्कि छात्रों को आत्मविश्वास और सफलता की दिशा भी देते हैं।"
                                </blockquote>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Faculty Overview */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Our Exceptional Team</h2>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Learn from industry experts, professional trainers, and seasoned government exam mentors dedicated to your success.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Users className="w-10 h-10 text-blue-600" />, count: "16+", title: "Teaching Faculty", color: "bg-blue-50" },
                        { icon: <Laptop className="w-10 h-10 text-purple-600" />, title: "Professional Trainers", color: "bg-purple-50" },
                        { icon: <TrendingUp className="w-10 h-10 text-emerald-600" />, title: "Govt Exam Mentors", color: "bg-emerald-50" },
                        { icon: <Keyboard className="w-10 h-10 text-orange-600" />, title: "Computer & Typing Instructors", color: "bg-orange-50" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-10 rounded-[2rem] ${item.color} flex flex-col items-center justify-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300`}
                        >
                            <div className="bg-white p-4 rounded-full shadow-sm mb-6">
                                {item.icon}
                            </div>
                            {item.count && <h4 className="text-5xl font-extrabold text-slate-900 mb-3">{item.count}</h4>}
                            <p className="text-xl font-bold text-slate-700 leading-tight">
                                {item.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
