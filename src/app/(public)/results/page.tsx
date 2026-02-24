"use client";

import { Button } from "@/components/ui/button";
import {
    Trophy,
    Target,
    Award,
    Star,
    ChevronDown,
    ExternalLink
} from "lucide-react";

export default function ResultsPage() {
    const toppers = [
        { name: "Aryan Malhotra", rank: "AIR 12", exam: "JEE Advanced 2025", score: "99.98 Percentile", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976" },
        { name: "Sanya Gupta", rank: "AIR 45", exam: "NEET UG 2025", score: "705/720 Marks", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972" },
        { name: "Rohan Varma", rank: "AIR 89", exam: "JEE Advanced 2024", score: "99.92 Percentile", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974" },
    ];

    return (
        <div className="pb-32">
            {/* Hero / Header */}
            <section className="bg-slate-50 border-b pt-24 pb-32">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                        <Trophy className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 leading-tight">Legacy of <span className="text-primary">Excellence</span></h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Celebrating the hard work, dedication, and monumental success of our genius students who consistently dominate national entrance exams.
                    </p>
                    <div className="flex justify-center gap-12 pt-8">
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900">500+</p>
                            <p className="text-xs font-black text-primary uppercase tracking-widest">IIT Selections</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200" />
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900">850+</p>
                            <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">NEET Qualifiers</p>
                        </div>
                        <div className="w-px h-12 bg-slate-200" />
                        <div className="text-center">
                            <p className="text-4xl font-black text-slate-900">12k+</p>
                            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Success Stories</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-16">
                {/* Topper Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                    {toppers.map((topper, i) => (
                        <div key={i} className={`bg-white rounded-[3.5rem] p-10 shadow-2xl border-4 ${i === 0 ? 'border-primary' : 'border-slate-50'} relative group hover:-translate-y-4 transition-all duration-500`}>
                            {i === 0 && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                                    Top Achiever
                                </div>
                            )}
                            <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-8 border-8 border-slate-50 ring-4 ring-slate-100 group-hover:ring-primary/20 transition-all">
                                <img src={topper.image} alt={topper.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-black text-slate-900">{topper.name}</h3>
                                <p className="text-primary font-black text-lg tracking-tighter">{topper.rank}</p>
                                <p className="text-slate-500 font-bold text-sm">{topper.exam}</p>
                                <div className="bg-slate-50 py-3 rounded-2xl flex items-center justify-center gap-2 mt-4 border border-slate-100 italic font-bold text-slate-700">
                                    <Award className="w-5 h-5 text-primary" /> {topper.score}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Results List/Table */}
                <div className="bg-white rounded-[4rem] border shadow-sm p-16 space-y-16">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-slate-50 pb-12">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-slate-900">Year-wise Analysis</h2>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Explore our growth and performance over the past decade. We maintain a verified record of all ranks and selections.
                            </p>
                        </div>
                        <Button variant="outline" size="lg" className="h-16 rounded-2xl px-12 border-slate-200 font-bold gap-2">
                            Download Full Result PDF <ChevronDown className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[2025, 2024, 2023, 2022].map((year) => (
                            <div key={year} className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                <h4 className="text-5xl font-black text-slate-200 group-hover:text-primary/10 transition-colors absolute -mt-4 -ml-4">{year}</h4>
                                <div className="relative z-10 space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Year</p>
                                        <p className="text-2xl font-black text-slate-900">{year} Result Highlights</p>
                                    </div>
                                    <ul className="space-y-3 font-medium text-slate-600">
                                        <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> 50+ AIR Under 100</li>
                                        <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> 98% Qualifiers</li>
                                        <li className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Highest Score: 99.9%</li>
                                    </ul>
                                    <Button variant="ghost" className="p-0 text-primary font-bold gap-2 hover:bg-transparent group-hover:gap-4 transition-all">
                                        Detailed View <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Parent Testimonials about results */}
            <section className="container mx-auto px-4 mt-32">
                <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-5">
                    <h2 className="text-5xl font-black text-slate-900">From the Parents</h2>
                    <p className="text-slate-500 text-lg">Real feedback from families of our top achievers.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="flex gap-1 mb-8">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                            </div>
                            <p className="text-xl text-slate-700 font-medium leading-relaxed italic mb-8">
                                "The personal attention my son received at NGIT was exceptional. The strategy for Mock Tests really helped him clear JEE with a top rank."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100" />
                                <div>
                                    <p className="text-lg font-black text-slate-900">Parent of AIR {12 * i}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Delhi, India</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
