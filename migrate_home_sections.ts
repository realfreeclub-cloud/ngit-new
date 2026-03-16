
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./src/models/CmsPage";
import "./src/models/CmsSection";

dotenv.config({ path: ".env.local" });

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("✅ Connected");

        const CmsPage = mongoose.model("CmsPage");
        const CmsSection = mongoose.model("CmsSection");

        const homePage = await CmsPage.findOne({ page_name: "home" });
        if (!homePage) {
            console.log("❌ Home page not found in DB");
            process.exit(1);
        }

        const sectionsToEnsure = [
            { name: "Our Faculty", type: "FacultySection" },
            { name: "Our Courses", type: "CoursesSection" },
            { name: "Campus Gallery", type: "GallerySection" },
            { name: "Available Exams", type: "PublicExamsGrid" },
            { name: "Exam Results", type: "PublicResultsGrid" }
        ];

        let lastOrder = 0;
        const existingSections = await CmsSection.find({ page_id: homePage._id }).sort({ sort_order: -1 });
        if (existingSections.length > 0) {
            lastOrder = existingSections[0].sort_order;
        }

        for (const section of sectionsToEnsure) {
            const exists = await CmsSection.findOne({ 
                page_id: homePage._id, 
                section_type: section.type 
            });

            if (!exists) {
                lastOrder++;
                await CmsSection.create({
                    page_id: homePage._id,
                    section_name: section.name,
                    section_type: section.type,
                    sort_order: lastOrder,
                    is_active: true
                });
                console.log(`✅ Created section: ${section.name} (${section.type})`);
            } else {
                console.log(`ℹ️ Section already exists: ${section.type}`);
            }
        }

        console.log("🚀 Migration completed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrate();
