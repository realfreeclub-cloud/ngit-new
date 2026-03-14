"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Filter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const galleryCategories = [
    "All", "Classroom Training", "Computer Labs", "Events & Celebrations", "Student Achievements", "Workshops"
];

const galleryItems = [
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070", category: "Computer Labs", title: "Advanced Typing Lab" },
    { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070", category: "Classroom Training", title: "Theory Session" },
    { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070", category: "Events & Celebrations", title: "Dussehra Celebrations" },
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070", category: "Student Achievements", title: "Topper Felicitation" },
    { src: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070", category: "Workshops", title: "Career Guidance Seminar" },
    { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070", category: "Computer Labs", title: "Programming Practice" },
    { src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070", category: "Events & Celebrations", title: "Annual Function" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070", category: "Workshops", title: "Student Workshop on IT" }
];

export default function PublicGalleryPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredItems = activeCategory === "All"
        ? galleryItems
        : galleryItems.filter(i => i.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-10">
                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-widest text-sm"
                    >
                        <Camera className="w-5 h-5" /> NGIT Life
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 leading-tight"
                    >
                        Our Gallery
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
                    >
                        Take a visual tour of our vibrant campus life, modern infrastructure, dynamic events, and the remarkable achievements of our students.
                    </motion.p>
                </div>

                {/* Filter / Categories Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    {galleryCategories.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-3 rounded-full font-bold transition-all text-sm md:text-base cursor-pointer shadow-sm ${
                                activeCategory === category
                                    ? "bg-slate-900 text-white hover:scale-105"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Gallery Grid Section */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-200 cursor-pointer shadow-md hover:shadow-xl"
                            >
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-blue-300 font-bold uppercase tracking-wider text-xs mb-1">
                                        {item.category}
                                    </span>
                                    <h4 className="text-white text-lg font-bold">
                                        {item.title}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-500 font-medium">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p>No photos available in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
