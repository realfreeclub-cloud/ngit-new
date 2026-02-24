import HeroSlider from "@/components/public/HeroSlider";
import TrustIndicators from "@/components/public/TrustIndicators";
import AboutSection from "@/components/public/AboutSection";
import InfrastructureSection from "@/components/public/InfrastructureSection";
import FacultySection from "@/components/public/FacultySection";
import AchievementsSection from "@/components/public/AchievementsSection";
import CoursesSection from "@/components/public/CoursesSection";
import GallerySection from "@/components/public/GallerySection";
import EventsSection from "@/components/public/EventsSection";
import RegistrationCTA from "@/components/public/RegistrationCTA";
import ContactSection from "@/components/public/ContactSection";

import { getCMSContent } from "@/services/CMSService";
import { getFaculty } from "@/app/actions/faculty";
import { getPublicCourses } from "@/app/actions/courses";
import { getEvents } from "@/app/actions/events";
import { getGalleryImages } from "@/app/actions/upload";

export default async function PublicHomePage() {
    const [slides, stats, about, facultyRes, coursesRes, eventsRes, galleryRes] = await Promise.all([
        getCMSContent("HOME_SLIDER"),
        getCMSContent("HOME_STATS"),
        getCMSContent("HOME_ABOUT"),
        getFaculty(),
        getPublicCourses(),
        getEvents(),
        getGalleryImages()
    ]);

    const facultyMembers = facultyRes.success ? facultyRes.faculty : [];
    const publicCourses = coursesRes.success ? coursesRes.courses : [];
    const publicEvents = eventsRes.success ? eventsRes.events : [];
    const galleryImages = galleryRes.success ? galleryRes.images : [];

    return (
        <div className="min-h-screen">
            {/* Hero Slider */}
            <HeroSlider slides={slides} />

            {/* Trust Indicators */}
            <TrustIndicators stats={stats} />

            {/* About Section */}
            <AboutSection data={about} />

            {/* Infrastructure Section */}
            <InfrastructureSection />

            {/* Faculty Section */}
            <FacultySection members={facultyMembers} />

            {/* Achievements Section */}
            <AchievementsSection />

            {/* Courses Section */}
            <CoursesSection courses={publicCourses} />

            {/* Gallery Section */}
            <GallerySection images={galleryImages} />

            {/* Events Section */}
            <EventsSection events={publicEvents} />

            {/* Registration CTA */}
            <RegistrationCTA />

            {/* Contact Section */}
            <ContactSection />
        </div>
    );
}
