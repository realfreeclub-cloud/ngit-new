
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./src/models/CMSContent";
import "./src/models/CmsPage";
import "./src/models/CmsSection";

dotenv.config({ path: ".env.local" });

async function fix() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("✅ Connected");

        const CMSContent = mongoose.model("CMSContent");
        const CmsPage = mongoose.model("CmsPage");

        // 1. Fix Header Navigation
        const header = await CMSContent.findOne({ key: "HEADER" });
        if (header && header.data && header.data.navigation) {
            let updated = false;
            header.data.navigation = header.data.navigation.map((link: any) => {
                if (link.label === "Results" && link.href === "/#results") {
                    link.href = "/results";
                    updated = true;
                }
                return link;
            });
            if (updated) {
                await CMSContent.updateOne({ _id: header._id }, { "data.navigation": header.data.navigation });
                console.log("✅ Fixed Header Navigation in DB");
            }
        }

        // 2. Remove "results" dynamic page to avoid routing collision
        const resultsPage = await CmsPage.findOne({ page_name: "results" });
        if (resultsPage) {
            // Check if it's just a duplicate of home or something
            console.log("⚠️ Found a dynamic page named 'results'. This might be causing the collision.");
            // We should probably delete it or rename its slug
            await CmsPage.updateOne({ _id: resultsPage._id }, { page_name: "results_old" });
            console.log("✅ Renamed dynamic page 'results' to 'results_old' to prevent routing conflict.");
        }

        // 3. Ensure "Available Exams" section on home has a subtitle defined
        const CmsSection = mongoose.model("CmsSection");
        const homePage = await CmsPage.findOne({ page_name: "home" });
        if (homePage) {
            await CmsSection.updateMany(
                { page_id: homePage._id, section_type: "PublicExamsGrid" },
                { $set: { subtitle: "MOCK TESTS", description: "Challenge yourself with our curated list of mock exams and standard tests to sharpen your skills for final success." } }
            );
            await CmsSection.updateMany(
                { page_id: homePage._id, section_type: "PublicResultsGrid" },
                { $set: { subtitle: "LIVE BOARD", description: "Real-time updates on student achievements and test outcomes directly from our official evaluation platform." } }
            );
            console.log("✅ Updated CMS section metadata for Exams and Results on Home Page");
        }

        console.log("🚀 Fix completed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Fix failed:", error);
        process.exit(1);
    }
}

fix();
