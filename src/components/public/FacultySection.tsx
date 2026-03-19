"use client";

import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Faculty {
    id: number;
    name: string;
    subject: string;
    qualification: string;
    experience: string;
    specialization: string;
}

const defaultFaculty: Faculty[] = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        subject: "Physics",
        qualification: "Ph.D. (IIT Delhi)",
        experience: "15 Years",
        specialization: "Mechanics & Thermodynamics",
    },
    {
        id: 2,
        name: "Prof. Anita Sharma",
        subject: "Chemistry",
        qualification: "M.Sc. (IIT Bombay)",
        experience: "12 Years",
        specialization: "Organic & Inorganic Chemistry",
    },
    {
        id: 3,
        name: "Dr. Vikram Singh",
        subject: "Mathematics",
        qualification: "Ph.D. (IIT Kanpur)",
        experience: "18 Years",
        specialization: "Calculus & Algebra",
    },
    {
        id: 4,
        name: "Prof. Priya Patel",
        subject: "Biology",
        qualification: "M.Sc. (AIIMS Delhi)",
        experience: "10 Years",
        specialization: "Botany & Zoology",
    },
];

interface FacultySectionProps {
    members?: any[];
    data?: any;
}

export default function FacultySection({ members, data }: FacultySectionProps) {
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;

    const title = data?.section_name || "Learn from the Best Minds";
    const subtitle = data?.subtitle || "Our Faculty";
    const description = data?.description || "Our expert faculty members from IITs and premier institutions bring years of experience and proven teaching methodologies";

    // Map DB members to UI format if provided
    const displayFaculty = members && members.length > 0 ? members.map((m, i) => ({
        id: m._id || i,
        name: m.name,
        subject: m.position,
        qualification: m.qualification || m.degree || "Degree",
        experience: m.experience || "N/A",
        specialization: m.bio ? m.bio.substring(0, 100) + "..." : "Expert Faculty",
        image: m.image
    })) : (defaultFaculty as any[]).map(f => ({ ...f, image: null }));

    const canGoNext = startIndex + itemsPerPage < displayFaculty.length;
    const canGoPrev = startIndex > 0;

    const nextSlide = () => {
        if (canGoNext) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (canGoPrev) {
            setStartIndex(startIndex - 1);
        }
    };

    const visibleFaculty = displayFaculty.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section id="faculty" className="section-spacing bg-white">
            <div className="container-custom px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-3">
                        {subtitle}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600">
                        {description}
                    </p>
                </div>

                {/* Faculty Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {canGoPrev && (
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-strong rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                            aria-label="Previous faculty"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                    )}
                    {canGoNext && (
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-strong rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                            aria-label="Next faculty"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                    )}

                    {/* Faculty Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleFaculty.map((faculty, index) => (
                            <div
                                key={faculty.id}
                                className={cn(
                                    "card-default text-center group animate-fade-in bg-white border border-slate-100 hover:shadow-2xl hover:border-primary/50",
                                    "transition-all duration-500 rounded-3xl p-8"
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Avatar */}
                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                                    {faculty.image ? (
                                        <img 
                                            src={faculty.image} 
                                            alt={faculty.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white">
                                            <GraduationCap className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                    {faculty.name}
                                </h3>
                                <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
                                    {faculty.subject}
                                </p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-xs py-2 px-4 bg-slate-50 rounded-xl">
                                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Degree</span>
                                        <span className="text-slate-900 font-black">{faculty.qualification}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs py-2 px-4 bg-slate-50 rounded-xl">
                                        <span className="text-slate-400 font-bold uppercase tracking-tighter">Exp</span>
                                        <span className="text-slate-900 font-black">{faculty.experience}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 italic line-clamp-2">
                                    "{faculty.specialization}"
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(displayFaculty.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setStartIndex(index * itemsPerPage)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    Math.floor(startIndex / itemsPerPage) === index
                                        ? "w-8 bg-primary"
                                        : "bg-gray-300 hover:bg-gray-400"
                                )}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
