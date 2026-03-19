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

    const slides = (blocks && blocks.length > 0) ? blocks : 
                   ((data as any)?.slides?.length > 0 ? (data as any).slides : [fallback]);

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
        <div className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0"
                >
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-slate-950 z-0" />

                    {content.image && (
                        <Image
                            src={content.image}
                            alt={content.title || "Slide Background"}
                            fill
                            className="object-cover opacity-80 scale-105 motion-safe:animate-[zoom_20s_infinite_alternate] z-10"
                            priority
                        />
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20 z-20" />

                    {/* Radial Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms] z-30" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[6000ms] z-30" style={{ animationDelay: '2s' }} />
                </motion.div>
            </AnimatePresence>

            <div className="container relative z-40 px-6 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            {content.subtitle && (
                                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <span className="text-white font-black uppercase tracking-widest text-[10px]">
                                        {content.subtitle}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                                {(content.title || "").split(' ').map((word: string, i: number) => (
                                    <span key={i} className={i % 2 !== 0 ? "text-primary italic font-serif" : ""}>
                                        {word}{" "}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
                                {content.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                                {content.button_text && (
                                    <Link href={content.button_link || "/register"} className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black bg-white text-slate-900 hover:bg-slate-100 shadow-2xl transition-all hover:scale-105 group">
                                            <UserPlus className="w-6 h-6 mr-2 transition-transform group-hover:rotate-12" />
                                            {content.button_text}
                                        </Button>
                                    </Link>
                                )}

                                {extra.secondary_button_text && (
                                    <Link href={extra.secondary_button_link || "/register"} className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
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

            {/* Slider Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-md"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
                        {slides.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-500 rounded-full h-1.5 ${current === i ? "w-10 bg-primary shadow-[0_0_15px_rgba(37,99,235,0.8)]" : "w-2.5 bg-white/20"}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.15); }
                }
            `}</style>
        </div>
    );
}
