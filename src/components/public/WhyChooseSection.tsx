"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BookOpen, Globe, MonitorPlay, CheckCircle, GraduationCap } from "lucide-react";

const staticReasons = [
    { icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, title: "Trusted IT Institute", desc: "Recognized and trusted training center with years of excellence." },
    { icon: <BookOpen className="w-8 h-8 text-purple-600" />, title: "Affordable Diplomas", desc: "High-quality diploma programs at fee structures you can afford." },
    { icon: <Globe className="w-8 h-8 text-emerald-600" />, title: "Hindi & English", desc: "Flexible learning formats available in both languages." },
    { icon: <MonitorPlay className="w-8 h-8 text-orange-600" />, title: "Smart & Online Classes", desc: "State-of-the-art smart classrooms and online learning support." },
    { icon: <CheckCircle className="w-8 h-8 text-pink-600" />, title: "50+ Courses", desc: "A wide variety of courses from basic computer skills to university degrees." },
    { icon: <GraduationCap className="w-8 h-8 text-indigo-600" />, title: "Govt. Exam Support", desc: "Dedicated preparation and guidance for competitive government exams." }
];

export default function WhyChooseSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const title = data?.section_name || "Why Choose NGIT";
    const subtitle = data?.subtitle || "Why NGIT?";
    
    // Default icons for dynamic content
    const icons = [
        <ShieldCheck className="w-8 h-8 text-blue-600" />,
        <BookOpen className="w-8 h-8 text-purple-600" />,
        <Globe className="w-8 h-8 text-emerald-600" />,
        <MonitorPlay className="w-8 h-8 text-orange-600" />,
        <CheckCircle className="w-8 h-8 text-pink-600" />,
        <GraduationCap className="w-8 h-8 text-indigo-600" />
    ];

    const displayReasons = blocks && blocks.length > 0 ? blocks.map((b, i) => ({
        icon: icons[i % icons.length],
        title: b.title,
        desc: b.description
    })) : staticReasons;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-10 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold uppercase tracking-widest text-sm mb-4">
                        {subtitle}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        We don't just teach computers; we build your confidence and guide you toward success in both government and private sectors.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayReasons.map((reason, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                {reason.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{reason.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                {reason.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10" />
        </section>
    );
}
