// A simple node script to overwrite the header and footer content
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables manually
dotenv.config({ path: '.env.local' });

// Define the simplistic Schema directly here to avoid typescript compilation issues
const CMSContentSchema = new mongoose.Schema({
    key: String,
    data: mongoose.Schema.Types.Mixed,
});

const CMSContent = mongoose.models.CMSContent || mongoose.model("CMSContent", CMSContentSchema);

async function run() {
    try {
        console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log("Connected to MongoDB.");

        await CMSContent.findOneAndUpdate(
            { key: "HEADER" },
            {
                key: "HEADER",
                data: {
                    logoImage: "",
                    logoText: "NGIT",
                    navigation: [
                        { label: "Home", href: "/" },
                        { label: "About Us", href: "/#about" },
                        { label: "Our Courses", href: "/courses" },
                        { label: "Events", href: "/events" },
                        { label: "Gallery", href: "/gallery" },
                        { label: "Faculty", href: "/faculty" },
                        { label: "Results", href: "/#results" },
                        { label: "Contact", href: "/contact" }
                    ],
                    ctaButton: { label: "Apply Now", href: "/register" }
                }
            },
            { upsert: true }
        );

        await CMSContent.findOneAndUpdate(
            { key: "FOOTER" },
            {
                key: "FOOTER",
                data: {
                    logoImage: "",
                    logoText: "NGIT",
                    description: "National Genius Institute of Technology is a leading coaching institute providing quality education and preparing students for competitive exams.",
                    sections: [
                        {
                            title: "Academics",
                            links: [
                                { label: "Programs & Courses", href: "/courses" },
                                { label: "Upcoming Events", href: "/events" },
                                { label: "Expert Faculty", href: "/faculty" },
                                { label: "Achievements", href: "/#results" }
                            ]
                        },
                        {
                            title: "Institute Focus",
                            links: [
                                { label: "About NGIT", href: "/#about" },
                                { label: "Campus Gallery", href: "/gallery" },
                                { label: "Contact Support", href: "/contact" },
                                { label: "Join the Team", href: "/contact" }
                            ]
                        },
                        {
                            title: "Quick Portals",
                            links: [
                                { label: "Student Login", href: "/student/login" },
                                { label: "Admin Dashboard", href: "/admin/login" },
                                { label: "New Application", href: "/register" }
                            ]
                        }
                    ],
                    social: [
                        { platform: "Facebook", url: "https://facebook.com/" },
                        { platform: "Instagram", url: "https://instagram.com/" },
                        { platform: "LinkedIn", url: "https://linkedin.com/" },
                        { platform: "YouTube", url: "https://youtube.com/" }
                    ],
                    copyright: "© 2026 National Genius Institute of Technology. All rights reserved."
                }
            },
            { upsert: true }
        );

        console.log("Successfully seeded HEADER and FOOTER CMS data.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
