"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Phone, Rocket, Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegistrationCTA() {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Dynamic Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl aspect-square bg-primary/20 rounded-full blur-[180px] -z-10 animate-pulse" />
            
            <div className="container px-6 mx-auto relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                        {/* Decorative Icons */}
                        <div className="absolute top-10 left-10 text-white/10 -rotate-12">
                            <Rocket className="w-20 h-20" />
                        </div>
                        <div className="absolute bottom-10 right-10 text-white/10 rotate-12">
                            <Sparkles className="w-20 h-20" />
                        </div>

                        <div className="relative z-20 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                                <Zap className="w-4 h-4 text-secondary animate-pulse" />
                                <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px]">
                                    Admission Open 2024-25
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Success</span> Journey
                            </h2>

                            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto">
                                Join our elite ecosystem of over 5,000 students. Limited capacity per batch for individualized mentorship.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto h-20 px-12 rounded-[2rem] bg-white text-slate-950 hover:bg-slate-200 text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 group">
                                        Initiate Enrollment
                                        <Zap className="w-4 h-4 ml-3 text-primary group-hover:scale-125 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/prospectus.pdf" target="_blank" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto h-20 px-12 rounded-[2rem] border-white/20 text-white hover:bg-white/10 text-sm font-black uppercase tracking-[0.2em] backdrop-blur-xl transition-all hover:border-white/40">
                                        <FileDown className="w-5 h-5 mr-3" />
                                        Download Profile
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-20 border-t border-white/5 opacity-80">
                                <div className="space-y-4">
                                    <p className="text-4xl font-black text-white italic tracking-tighter">15+</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Years Mastery</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <p className="text-4xl font-black text-white italic tracking-tighter">5000+</p>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Students Architected</p>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-4xl font-black text-white italic tracking-tighter">98%</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Deployment Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
