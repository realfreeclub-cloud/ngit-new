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
import { getNotices } from "@/app/actions/notice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { listBlogPosts } from "@/app/actions/blog";
import BlogSection from "@/components/public/BlogSection";
import { getPublicFeedback } from "@/app/actions/feedback";
import VideoFeedbackSection from "@/components/public/VideoFeedbackSection";

export default async function PublicHomePage() {
    const session = await getServerSession(authOptions);
    const [slides, stats, about, facultyRes, coursesRes, eventsRes, galleryRes, noticesRes, dynamicData, resultsRes, examsRes, blogRes, feedbackRes] = await Promise.all([
        getCMSContent("HOME_SLIDER"),
        getCMSContent("HOME_STATS"),
        getCMSContent("HOME_ABOUT"),
        getFaculty(),
        getPublicCourses(),
        getEvents(),
        getGalleryImages(),
        getNotices(false), // Fetch active notices from DB
        getDynamicPageData("home"),
        getPublicMockTestResults(),
        getPublicExams(),
        listBlogPosts({ status: "PUBLISHED", limit: 3 }),
        getPublicFeedback({ limit: 6 }),
    ]);

    const facultyMembers = (facultyRes.success ? facultyRes.faculty : []).slice(0, 6);
    const publicCourses = (coursesRes.success ? coursesRes.courses : []).slice(0, 6);
    const publicEvents = (eventsRes.success ? eventsRes.events : []).slice(0, 6);
    const galleryImages = (galleryRes.success ? galleryRes.images : []).slice(0, 6);
    const publicResultsGrouped = resultsRes.success ? (resultsRes as any).sections : {};
    const firstSectionResults = (Object.values(publicResultsGrouped)[0] as any[] || []).slice(0, 6);
    const publicExams = ((examsRes as any)?.success ? (examsRes as any).exams : []).slice(0, 6);
    const publicBlogs = (blogRes.success ? blogRes.data.posts : []).slice(0, 3);
    const publicFeedback = feedbackRes.success ? feedbackRes.data : [];

    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    // Filter to only those designated for the scroller
    const scrollingNotices = (noticesRes.success ? noticesRes.notices : [])
        .filter((n: any) => n.showInScroller)
        .map((n: any) => ({
            id: n._id,
            text: n.title + (n.description ? ` - ${n.description.substring(0, 100)}...` : ''),
            link: n.link || `/notices`
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
                    publicExams: publicExams,
                    blogs: publicBlogs,
                    feedback: publicFeedback,
                    notices: noticesRes.success ? noticesRes.notices : [],
                    session: session
                }}
                session={session}
                staticFallback={
                    <>
                        {/* Hero Section */}
                        <HeroSection blocks={slides || []} />

                        {/* Notification Scroller */}
                        {scrollingNotices.length > 0 && (
                            <NotificationScroller notifications={scrollingNotices} />
                        )}

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

                        {/* Video Testimonials */}
                        <VideoFeedbackSection feedbacks={publicFeedback} />

                        {/* Blog Section */}
                        <BlogSection blogs={publicBlogs} />

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
