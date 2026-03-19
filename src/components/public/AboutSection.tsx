"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Laptop, Award, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const defaultAbout = {
    title: "National Genius Institute of Technology",
    subtitle: "Empowering Since 2009",
    description: "National Genius Institute of Technology (NGIT) is a professional training institute located in Prayagraj. The institute provides a wide range of computer courses, diploma programs, government exam preparation, and typing training in both Hindi and English languages.\n\nNGIT aims to empower students with digital skills, practical knowledge, and career guidance so they can succeed in competitive exams and professional careers.",
};

export default function AboutSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const blockData = blocks && blocks.length > 0 ? blocks[0] : null;
    
    const about = blockData ? {
        title: blockData.title || data?.title || defaultAbout.title,
        subtitle: blockData.subtitle || data?.subtitle || defaultAbout.subtitle,
        description: blockData.description || data?.description || defaultAbout.description,
        image: blockData.image || data?.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
    } : { ...defaultAbout, ...data };

    const descriptionParas = typeof about.description === 'string' ? about.description.split('\n\n') : [about.description];

    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-slate-50 rounded-bl-[10rem] -z-10" />
            
            <div className="container px-6 mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Visual Side (Right-aligned in layout, but left in DOM for mobile first) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                            <Image 
                                src={about.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"} 
                                alt="NGIT Learning Environment" 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            {/* Overlay Card */}
                            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900 leading-none">ISO Certified</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Quality Guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating Badge */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white animate-float hidden md:flex">
                            <p className="text-4xl font-black italic">15+</p>
                            <p className="text-[10px] font-black uppercase tracking-tighter">Years of Legacy</p>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                                <Zap className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                    {about.subtitle}
                                </span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                                {about.title}
                            </h2>

                            <div className="space-y-4">
                                {descriptionParas.map((para: string, idx: number) => (
                                    <p key={idx} className="text-lg text-slate-500 font-medium leading-relaxed">
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Point Grid */}
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                                    <Users className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-slate-800">Expert Faculty</p>
                            </div>
                            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                                    <Laptop className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-slate-800">Hands-on Lab</p>
                            </div>
                            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                                    <Award className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-slate-800">Job Placement</p>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-slate-950 text-white hover:bg-slate-800 shadow-xl transition-all hover:scale-105 group">
                                    Read Full Story
                                    <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                        <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" width={40} height={40} />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white">
                                    +5K
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Graduated Students</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
