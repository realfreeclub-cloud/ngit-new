"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, UserPlus, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    const [current, setCurrent] = useState(0);

    const fallback = {
        title: "National Genius Institute of Technology",
        subtitle: "Future Ready Education Hub",
        description: "A professional IT training institute providing computer courses, government exam preparation, typing classes, and skill-based education.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
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
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    const content = slides[current];
    const extra = typeof content.extra_data === 'string' ? JSON.parse(content.extra_data || "{}") : (content.extra_data || {});

    return (
        <div className="relative h-[85vh] md:h-[95vh] flex items-center justify-center overflow-hidden bg-[#020617]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background Image with optimized rendering */}
                    {content.image && (
                        <Image 
                            src={content.image} 
                            alt={content.title || "Background"} 
                            fill 
                            className="object-cover opacity-60 scale-100" 
                            priority 
                        />
                    )}

                    {/* Sophisticated Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-slate-950 z-10" />
                    
                    {/* Ambient Glows */}
                    <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-[5000ms] pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-20 px-6 mx-auto">
                <div className="max-w-5xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -30 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="flex flex-col items-center"
                        >
                            {content.subtitle && (
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 mb-10 shadow-xl transition-transform hover:scale-105">
                                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12" />
                                    <span className="text-white text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
                                        {content.subtitle}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.85] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                {content.title}
                            </h1>

                            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed opacity-70 mb-12">
                                {content.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                {content.button_text && (
                                    <Link href={content.button_link || "/register"} className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black bg-white text-slate-950 hover:bg-slate-200 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1">
                                            {content.button_text}
                                        </Button>
                                    </Link>
                                )}
                                
                                {extra.secondary_button_text && (
                                    <Link href={extra.secondary_button_link || "/register"} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:-translate-y-1">
                                            {extra.secondary_button_text}
                                            <ChevronRight className="w-6 h-6 ml-2" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Premium Arrows */}
            {slides.length > 1 && (
                <div className="hidden md:block">
                    <button 
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hover:scale-110"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hover:scale-110"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            )}

            {/* Bottom Navigator Dots Removed per User Request */}
        </div>
    );
}
