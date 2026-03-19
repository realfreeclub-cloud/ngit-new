"use client";

import { Building2, BookOpen, Wifi, Home, Layout, Cpu, Globe, Users, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const facilities = [
    {
        icon: Building2,
        title: "Adaptive Labs",
        description: "High-performance computational workspaces architected for intensive engineering tasks.",
        gradient: "from-blue-500/20 to-indigo-500/20",
        iconColor: "text-blue-600"
    },
    {
        icon: Globe,
        title: "Gigabit Mesh",
        description: "Enterprise-grade connectivity fabric ensuring zero-latency access to global knowledge.",
        gradient: "from-purple-500/20 to-pink-500/20",
        iconColor: "text-purple-600"
    },
    {
        icon: BookOpen,
        title: "Digital Archive",
        description: "A comprehensive repository of research, synthesis, and industrial case studies.",
        gradient: "from-emerald-500/20 to-teal-500/20",
        iconColor: "text-emerald-600"
    },
    {
        icon: ShieldCheck,
        title: "Secure Hub",
        description: "24/7 monitored environment designed for safety and focused intellectual pursuit.",
        gradient: "from-orange-500/20 to-amber-500/20",
        iconColor: "text-orange-600"
    },
];

export default function InfrastructureSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-1/2 -mt-1/2" />
            
            <div className="container px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-300">
                        Ecosystem
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Engineered for Excellence
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Experience a premium learning environment where advanced infrastructure meets avant-garde pedagogy.
                    </p>
                </div>

                {/* Facilities Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {facilities.map((facility, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="h-full bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center">
                                <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${facility.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <facility.icon className={`w-10 h-10 ${facility.iconColor}`} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                    {facility.title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                    {facility.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Metrics */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-950 p-10 rounded-[2.5rem] text-center border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                        <div className="text-4xl font-black text-white italic tracking-tighter mb-2">120+</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Terminal Capacity</p>
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[2.5rem] text-center border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-transparent" />
                        <div className="text-4xl font-black text-white italic tracking-tighter mb-2">ALWAYS</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Adaptive Access</p>
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[2.5rem] text-center border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                        <div className="text-4xl font-black text-white italic tracking-tighter mb-2">0.5ms</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Network Latency</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
