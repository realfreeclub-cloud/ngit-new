import { getDynamicPageData } from "@/app/actions/cms";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { motion } from "framer-motion";
import { Quote, Users, Laptop, TrendingUp, Keyboard } from "lucide-react";
import Image from "next/image";

const staticFallbackContent = (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-16 text-center">
                Leadership & Faculty
            </h1>
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 mb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full opacity-50 blur-3xl" />
                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="flex justify-center">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent z-10 rounded-[3rem]" />
                            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-6 scale-105" />
                            <Image
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" 
                                alt="Md. Javed Siddiqui - Director"
                                fill
                                className="object-cover rounded-[3rem] shadow-xl z-0"
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">
                            Message from Director
                        </div>
                        <div>
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Md. Javed Siddiqui</h2>
                            <h3 className="text-xl text-slate-500 font-medium tracking-wide">Director, National Genius Institute of Technology</h3>
                        </div>
                        <div className="relative mt-10">
                            <Quote className="w-20 h-20 text-blue-100 absolute -top-8 -left-6 -z-10" />
                            <blockquote className="text-2xl text-slate-800 font-medium leading-relaxed italic z-10 relative">
                                "हर बड़ा सपना छोटे कदमों से शुरू होता है। NGIT में हम सिर्फ कंप्यूटर नहीं सिखाते बल्कि छात्रों को आत्मविश्वास और सफलता की दिशा भी देते हैं।"
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default async function PublicFacultyPage() {
    const dynamicData = await getDynamicPageData("faculty");
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer sections={cmsSections} staticFallback={staticFallbackContent} />
        </div>
    );
}
