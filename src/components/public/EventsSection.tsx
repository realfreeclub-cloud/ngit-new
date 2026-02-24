import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    status: string;
}

export default function EventsSection({ events = [] }: { events?: Event[] }) {
    return (
        <section className="section-spacing bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
                        Events
                    </p>
                    <h2 className="heading-2 text-gray-900 mb-4">
                        Upcoming Events & Activities
                    </h2>
                    <p className="body text-gray-600">
                        Stay updated with our latest events, admissions, and important dates
                    </p>
                </div>

                {/* Events Timeline */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {events.slice(0, 4).map((event, index) => {
                        const colors = [
                            { text: "text-accent", bg: "bg-accent/10" },
                            { text: "text-primary", bg: "bg-primary/10" },
                            { text: "text-secondary", bg: "bg-secondary/10" },
                            { text: "text-info", bg: "bg-info/10" }
                        ];
                        const theme = colors[index % colors.length];

                        return (
                            <div
                                key={event._id}
                                className="card-default hover:shadow-strong transition-all duration-300 group"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Badge */}
                                    <div className={`${theme.bg} rounded-xl p-6 text-center md:w-48 shrink-0`}>
                                        <div className={`${theme.text} font-heading font-bold text-2xl mb-1`}>
                                            {new Date(event.date).getDate()}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700">
                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className={`mt-3 inline-block px-3 py-1 bg-white rounded-full text-xs font-bold ${theme.text}`}>
                                            {event.status}
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="flex-1">
                                        <h3 className="heading-4 text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center">
                                        <Link href="/events" className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Learn More
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-12 text-center">
                    <Link href="/events" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        View Full Calendar
                    </Link>
                </div>
            </div>
        </section>
    );
}
