"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function DirectorMessageSection({ data, director }: { data?: any, director?: any }) {
    if (!director) return null;

    const title = data?.title || "Message from Director";
    const bg_color = data?.bg_color || "bg-slate-900";

    return (
        <section className={`py-24 ${bg_color} relative overflow-hidden`}>
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-0 opacity-50" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Image Column */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center"
                    >
                        <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] group">
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 bg-primary/30 rounded-[4rem] rotate-6 scale-105 blur-2xl group-hover:rotate-12 transition-transform duration-1000" />
                            
                            <div className="relative w-full h-full overflow-hidden rounded-[4rem] border-8 border-white/5 shadow-2xl z-10">
                                {director.image ? (
                                    <Image
                                        src={director.image} 
                                        alt={director.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white text-3xl font-black">
                                        NGIT
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light font-black text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {title}
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                                {director.name}
                            </h2>
                            <div className="h-1.5 w-24 bg-primary rounded-full" />
                            <h3 className="text-xl md:text-2xl text-primary font-black uppercase tracking-widest italic font-serif">
                                {director.position}
                            </h3>
                        </div>

                        <div className="relative group">
                            <Quote className="w-24 h-24 text-primary opacity-20 absolute -top-12 -left-10 group-hover:scale-110 transition-transform" />
                            <div className="relative bg-white/5 p-10 md:p-14 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                                <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic relative z-10">
                                    "{director.bio || "At NGIT, our mission is to empower the next generation with cutting-edge technical skills and professional direction."}"
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
