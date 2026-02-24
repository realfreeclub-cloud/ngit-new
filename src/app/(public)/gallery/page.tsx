"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getGalleryImages } from "@/app/actions/upload";
import {
    Camera,
    Map as MapIcon,
    Trophy,
    Users,
    Maximize2
} from "lucide-react";

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [images, setImages] = useState<any[]>([]);

    const categories = [
        { label: "All", icon: Camera },
        { label: "Campus", icon: MapIcon },
        { label: "Events", icon: Trophy },
        { label: "Students", icon: Users },
    ];

    useEffect(() => {
        getGalleryImages().then(res => {
            if (res.success && res.images) {
                setImages(res.images.map((img: any) => ({
                    id: img._id,
                    title: img.title || "Untitled",
                    category: img.category || "Others",
                    url: img.url
                })));
            }
        });
    }, []);

    const filteredImages = activeFilter === "All"
        ? images
        : images.filter(img => img.category === activeFilter);

    return (
        <div className="pb-32">
            {/* Header */}
            <section className="bg-slate-900 text-white py-24 mb-16">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <h1 className="text-5xl font-black">Life at NGIT</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Explore our state-of-the-art campus and the vibrant life of genius minds at the National Genius Institute of Technology.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4">
                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveFilter(cat.label)}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${activeFilter === cat.label
                                ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105"
                                : "bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-slate-100">
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 overflow-hidden">
                                <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">{img.category}</p>
                                <h3 className="text-white text-xl font-bold">{img.title}</h3>
                                <Button size="icon" className="absolute right-8 bottom-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    <Maximize2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        No images found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
