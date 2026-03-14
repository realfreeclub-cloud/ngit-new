import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

async function seedCms() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("✅ Connected to Database for CMS Seeding");

        const CmsPage = (await import("./src/models/CmsPage")).default;
        const CmsSection = (await import("./src/models/CmsSection")).default;
        const CmsContentBlock = (await import("./src/models/CmsContentBlock")).default;

        // Clear existing CMS data to avoid duplicates during seeding
        await CmsPage.deleteMany({});
        await CmsSection.deleteMany({});
        await CmsContentBlock.deleteMany({});

        console.log("🧹 Cleared existing CMS data");

        // 1. Create Homepage
        const homePage = await CmsPage.create({
            page_name: "home",
            title: "National Genius Institute of Technology",
            description: "A professional IT training institute providing computer courses, government exam preparation, typing classes, and skill-based education."
        });

        console.log("📄 Created Page: Home");

        // --- HOMEPAGE SECTIONS ---

        // Hero Section
        const heroSection = await CmsSection.create({
            page_id: homePage._id,
            section_name: "Hero Banner",
            section_type: "HeroSection",
            sort_order: 0
        });
        await CmsContentBlock.create({
            section_id: heroSection._id,
            title: "National Genius Institute of Technology",
            subtitle: "A Place to Learn and Grow Your Future",
            description: "A professional IT training institute providing computer courses, government exam preparation, typing classes, and skill-based education.",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070",
            button_text: "New Admission",
            button_link: "/register",
            extra_data: JSON.stringify({
                secondary_button_text: "Prospectus",
                secondary_button_link: "/prospectus.pdf"
            })
        });

        // Notifications
        const notifSection = await CmsSection.create({
            page_id: homePage._id,
            section_name: "Latest Updates",
            section_type: "NotificationScroller",
            sort_order: 1
        });
        await CmsContentBlock.create({
            section_id: notifSection._id,
            title: "Admission open for 2026 batches! Register now for early bird discounts.",
            button_link: "/register",
            sort_order: 0
        });
        await CmsContentBlock.create({
            section_id: notifSection._id,
            title: "New CCC and O Level specialized batches starting from next Monday.",
            button_link: "/courses",
            sort_order: 1
        });

        // Trust Stats
        const statsSection = await CmsSection.create({
            page_id: homePage._id,
            section_name: "NGIT by Numbers",
            section_type: "TrustIndicators",
            sort_order: 2
        });
        const stats = [
            { title: "Years of Excellence", subtitle: "15+" },
            { title: "Students Trained", subtitle: "5000+" },
            { title: "Success Rate", subtitle: "98%" },
            { title: "Top 100 Ranks", subtitle: "45" }
        ];
        for (let i = 0; i < stats.length; i++) {
            await CmsContentBlock.create({
                section_id: statsSection._id,
                title: stats[i].title,
                subtitle: stats[i].subtitle,
                sort_order: i
            });
        }

        // About Section
        const aboutSection = await CmsSection.create({
            page_id: homePage._id,
            section_name: "Our Story",
            section_type: "AboutSection",
            sort_order: 3
        });
        await CmsContentBlock.create({
            section_id: aboutSection._id,
            title: "Building Future Leaders Since 2009",
            subtitle: "About NGIT",
            description: "National Genius Institute of Technology (NGIT) has been at the forefront of providing quality IT education and professional training. Our mission is to empower students with skills that bridge the gap between education and employment.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070",
            extra_data: JSON.stringify([
                "Expert faculty from top institutions",
                "State-of-the-art computer labs",
                "100% practical training focus",
                "Government recognized certifications"
            ])
        });

        // Why Choose Section
        const whySection = await CmsSection.create({
            page_id: homePage._id,
            section_name: "Why NGIT?",
            section_type: "WhyChooseSection",
            sort_order: 4
        });
        const reasons = [
            { title: "Expert Faculty", description: "Learn from industry professionals with years of teaching experience." },
            { title: "Modern Labs", description: "Practice on latest software and high-speed workstations." },
            { title: "Job Assistance", description: "Dedicated placement cell to help you secure your dream job." }
        ];
        for (let i = 0; i < reasons.length; i++) {
            await CmsContentBlock.create({
                section_id: whySection._id,
                title: reasons[i].title,
                description: reasons[i].description,
                sort_order: i
            });
        }

        // --- COURSES PAGE ---
        const coursesPage = await CmsPage.create({
            page_name: "courses",
            title: "Professional Courses",
            description: "Explore our wide range of IT and professional certificate programs."
        });

        const courseGrid = await CmsSection.create({
            page_id: coursesPage._id,
            section_name: "Featured Courses",
            section_type: "CourseGrid",
            sort_order: 0
        });

        const courses = [
            { title: "ADCA", subtitle: "Advanced Diploma", description: "Master basic to advanced computer applications, web design, and office automation.", fees: "15,000", duration: "12 Months" },
            { title: "Tally with GST", subtitle: "Accounting", description: "Become an expert in digital accounting, GST filing, and financial management.", fees: "6,500", duration: "3 Months" },
            { title: "O Level", subtitle: "NIELIT Certified", description: "A prestigious government recognized certification for programmers and IT specialists.", fees: "12,000", duration: "12 Months" }
        ];

        for (let i = 0; i < courses.length; i++) {
            await CmsContentBlock.create({
                section_id: courseGrid._id,
                title: courses[i].title,
                subtitle: courses[i].subtitle,
                description: courses[i].description,
                sort_order: i,
                extra_data: JSON.stringify({
                    fees: courses[i].fees,
                    duration: courses[i].duration
                })
            });
        }

        // --- FACULTY PAGE ---
        const facultyPage = await CmsPage.create({
            page_name: "faculty",
            title: "Expert Mentors",
            description: "Meet the professional trainers who guide our students to success."
        });

        const facultyGrid = await CmsSection.create({
            page_id: facultyPage._id,
            section_name: "Our Team",
            section_type: "FacultyGrid",
            sort_order: 0
        });

        const team = [
            { title: "Md. Javed Siddiqui", subtitle: "Director", description: "Visionary leader with 20+ years in IT education and academic management.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" },
            { title: "Sarah Ahmad", subtitle: "Lead Instructor", description: "Expert in Computer Applications and Web Development technologies.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976" }
        ];

        for (let i = 0; i < team.length; i++) {
            await CmsContentBlock.create({
                section_id: facultyGrid._id,
                title: team[i].title,
                subtitle: team[i].subtitle,
                description: team[i].description,
                image: team[i].image,
                sort_order: i
            });
        }

        console.log("✅ CMS Seeding Completed Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error Seeding CMS:", error);
        process.exit(1);
    }
}

seedCms();
