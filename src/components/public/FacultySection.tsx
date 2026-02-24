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
}

export default function FacultySection({ members }: FacultySectionProps) {
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;

    // Map DB members to UI format if provided
    const displayFaculty = members && members.length > 0 ? members.map((m, i) => ({
        id: i,
        name: m.name,
        subject: m.position,
        qualification: m.qualification || "Ph.D.",
        experience: "N/A", // Not in DB yet
        specialization: m.bio ? m.bio.substring(0, 30) + "..." : "Expert Faculty"
    })) : defaultFaculty;

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
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Our Faculty
                    </p>
                    <h2 className="heading-2 text-gray-900 mb-4">
                        Learn from the Best Minds
                    </h2>
                    <p className="body text-gray-600">
                        Our expert faculty members from IITs and premier institutions bring years of experience and proven teaching methodologies
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
                                    "card-default text-center group animate-fade-in",
                                    "hover:border-primary transition-all duration-300"
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Avatar */}
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-12 h-12" />
                                </div>

                                {/* Info */}
                                <h3 className="heading-5 text-gray-900 mb-1">
                                    {faculty.name}
                                </h3>
                                <p className="text-sm font-semibold text-primary mb-3">
                                    {faculty.subject}
                                </p>
                                <div className="space-y-2 text-left">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500 font-medium">Qualification:</span>
                                        <span className="text-gray-700 font-semibold">{faculty.qualification}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500 font-medium">Experience:</span>
                                        <span className="text-gray-700 font-semibold">{faculty.experience}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-100">
                                    {faculty.specialization}
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
