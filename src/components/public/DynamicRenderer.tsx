import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import WhyChooseSection from "./WhyChooseSection";
import InfrastructureSection from "./InfrastructureSection";
import FacultySection from "./FacultySection";
import AchievementsSection from "./AchievementsSection";
import CoursesSection from "./CoursesSection";
import GallerySection from "./GallerySection";
import EventsSection from "./EventsSection";
import RegistrationCTA from "./RegistrationCTA";
import ContactSection from "./ContactSection";
import TrustIndicators from "./TrustIndicators";
import NotificationScroller from "./NotificationScroller";

import CourseGrid from "./CourseGrid";
import FacultyGrid from "./FacultyGrid";
import GalleryGrid from "./GalleryGrid";
import TestimonialSlider from "./TestimonialSlider";
import CTASection from "./CTASection";

// Add some placeholder or custom mapping
export default function DynamicRenderer({ sections, staticFallback }: { sections: any[], staticFallback?: React.ReactNode }) {
    if (!sections || sections.length === 0) {
        return <>{staticFallback}</>;
    }

    return (
        <>
            {sections.filter((s: any) => s.is_active).map((section: any, index: number) => {
                const props = { key: section._id || index, data: section, blocks: section.blocks };

                switch (section.section_type) {
                    case "HeroSection":
                        return <HeroSection {...props} />;
                    case "AboutSection":
                        return <AboutSection {...props} />;
                    case "WhyChooseSection":
                        return <WhyChooseSection {...props} />;
                    case "CourseGrid":
                        return <CourseGrid {...props} />;
                    case "CoursesSection":
                        return <CoursesSection {...props} />;
                    case "FacultyGrid":
                        return <FacultyGrid {...props} />;
                    case "FacultySection":
                        return <FacultySection {...props} />;
                    case "GalleryGrid":
                        return <GalleryGrid {...props} />;
                    case "GallerySection":
                        return <GallerySection {...props} />;
                    case "TestimonialSlider":
                        return <TestimonialSlider {...props} />;
                    case "AchievementsSection":
                        return <AchievementsSection {...props} />;
                    case "CTASection":
                        return <CTASection {...props} />;
                    case "RegistrationCTA":
                        return <RegistrationCTA {...props} />;
                    case "ContactSection":
                        return <ContactSection {...props} />;
                    case "EventsSection":
                        return <EventsSection {...props} />;
                    case "InfrastructureSection":
                        return <InfrastructureSection {...props} />;
                    case "NotificationScroller": {
                        const notifications = props.blocks?.map((b: any) => ({
                            id: b._id || b.id,
                            text: b.title || b.description || "Notification",
                            link: b.button_link || b.image || ""
                        })) || [];
                        return <NotificationScroller key={props.key} notifications={notifications} />;
                    }
                    case "TrustIndicators": {
                        const stats = props.blocks?.map((b: any) => ({
                            label: b.title || "Stat",
                            value: b.subtitle || "0"
                        })) || [];
                        return <TrustIndicators key={props.key} stats={stats} />;
                    }
                    default:
                        // Fallback component
                        return (
                            <section key={props.key} className="py-20 bg-slate-50 text-center">
                                <h2 className="text-2xl font-bold mb-4">{section.section_name}</h2>
                                <p className="text-slate-500">Component type '{section.section_type}' is currently not mapped.</p>
                            </section>
                        );
                }
            })}
        </>
    );
}
