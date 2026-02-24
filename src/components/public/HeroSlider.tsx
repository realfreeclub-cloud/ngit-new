"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    cta1Text: string;
    cta1Link: string;
    cta2Text: string;
    cta2Link: string;
}

const defaultSlides: Slide[] = [
    {
        id: 1,
        title: "Shape Your Future at NGIT",
        subtitle: "India's Premier IIT-JEE Coaching Institute",
        description: "Join 5000+ students who achieved their dreams with our expert faculty and proven teaching methodology",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070",
        cta1Text: "Download Prospectus",
        cta1Link: "/prospectus.pdf",
        cta2Text: "Book Free Demo",
        cta2Link: "/register",
    },
    {
        id: 2,
        title: "98% Success Rate in 2025",
        subtitle: "Top Ranks in IIT-JEE & NEET",
        description: "45 students in Top 100 ranks. Experience excellence with NGIT's result-oriented approach",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
        cta1Text: "View Results",
        cta1Link: "/results",
        cta2Text: "Apply Now",
        cta2Link: "/register",
    },
    {
        id: 3,
        title: "World-Class Infrastructure",
        subtitle: "Modern Classrooms • Digital Library • Smart Labs",
        description: "Learn in an environment designed for excellence with AC classrooms, hostel facilities, and 24/7 support",
        image: "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?q=80&w=2070",
        cta1Text: "Virtual Tour",
        cta1Link: "/gallery",
        cta2Text: "Contact Us",
        cta2Link: "/contact",
    },
];

interface HeroSliderProps {
    slides?: Slide[];
}

export default function HeroSlider({ slides: propSlides }: HeroSliderProps) {
    const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
    };

    return (
        <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000",
                        index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-gray-900"
                    >
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex items-center">
                        <div className="container-custom">
                            <div className="max-w-4xl animate-slide-up">
                                <p className="text-accent font-bold text-base md:text-lg uppercase tracking-widest mb-6 inline-block px-4 py-2 bg-accent/10 rounded-lg backdrop-blur-sm">
                                    {slide.subtitle}
                                </p>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mb-8 leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl leading-relaxed font-medium">
                                    {slide.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <Link href={slide.cta1Link}>
                                        <Button className="bg-gradient-to-r from-accent via-accent-dark to-orange-600 hover:from-orange-600 hover:via-accent-dark hover:to-accent text-white font-bold text-lg px-10 py-7 shadow-2xl hover:shadow-accent/50 transition-all duration-300 w-full sm:w-auto">
                                            <FileDown className="w-6 h-6 mr-3" />
                                            {slide.cta1Text}
                                        </Button>
                                    </Link>
                                    <Link href={slide.cta2Link}>
                                        <Button variant="outline" className="w-full sm:w-auto bg-white/15 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold text-lg px-10 py-7 transition-all duration-300">
                                            <Calendar className="w-6 h-6 mr-3" />
                                            {slide.cta2Text}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all group"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            "transition-all duration-300",
                            index === currentSlide
                                ? "w-12 h-2 bg-accent rounded-full"
                                : "w-2 h-2 bg-white/50 hover:bg-white/75 rounded-full"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
