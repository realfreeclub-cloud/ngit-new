import { Building2, BookOpen, Wifi, Home } from "lucide-react";

const facilities = [
    {
        icon: Building2,
        title: "AC Classrooms",
        description: "Spacious, air-conditioned classrooms with modern seating and audio-visual equipment",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: BookOpen,
        title: "Digital Library",
        description: "Extensive collection of books, journals, and online resources available 24/7",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
    {
        icon: Wifi,
        title: "Smart Labs",
        description: "State-of-the-art computer labs with high-speed internet and latest software",
        color: "text-accent",
        bg: "bg-accent/10",
    },
    {
        icon: Home,
        title: "Hostel Facility",
        description: "Safe and comfortable hostel accommodation with mess and 24/7 security",
        color: "text-info",
        bg: "bg-info/10",
    },
];

export default function InfrastructureSection() {
    return (
        <section className="section-spacing bg-gray-50">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Infrastructure
                    </p>
                    <h2 className="heading-2 text-gray-900 mb-4">
                        World-Class Learning Environment
                    </h2>
                    <p className="body text-gray-600">
                        Experience education in an environment designed for excellence with modern facilities and amenities
                    </p>
                </div>

                {/* Facilities Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {facilities.map((facility, index) => (
                        <div
                            key={index}
                            className="card-default group hover:shadow-strong transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${facility.bg} ${facility.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <facility.icon className="w-8 h-8" />
                            </div>
                            <h3 className="heading-5 text-gray-900 mb-3">
                                {facility.title}
                            </h3>
                            <p className="body-small text-gray-600 leading-relaxed">
                                {facility.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">100+</div>
                        <p className="text-sm font-semibold text-gray-600">Seating Capacity</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                        <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
                        <p className="text-sm font-semibold text-gray-600">Library Access</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                        <div className="text-3xl font-bold text-accent mb-2">50+</div>
                        <p className="text-sm font-semibold text-gray-600">Computer Systems</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
