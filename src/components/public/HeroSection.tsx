"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, UserPlus, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const [current, setCurrent] = useState(0);

    // Fallback if no blocks are provided
    const fallback = {
        title: "National Genius Institute of Technology",
        subtitle: "A Place to Learn and Grow Your Future",
        description: "A professional IT training institute providing computer courses, government exam preparation, typing classes, and skill-based education.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
        button_text: "New Admission",
        button_link: "/register"
    };

    const slides = (blocks && blocks.length > 0) ? blocks : [fallback];

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    const content = slides[current];
    const extra = typeof content.extra_data === 'string' ? JSON.parse(content.extra_data || "{}") : (content.extra_data || {});

    return (
        <div className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0"
                >
                    {/* Refined Overlays for better visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80 z-[5]" />
                    <div className="absolute inset-0 bg-slate-950/40 z-[4]" />
                    
                    {/* Enhanced Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-[5000ms]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-[7000ms]" style={{ animationDelay: '2.5s' }} />
                    
                    {content.image && (
                        <Image 
                            src={content.image} 
                            alt={content.title || "Slide Background"} 
                            fill 
                            className="object-cover opacity-80 scale-105 motion-safe:animate-[zoom_20s_infinite_alternate]" 
                            priority 
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-20 px-6 mx-auto pt-20">
                <div className="max-w-5xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -30 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            {content.subtitle && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                >
                                    <Sparkles className="w-5 h-5 text-amber-300" />
                                    <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">
                                        {content.subtitle}
                                    </span>
                                </motion.div>
                            )}

                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                {content.title?.split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i % 2 !== 0 ? "text-primary italic font-serif block md:inline" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg opacity-90">
                                {content.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                                {content.button_text && (
                                    <Link href={content.button_link || "/register"} className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto h-20 px-12 rounded-[2rem] text-xl font-black bg-white text-slate-900 hover:bg-slate-100 shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95 group">
                                            <UserPlus className="w-7 h-7 mr-3 transition-transform group-hover:rotate-12" />
                                            {content.button_text}
                                        </Button>
                                    </Link>
                                )}
                                
                                {extra.secondary_button_text && (
                                    <Link href={extra.secondary_button_link || "/register"} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto h-20 px-12 rounded-[2rem] text-xl font-black text-white border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                                            {extra.secondary_button_text}
                                            <ChevronRight className="w-7 h-7 ml-3" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Slider Controls */}
            {slides.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all backdrop-blur-xl group"
                    >
                        <ChevronLeft className="w-10 h-10 group-active:scale-90" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all backdrop-blur-xl group"
                    >
                        <ChevronRight className="w-10 h-10 group-active:scale-90" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-700 rounded-full h-1.5 ${current === i ? "w-16 bg-primary shadow-[0_0_25px_rgba(59,130,246,0.8)]" : "w-4 bg-white/20 hover:bg-white/40"}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes zoom {
                    from { transform: scale(1.05); }
                    to { transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}
