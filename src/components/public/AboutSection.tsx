import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const defaultAbout = {
    title: "Building Future Leaders Since 2009",
    subtitle: "About NGIT",
    description: "National Genius Institute of Technology (NGIT) has been at the forefront of competitive exam preparation for over 15 years. We have consistently produced top rankers in IIT-JEE, NEET, and other prestigious entrance examinations.\n\nOur success is built on a foundation of expert faculty, comprehensive study materials, regular assessments, and personalized attention to each student's growth.",
    highlights: [
        "Established in 2009 with a vision for excellence",
        "Expert faculty from IITs and premier institutions",
        "Proven track record of top ranks every year",
        "Modern infrastructure with AC classrooms",
        "Comprehensive study material and test series",
        "Personal mentorship and doubt-clearing sessions",
    ]
};

interface AboutSectionProps {
    data?: any;
}

export default function AboutSection({ data }: AboutSectionProps) {
    const about = data || defaultAbout;
    const descriptionParas = about.description.split('\n\n');

    return (
        <section id="about" className="section-spacing bg-white">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-4">
                            <div className="aspect-[4/5] bg-gradient-to-br from-primary to-primary-dark rounded-2xl overflow-hidden flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">NGIT Campus</span>
                            </div>
                            <div className="aspect-video bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl overflow-hidden flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Students</span>
                            </div>
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="aspect-video bg-gradient-to-br from-accent to-accent-dark rounded-2xl overflow-hidden flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Classroom</span>
                            </div>
                            <div className="aspect-[4/5] bg-gradient-to-br from-info to-primary rounded-2xl overflow-hidden flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">Faculty</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="animate-slide-up">
                        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4 inline-block px-4 py-2 bg-primary/5 rounded-lg">
                            {about.subtitle}
                        </p>
                        <h2 className="heading-2 text-gray-900 mb-6">
                            {about.title}
                        </h2>

                        {descriptionParas.map((para: string, idx: number) => (
                            <p key={idx} className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {para}
                            </p>
                        ))}

                        <div className="space-y-4 mb-10">
                            {about.highlights.map((highlight: string, index: number) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-secondary/20 transition-colors">
                                        <CheckCircle className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-base leading-relaxed">{highlight}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/about">
                            <Button className="btn-primary group text-base">
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
