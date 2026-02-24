import { Trophy, Medal, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const topRankers = [
    {
        name: "Rahul Sharma",
        rank: "AIR 23",
        exam: "IIT-JEE 2025",
        college: "IIT Bombay",
        branch: "Computer Science",
        icon: Trophy,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
    },
    {
        name: "Priya Singh",
        rank: "AIR 47",
        exam: "IIT-JEE 2025",
        college: "IIT Delhi",
        branch: "Electrical Engineering",
        icon: Medal,
        color: "text-gray-400",
        bg: "bg-gray-50",
    },
    {
        name: "Arjun Patel",
        rank: "AIR 89",
        exam: "IIT-JEE 2025",
        college: "IIT Kanpur",
        branch: "Mechanical Engineering",
        icon: Award,
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
];

const stats = [
    { value: "98%", label: "Success Rate" },
    { value: "45", label: "Top 100 Ranks" },
    { value: "200+", label: "IIT Selections" },
    { value: "150+", label: "NEET Qualifiers" },
];

export default function AchievementsSection() {
    return (
        <section id="results" className="section-spacing bg-gradient-to-br from-primary via-primary-dark to-gray-900 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                        Our Success Stories
                    </p>
                    <h2 className="heading-2 mb-4">
                        2025 Results at a Glance
                    </h2>
                    <p className="body text-gray-200">
                        Celebrating excellence with our students who achieved top ranks in prestigious entrance examinations
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-heading font-bold text-accent mb-2">
                                {stat.value}
                            </div>
                            <p className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Top Rankers */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {topRankers.map((ranker, index) => (
                        <div
                            key={index}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${ranker.bg} ${ranker.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <ranker.icon className="w-8 h-8" />
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-5 h-5 text-accent fill-accent" />
                                    <span className="text-2xl font-heading font-bold">{ranker.rank}</span>
                                </div>
                                <h3 className="heading-5 mb-1">{ranker.name}</h3>
                                <p className="text-sm text-gray-300">{ranker.exam}</p>
                            </div>
                            <div className="pt-4 border-t border-white/20 space-y-1">
                                <p className="text-sm font-semibold text-accent">{ranker.college}</p>
                                <p className="text-xs text-gray-300">{ranker.branch}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/results">
                        <Button className="bg-accent hover:bg-accent-dark text-white px-8 py-6 text-lg shadow-extra">
                            View Complete Results
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
