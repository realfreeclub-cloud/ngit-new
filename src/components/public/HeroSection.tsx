"use client";

import { motion } from "framer-motion";
import { UserPlus, Sparkles, FileText, Download, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ blocks }: { blocks?: any[] }) {
    // We'll use the first block if provided, otherwise fallback to our premium defaults
    const heroData = (blocks && blocks.length > 0) ? blocks[0] : {
        title: "A Place to Learn and Grow Your Future",
        subtitle: "India's Premier IT & Academic Hub",
        description: "Empowering the next generation of tech leaders with cutting-edge vocational training, government exam prep, and specialized computer education.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
    };

    return (
        <section className="relative min-h-[90vh] lg:h-screen flex items-center pt-20 pb-16 overflow-hidden bg-slate-950">
            {/* Advanced Background Layers */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroData.image}
                    alt="Education Background"
                    fill
                    className="object-cover opacity-20 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-primary/10" />
                
                {/* Tech Grid Effect */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Aurora Glows */}
                <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]" />
                <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[6000ms]" />
            </div>

            <div className="container relative z-10 px-6 mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">
                                    {heroData.subtitle}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                                {heroData.title.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i % 3 === 2 ? "text-gradient block md:inline" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                {heroData.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black bg-white text-slate-900 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 group">
                                    <UserPlus className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
                                    New Admission
                                </Button>
                            </Link>

                            <Link href="/prospectus" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                                    <Download className="w-6 h-6 mr-3" />
                                    Prospectus
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Lean Trust bar for mobile */}
                        <div className="lg:hidden flex items-center justify-center gap-8 pt-6 opacity-40 grayscale">
                            <span className="text-xs font-black text-white uppercase tracking-widest">ISO Certified</span>
                            <span className="text-xs font-black text-white uppercase tracking-widest">NIELIT Affiliated</span>
                        </div>
                    </div>

                    {/* Right Visual / Floating Cards */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <div className="relative aspect-square w-full">
                            {/* Central Image or Illustration could go here, for now we use floating cards */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                            </div>

                            {/* Floating Stats Card 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-colors cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                        <TrendingUp className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white">15+</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years Experience</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stats Card 2 */}
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 left-0 p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-colors cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary shadow-inner">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white">5000+</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students Trained</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stats Card 3 */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                className="absolute bottom-40 right-4 p-6 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                        <Award className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-white">98%</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 hidden md:block"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-2 opacity-30">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
