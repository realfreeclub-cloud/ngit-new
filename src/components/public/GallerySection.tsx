"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
    _id: string;
    title: string;
    category: string;
    url: string;
}

export default function GallerySection({ images = [], data }: { images?: GalleryImage[], data?: any }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const title = data?.section_name || "Campus Life at NGIT";
    const subtitle = data?.subtitle || "Gallery";
    const description = data?.description || "Experience the vibrant campus life, modern infrastructure, and memorable moments";

    const openLightbox = (id: string) => {
        setSelectedImage(id);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const goToNext = () => {
        if (selectedImage !== null) {
            const currentIndex = images.findIndex(img => img._id === selectedImage);
            const nextIndex = (currentIndex + 1) % images.length;
            setSelectedImage(images[nextIndex]._id);
        }
    };

    const goToPrev = () => {
        if (selectedImage !== null) {
            const currentIndex = images.findIndex(img => img._id === selectedImage);
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            setSelectedImage(images[prevIndex]._id);
        }
    };

    const selectedImg = images.find(img => img._id === selectedImage);

    return (
        <section className="section-spacing bg-gray-50">
            <div className="container-custom px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 px-4">
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

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.slice(0, 8).map((image) => (
                        <div
                            key={image._id}
                            onClick={() => openLightbox(image._id)}
                            className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative bg-gray-200"
                        >
                            {image.url ? (
                                <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark transition-transform duration-300 group-hover:scale-110"></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="text-center text-white p-4">
                                    <p className="font-semibold mb-1 truncate">{image.title}</p>
                                    <p className="text-xs opacity-90 truncate">{image.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <a href="/gallery" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                        View All Photos
                        <ChevronRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage !== null && selectedImg && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Image */}
                    <div className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden relative">
                        {selectedImg.url ? (
                            <img src={selectedImg.url} alt={selectedImg.title} className="w-full h-full object-contain bg-black" />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center`}>
                                <div className="text-center text-white p-8">
                                    <h3 className="text-3xl font-heading font-bold mb-2">{selectedImg.title}</h3>
                                    <p className="text-lg opacity-90">{selectedImg.category}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-semibold mb-4 text-center">
                        <p className="mb-2 text-xl font-bold">{selectedImg.title}</p>
                        {images.findIndex(img => img._id === selectedImage) + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
