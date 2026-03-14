import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Target, Award, Rocket, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const defaultAbout = {
    title: "National Genius Institute of Technology",
    subtitle: "About NGIT",
    description: "National Genius Institute of Technology (NGIT) is a professional training institute located in Prayagraj. The institute provides a wide range of computer courses, diploma programs, government exam preparation, and typing training in both Hindi and English languages.\n\nNGIT aims to empower students with digital skills, practical knowledge, and career guidance so they can succeed in competitive exams and professional careers.",
    highlights: [
        "Professional IT training and computer courses",
        "Government exam preparation support",
        "Expert typing training in Hindi & English",
        "Career-focused diploma programs",
        "Practical and hands-on learning approach",
        "Dedicated faculty and modern infrastructure",
    ]
};

interface AboutSectionProps {
    data?: any;
    blocks?: any[];
}

export default function AboutSection({ data, blocks }: AboutSectionProps) {
    // If blocks are provided, use the first block as the main content
    const blockData = blocks && blocks.length > 0 ? blocks[0] : null;
    
    const about = blockData ? {
        title: blockData.title || data?.title || defaultAbout.title,
        subtitle: blockData.subtitle || data?.subtitle || defaultAbout.subtitle,
        description: blockData.description || data?.description || defaultAbout.description,
        highlights: blockData.extra_data ? (typeof blockData.extra_data === 'string' ? JSON.parse(blockData.extra_data) : blockData.extra_data) : (data?.highlights || defaultAbout.highlights),
        image: blockData.image || data?.image
    } : (data || defaultAbout);

    const descriptionParas = typeof about.description === 'string' ? about.description.split('\n\n') : defaultAbout.description.split('\n\n');

    return (
        <section id="about" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-bl-full opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100 rounded-tr-full opacity-50 blur-3xl" />

            <div className="container relative z-10 px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Visual Content */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600 rounded-3xl translate-x-4 translate-y-4 opacity-20 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                        <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden">
                            {about.image ? (
                                <Image src={about.image} alt="About Us" width={600} height={400} className="w-full h-auto rounded-xl object-cover" />
                            ) : (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="p-6 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <BookOpen className="w-10 h-10 text-blue-600 mb-3" />
                                            <span className="font-bold text-slate-800">50+ Courses</span>
                                        </div>
                                        <div className="p-6 bg-purple-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <Award className="w-10 h-10 text-purple-600 mb-3" />
                                            <span className="font-bold text-slate-800">Certified Training</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-10">
                                        <div className="p-6 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <Target className="w-10 h-10 text-emerald-600 mb-3" />
                                            <span className="font-bold text-slate-800">Govt. Exams Prep</span>
                                        </div>
                                        <div className="p-6 bg-orange-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <Rocket className="w-10 h-10 text-orange-600 mb-3" />
                                            <span className="font-bold text-slate-800">Career Guidance</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm uppercase tracking-wider mb-6">
                            {about.subtitle}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {about.title}
                        </h2>

                        <div className="space-y-6 mb-8">
                            {descriptionParas.map((para: string, idx: number) => (
                                <p key={idx} className="text-lg text-slate-600 leading-relaxed">
                                    {para}
                                </p>
                            ))}
                        </div>

                        {Array.isArray(about.highlights) && (
                            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                {about.highlights.map((highlight: string, index: number) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link href="/about">
                            <Button className="h-14 px-8 text-lg font-bold bg-slate-900 hover:bg-blue-600 text-white shadow-xl transition-all hover:scale-105 group">
                                Read More About Us
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
