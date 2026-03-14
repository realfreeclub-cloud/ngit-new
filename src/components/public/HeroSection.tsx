"use client";

import { motion } from "framer-motion";
import { ChevronRight, FileDown, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ data, blocks }: { data?: any, blocks?: any[] }) {
    // If no data is provided, we can use the default static content or the first block
    const content = blocks?.[0] || {
        title: "National Genius Institute of Technology",
        subtitle: "A Place to Learn and Grow Your Future",
        description: "A professional IT training institute providing computer courses, government exam preparation, typing classes, and skill-based education.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
        button_text: "New Admission",
        button_link: "/register"
    };

    const extra = typeof content.extra_data === 'string' ? JSON.parse(content.extra_data || "{}") : (content.extra_data || {});

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40 z-10" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                {content.image && (
                    <Image src={content.image} alt="Background" fill className="opacity-30 object-cover mix-blend-overlay" priority />
                )}
            </div>

            <div className="container relative z-20 px-4 py-20 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    {content.subtitle && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
                        >
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-100 font-medium tracking-wide">
                                {content.subtitle}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="block text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-6 leading-tight"
                    >
                        {content.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
                    >
                        {content.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {content.button_text && (
                            <Link href={content.button_link || "/register"}>
                                <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105">
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    {content.button_text}
                                </Button>
                            </Link>
                        )}
                        
                        {extra.secondary_button_text && (
                            <Link href={extra.secondary_button_link || "/register"}>
                                <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-purple-600 hover:bg-purple-500 text-white border-none shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] transition-all hover:scale-105">
                                    <ChevronRight className="w-5 h-5 mr-2" />
                                    {extra.secondary_button_text}
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
