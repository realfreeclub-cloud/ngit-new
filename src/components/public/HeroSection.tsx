"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, FileText, Download, TrendingUp, Users, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function HeroSection({ blocks }: { blocks?: any[] }) {
    const defaultBlock = {
        title: "A Place to Learn and Grow Your Future",
        subtitle: "India's Premier IT & Academic Hub",
        description: "Empowering the next generation of tech leaders with cutting-edge vocational training, government exam prep, and specialized computer education.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
        buttons: null
    };

    const sliderBlocks = (blocks && blocks.length > 0) ? blocks : [defaultBlock];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (sliderBlocks.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliderBlocks.length);
        }, 6000);
        
        return () => clearInterval(interval);
    }, [sliderBlocks.length]);

    const heroData = sliderBlocks[currentIndex];

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % sliderBlocks.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + sliderBlocks.length) % sliderBlocks.length);

    return (
        <section className="relative min-h-[90vh] lg:h-screen flex items-center pt-20 pb-16 overflow-hidden bg-slate-950">
            {/* Advanced Background Layers with Cross-Fade */}
            <div className="absolute inset-0 z-0">
                {sliderBlocks.map((block: any, idx: number) => {
                    const extra = typeof block.extra_data === 'object' ? block.extra_data : {};
                    const hasValidImage = !!block.image;
                    const safeImage = block.image || defaultBlock.image;
                    
                    const isTextEmpty = !block.title?.trim() && !block.subtitle?.trim() && !block.description?.trim() && (!block.buttons || block.buttons.length === 0 || !block.buttons.some((b: any) => b.label?.trim()));

                    const defaultImageOp = isTextEmpty ? 1 : (hasValidImage ? 0.6 : 0.2);
                    const defaultGradOp = isTextEmpty ? 0 : (hasValidImage ? 0.5 : 1);

                    const imageOp = extra?.image_opacity !== undefined && extra?.image_opacity !== "" ? Number(extra.image_opacity) / 100 : defaultImageOp;
                    const gradOp = extra?.gradient_opacity !== undefined && extra?.gradient_opacity !== "" ? Number(extra.gradient_opacity) / 100 : defaultGradOp;
                    const colorOverlay = extra?.overlay_color || "";

                    return (
                        <div 
                            key={idx}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-1000",
                                idx === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                            style={colorOverlay.startsWith('#') || colorOverlay.startsWith('rgb') ? { backgroundColor: colorOverlay } : {}}
                        >
                            {colorOverlay.startsWith('bg-') && <div className={`absolute inset-0 ${colorOverlay}`} />}
                            <Image
                                src={safeImage}
                                alt={block.title || "Education Background"}
                                fill
                                sizes="100vw"
                                className="object-cover scale-105 transition-opacity"
                                style={{ opacity: imageOp }}
                                priority={idx === 0}
                            />
                            {!isTextEmpty && (
                                <div 
                                    className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-primary/10 transition-opacity" 
                                    style={{ opacity: gradOp }}
                                />
                            )}
                        </div>
                    );
                })}
                
                {/* Tech Grid Effect */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Aurora Glows */}
                {!(
                    !heroData.title?.trim() && 
                    !heroData.subtitle?.trim() && 
                    !heroData.description?.trim() && 
                    (!heroData.buttons || heroData.buttons.length === 0 || !heroData.buttons.some((b: any) => b.label?.trim()))
                ) && (
                    <>
                        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]" />
                        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[6000ms]" />
                    </>
                )}
            </div>

            <div className="container relative z-10 px-6 mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Left Content */}
                    <div className={cn(
                        "lg:col-span-7 space-y-10 text-center lg:text-left min-h-[400px] flex flex-col justify-center",
                        (!heroData.title?.trim() && !heroData.subtitle?.trim() && !heroData.description?.trim() && (!heroData.buttons || heroData.buttons.length === 0 || !heroData.buttons.some((b: any) => b.label?.trim()))) && "hidden lg:flex opacity-0 pointer-events-none"
                    )}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                {heroData.subtitle && (
                                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                        <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">
                                            {heroData.subtitle}
                                        </span>
                                    </div>
                                )}

                                {heroData.title && (
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                                        {(heroData.title || "").split(' ').map((word: string, i: number) => (
                                            <span key={i} className={i % 3 === 2 ? "text-gradient block md:inline" : ""}>
                                                {word}{" "}
                                            </span>
                                        ))}
                                    </h1>
                                )}

                                {heroData.description && (
                                    <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                        {heroData.description}
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {(heroData.buttons && heroData.buttons.length > 0 && heroData.buttons.some((b: any) => b.label?.trim())) && (
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4"
                                >
                                    {heroData.buttons[0]?.label && (
                                        <Link href={heroData.buttons[0].link || "/register"} className="w-full sm:w-auto">
                                            <Button className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black bg-white text-slate-900 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 group">
                                                <UserPlus className="w-6 h-6 mr-3 transition-transform group-hover:rotate-12" />
                                                {heroData.buttons[0].label}
                                            </Button>
                                        </Link>
                                    )}

                                    {heroData.buttons[1]?.label && (
                                        <Link href={heroData.buttons[1].link || "/prospectus"} className="w-full sm:w-auto">
                                            <Button variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-lg font-black text-white border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                                                <Download className="w-6 h-6 mr-3" />
                                                {heroData.buttons[1].label}
                                            </Button>
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Lean Trust bar for mobile */}
                        <div className="lg:hidden flex items-center justify-center gap-8 pt-6 opacity-40 grayscale">
                            <span className="text-xs font-black text-white uppercase tracking-widest">ISO Certified</span>
                            <span className="text-xs font-black text-white uppercase tracking-widest">NIELIT Affiliated</span>
                        </div>
                    </div>

                    {/* Right Visual / Floating Cards */}
                    <div className={cn(
                        "lg:col-span-5 relative hidden lg:block",
                        (!heroData.title?.trim() && !heroData.subtitle?.trim() && !heroData.description?.trim()) && "opacity-0 pointer-events-none"
                    )}>
                        <div className="relative aspect-square w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                            </div>

                            {/* Floating Stats Cards */}
                            {(() => {
                                const extra = typeof heroData?.extra_data === 'string' ? JSON.parse(heroData.extra_data || "{}") : (heroData?.extra_data || {});
                                const stats = extra.floating_stats || [
                                    { label: "Years Experience", value: "15+", icon: 'TrendingUp', color: "text-primary", bg: "bg-primary/20", pos: "top-10 right-10", delay: 0 },
                                    { label: "Students Trained", value: "5000+", icon: 'Users', color: "text-secondary", bg: "bg-secondary/20", pos: "bottom-20 left-0", delay: 1 },
                                    { label: "Success Rate", value: "98%", icon: 'Award', color: "text-emerald-400", bg: "bg-emerald-500/20", pos: "bottom-40 right-4", delay: 2 }
                                ];

                                return stats.map((stat: any, idx: number) => {
                                    const Icon = stat.icon === 'Users' ? Users : stat.icon === 'Award' ? Award : TrendingUp;
                                    return (
                                        <motion.div
                                            key={idx}
                                            animate={idx === 2 ? { scale: [1, 1.05, 1] } : { y: idx === 0 ? [0, -20, 0] : [0, 20, 0] }}
                                            transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut", delay: stat.delay || 0 }}
                                            className={cn("absolute p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-colors cursor-default", stat.pos)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", stat.bg || "bg-primary/20", stat.color || "text-primary")}>
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-3xl font-black text-white">{stat.value}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation & Controls */}
            {sliderBlocks.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center transition-all group"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {sliderBlocks.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "transition-all duration-300",
                                    idx === currentIndex
                                        ? "w-8 h-2 bg-primary rounded-full shadow-[0_0_10px_theme('colors.primary.DEFAULT')]"
                                        : "w-2 h-2 bg-white/20 hover:bg-white/50 rounded-full"
                                )}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 hidden md:flex flex-col items-center gap-2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-2 opacity-30">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
