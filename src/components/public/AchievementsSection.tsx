"use client";

import { Trophy, Medal, Award, Star, User } from "lucide-react";
import Image from "next/image";

interface AchievementsSectionProps {
    data?: any;
    blocks?: any[];
}

export default function AchievementsSection({ data, blocks }: AchievementsSectionProps) {
    const title = data?.section_name || "Success Stories";
    const subtitle = data?.subtitle || "Our Top Achievers";
    
    // Default data if no blocks are provided
    const defaultRankers = [
        {
            title: "Rahul Sharma",
            subtitle: "AIR 23",
            description: "IIT-JEE 2025 - IIT Bombay (CS)",
            extra_data: JSON.stringify({ rank: "AIR 23", category: "manual" })
        }
    ];

    const displayRankers = blocks && blocks.length > 0 ? blocks : defaultRankers;

    return (
        <section id="results" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">
                        {subtitle}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-300">
                        Celebrating excellence with our students who achieved top ranks in prestigious examinations and career milestones.
                    </p>
                </div>

                {/* Top Achievers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {displayRankers.map((ranker, index) => {
                        const extra = typeof ranker.extra_data === 'string' ? JSON.parse(ranker.extra_data || "{}") : (ranker.extra_data || {});
                        
                        return (
                            <div
                                key={ranker._id || index}
                                className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-16 h-16 shrink-0">
                                        {ranker.image ? (
                                            <Image src={ranker.image} alt={ranker.title} fill className="object-cover rounded-2xl" />
                                        ) : (
                                            <div className="w-full h-full bg-blue-500/20 rounded-2xl flex items-center justify-center">
                                                <User className="w-8 h-8 text-blue-400" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 rounded-lg p-1 shadow-lg">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{ranker.title}</h3>
                                        <span className="text-blue-400 font-bold text-sm uppercase tracking-wider">{ranker.subtitle}</span>
                                    </div>
                                </div>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                    {ranker.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
