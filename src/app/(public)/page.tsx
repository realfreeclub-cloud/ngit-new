export const dynamic = "force-dynamic";
import HeroSection from "@/components/public/HeroSection";

import TrustIndicators from "@/components/public/TrustIndicators";
import AboutSection from "@/components/public/AboutSection";
import WhyChooseSection from "@/components/public/WhyChooseSection";
import InfrastructureSection from "@/components/public/InfrastructureSection";
import FacultySection from "@/components/public/FacultySection";
import AchievementsSection from "@/components/public/AchievementsSection";
import CoursesSection from "@/components/public/CoursesSection";
import GallerySection from "@/components/public/GallerySection";
import EventsSection from "@/components/public/EventsSection";
import RegistrationCTA from "@/components/public/RegistrationCTA";
import ContactSection from "@/components/public/ContactSection";
import NotificationScroller from "@/components/public/NotificationScroller";
import DirectorMessageSection from "@/components/public/DirectorMessageSection";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import CertificateVerificationSection from "@/components/public/CertificateVerificationSection";

import { getCMSContent } from "@/services/CMSService";
import { getDynamicPageData } from "@/app/actions/cms";
import { getFaculty } from "@/app/actions/faculty";
import { getPublicCourses } from "@/app/actions/courses";
import { getEvents } from "@/app/actions/events";
import { getGalleryImages } from "@/app/actions/upload";
import { getPublicResults as getOldResults, getPublicExams } from "@/app/actions/results";
import { getPublicMockTestResults } from "@/app/actions/mockTestResults";

export default async function PublicHomePage() {
    const [slides, stats, about, facultyRes, coursesRes, eventsRes, galleryRes, notifications, dynamicData, resultsRes, examsRes] = await Promise.all([
        getCMSContent("HOME_SLIDER"),
        getCMSContent("HOME_STATS"),
        getCMSContent("HOME_ABOUT"),
        getFaculty(),
        getPublicCourses(),
        getEvents(),
        getGalleryImages(),
        getCMSContent("HOME_NOTIFICATIONS"),
        getDynamicPageData("home"),
        getPublicMockTestResults(),
        getPublicExams()
    ]);

    const facultyMembers = facultyRes.success ? facultyRes.faculty : [];
    const publicCourses = coursesRes.success ? coursesRes.courses : [];
    const publicEvents = eventsRes.success ? eventsRes.events : [];
    const galleryImages = galleryRes.success ? galleryRes.images : [];
    const publicResultsGrouped = resultsRes.success ? (resultsRes as any).sections : {};
    const firstSectionResults = Object.values(publicResultsGrouped)[0] || [];
    const publicExams = (examsRes as any)?.success ? (examsRes as any).exams : [];

    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    const mappedNotifications = (notifications || []).map((n: any) => ({
        id: n._id || n.id,
        text: n.title || n.description || n.text || "Notification",
        link: n.button_link || n.image || n.link || ""
    }));

    return (
        <div className="min-h-screen">
            <DynamicRenderer 
                sections={cmsSections} 
                extraData={{
                    courses: publicCourses,
                    faculty: facultyMembers,
                    events: publicEvents,
                    gallery: galleryImages,
                    publicResults: firstSectionResults as any[],
                    publicExams: publicExams
                }}
                staticFallback={
                    <>
                        {/* Hero Section */}
                        <HeroSection blocks={slides || []} />

                        {/* Notification Scroller */}
                        <NotificationScroller notifications={(notifications || []).map((n: any) => ({
                            id: n._id || n.id,
                            text: n.title || n.description || n.text || "Notification",
                            link: n.button_link || n.image || n.link || ""
                        }))} />

                        {/* Trust Indicators */}
                        <TrustIndicators stats={stats || []} />

                        {/* About Section */}
                        <AboutSection data={about} />

                        {/* Why Choose NGIT Section */}
                        <WhyChooseSection />

                        {/* Infrastructure Section */}
                        <InfrastructureSection />

                        {/* Certificate Verification Section */}
                        <CertificateVerificationSection />

                        {/* Director's Message Section Component */}
                        <DirectorMessageSection 
                            director={facultyMembers.find((f: any) => 
                                f.position?.toLowerCase().includes("director") || 
                                f.position?.toLowerCase().includes("md") ||
                                f.name?.toLowerCase().includes("javed")
                            ) || facultyMembers[0]} 
                            data={{ bg_color: "bg-slate-950 rounded-[4rem] mb-20 mx-4" }} 
                        />

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
                    </>
                }
            />
        </div>
    );
}
