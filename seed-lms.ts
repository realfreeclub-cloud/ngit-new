import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Models
import User, { UserRole } from "./src/models/User";
import Course from "./src/models/Course";
import StudentProfile from "./src/models/StudentProfile";
import Faculty from "./src/models/Faculty";

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("✅ Connected to Database for LMS Seeding");

        // 1. Seed Faculty
        console.log("Seeding Faculty...");
        const facultyData = [
            {
                name: "Dr. Sandeep Kumar",
                position: "Senior IT Consultant",
                email: "sandeep@ngit.in",
                phone: "+91 98394 46340",
                qualification: "Ph.D in Computer Science",
                bio: "Expert in Advanced Excel, Tally Prime, and Taxation with over 15 years of industry experience.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2069"
            },
            {
                name: "Amit Vishwakarma",
                position: "Head of Training",
                email: "amit@ngit.in",
                phone: "+91 94503 62110",
                qualification: "MCA, O-Level Certified",
                bio: "Specialist in programming languages and government IT certifications.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070"
            }
        ];

        for (const f of facultyData) {
            try {
                await Faculty.findOneAndUpdate({ email: f.email }, f, { upsert: true, new: true });
                console.log(`✅ Seeded Faculty: ${f.name}`);
            } catch (err: any) {
                console.warn(`⚠️ Failed to seed faculty ${f.name}: ${err.message}`);
                // If it's the employeeId error, we might need to skip or handle it
            }
        }

        // 2. Seed Courses
        console.log("Seeding Requested Courses...");
        const requestedCourses = [
            {
                title: "ADCA (Advanced Diploma in Computer Applications)",
                slug: "adca-advanced-diploma",
                description: "Master basic to advanced computer applications, web design, and office automation. Covers Windows, MS Office, Internet, HTML, and specialized software.",
                thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
                price: 15000,
                isPublished: true,
                category: "Advanced Diploma",
                type: "OFFLINE"
            },
            {
                title: "Tally with GST",
                slug: "tally-with-gst-accounting",
                description: "Become an expert in digital accounting, GST filing, and financial management. Real-world case studies and practical training on Tally Prime.",
                thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3fb858f?q=80&w=2072",
                price: 6500,
                isPublished: true,
                category: "Accounting",
                type: "OFFLINE"
            },
            {
                title: "O Level",
                slug: "o-level-nielit-certified",
                description: "A prestigious government recognized certification for programmers and IT specialists. Preparation for NIELIT exams with high success rates.",
                thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
                price: 12000,
                isPublished: true,
                category: "NIELIT Certified",
                type: "OFFLINE"
            }
        ];

        for (const c of requestedCourses) {
            try {
                await Course.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
                console.log(`✅ Seeded Course: ${c.title}`);
            } catch (err: any) {
                console.warn(`⚠️ Failed to seed course ${c.title}: ${err.message}`);
            }
        }

        // 3. Seed Students & Student Profiles
        console.log("Seeding Students...");
        const studentPass = await bcrypt.hash("student123", 10);
        
        const studentsData = [
            { name: "Rahul Patel", email: "rahul@example.com", course: "ADCA" },
            { name: "Suman Lata", email: "suman@example.com", course: "Tally with GST" }
        ];

        for (const s of studentsData) {
            try {
                const user = await User.findOneAndUpdate(
                    { email: s.email },
                    {
                        name: s.name,
                        email: s.email,
                        password: studentPass,
                        role: UserRole.STUDENT,
                        isActive: true
                    },
                    { upsert: true, new: true }
                );

                await StudentProfile.findOneAndUpdate(
                    { userId: user._id },
                    {
                        userId: user._id,
                        name: s.name,
                        email: s.email,
                        dateOfBirth: "2000-01-01",
                        fatherName: "Mr. Father",
                        motherName: "Mrs. Mother",
                        aadharNo: "1234-5678-9012",
                        category: "General",
                        localAddress: "Prayagraj, UP",
                        localPhone: "+91 99999 88888",
                        permanentAddress: "Prayagraj, UP",
                        permanentPhone: "+91 99999 88888",
                        course: s.course,
                        status: "Approved"
                    },
                    { upsert: true }
                );
                console.log(`✅ Seeded Student: ${s.name}`);
            } catch (err: any) {
                console.warn(`⚠️ Failed to seed student ${s.name}: ${err.message}`);
            }
        }

        console.log("✅ LMS Seeding Completed Successfully!");
        process.exit(0);
    } catch (error: any) {
        console.error("❌ Seeding Error:", error.message);
        process.exit(1);
    }
})();
