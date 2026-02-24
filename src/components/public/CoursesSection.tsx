import { Clock, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    slug: string;
    type: string;
    price: number;
    category: string;
}

export default function CoursesSection({ courses = [] }: { courses?: Course[] }) {
    return (
        <section className="section-spacing bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Our Programs
                    </p>
                    <h2 className="heading-2 text-gray-900 mb-4">
                        Choose Your Path to Success
                    </h2>
                    <p className="body text-gray-600">
                        Structured programs designed to help you achieve your academic goals with expert guidance
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {courses.slice(0, 3).map((course, i) => {
                        const colors = [
                            { text: "text-primary", bg: "from-primary/10 to-primary/5" },
                            { text: "text-secondary", bg: "from-secondary/10 to-secondary/5" },
                            { text: "text-accent", bg: "from-accent/10 to-accent/5" }
                        ];
                        const theme = colors[i % colors.length];

                        return (
                            <div
                                key={course._id}
                                className="card-default hover:shadow-extra transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-br ${theme.bg} rounded-xl p-6 mb-6 -mx-6 -mt-6`}>
                                    <h3 className="heading-4 text-gray-900 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="body-small text-gray-600 line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${theme.text}`}>
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Category</p>
                                            <p className="text-sm font-semibold text-gray-900">{course.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${theme.text}`}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Mode</p>
                                            <p className="text-sm font-semibold text-gray-900">{course.type}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link href={`/courses/${course.slug}`}>
                                    <Button className="w-full group-hover:shadow-md transition-shadow" variant="outline">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Not sure which program is right for you?</p>
                    <Link href="/contact">
                        <Button className="btn-primary">
                            Talk to Our Counselor
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
