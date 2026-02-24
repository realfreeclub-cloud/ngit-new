import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
console.log("STEP 1: ENV LOADED");
import mongoose from "mongoose";
console.log("STEP 2: MONGOOSE IMPORTED");
import bcrypt from "bcryptjs";
console.log("STEP 3: BCRYPT IMPORTED");


(async () => {
    try {
        console.log("Starting Main Logic...");


        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("✅ Connected to Database");

        // Dynamic imports
        const User = (await import("./src/models/User")).default;
        const { UserRole } = await import("./src/models/User");
        const Course = (await import("./src/models/Course")).default;
        const Lesson = (await import("./src/models/Lesson")).default;
        const { LessonType } = await import("./src/models/Lesson");
        const Enrollment = (await import("./src/models/Enrollment")).default;
        const Event = (await import("./src/models/Event")).default;
        const Material = (await import("./src/models/Material")).default;
        const CMSContent = (await import("./src/models/CMSContent")).default;
        const Attendance = (await import("./src/models/Attendance")).default;
        const { AttendanceStatus } = await import("./src/types/attendance");
        const Quiz = (await import("./src/models/Quiz")).default;
        // Quizzes now reference questions by ID.
        const Question = (await import("./src/models/Question")).default;
        const { QuestionType, Difficulty } = await import("./src/models/Question");
        const Payment = (await import("./src/models/Payment")).default;
        const { PaymentStatus } = await import("./src/models/Payment");
        const Attempt = (await import("./src/models/Attempt")).default;

        // --- 1. Users ---
        console.log("Creating Users...");
        const adminPass = await bcrypt.hash("admin123", 10);
        const admin = await User.findOneAndUpdate(
            { email: "admin@ngit.edu" },
            { name: "Super Admin", password: adminPass, role: UserRole.ADMIN, isActive: true },
            { upsert: true, new: true }
        );

        const studentPass = await bcrypt.hash("student123", 10);
        const student1 = await User.findOneAndUpdate(
            { email: "student@ngit.edu" },
            { name: "Aryan Malhotra", password: studentPass, role: UserRole.STUDENT, isActive: true },
            { upsert: true, new: true }
        );
        const student2 = await User.findOneAndUpdate(
            { email: "priya@ngit.edu" },
            { name: "Priya Sharma", password: studentPass, role: UserRole.STUDENT, isActive: true },
            { upsert: true, new: true }
        );

        // --- 2. Courses ---
        console.log("Creating Courses...");
        const coursesData = [
            {
                slug: "iit-jee-foundation-2026",
                title: "IIT-JEE Foundation 2026",
                description: "Complete foundation course for engineering aspirants aiming for Top IITs. Covers deep concepts of Physics, Chemistry, and Mathematics with problem-solving focus.",
                thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070",
                price: 24999, isPublished: true, category: "Engineering"
            },
            {
                slug: "neet-medical-batch-2025",
                title: "NEET Medical Batch 2025",
                description: "Intensive crash course for NEET aspirants covering Biology, Physics, and Chemistry with expert faculty.",
                thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
                price: 18999, isPublished: true, category: "Medical"
            },
            {
                slug: "web-development-mastery",
                title: "Full Stack Web Mastery",
                description: "Learn React, Next.js, and Node.js from scratch to advanced level. Build real-world projects.",
                thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064",
                price: 4999, isPublished: true, category: "Computer Science"
            }
        ];

        const createdCourses = [];
        for (const c of coursesData) {
            const course = await Course.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
            createdCourses.push(course);
        }

        // --- 3. Lessons (IIT-JEE) ---
        console.log("Creating Lessons...");
        const iitCourse = createdCourses[0];
        const neetCourse = createdCourses[1];

        const lessonsData = [
            // IIT Lessons
            { title: "Orientation: Strategy for JEE", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: true, order: 1, duration: "12:00", courseId: iitCourse._id },
            { title: "Physics: Kinematics Basics", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: false, order: 2, duration: "45:30", courseId: iitCourse._id },
            { title: "Maths: Sets & Relations", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: false, order: 3, duration: "38:15", courseId: iitCourse._id },
            { title: "Chemistry: Atomic Structure", type: LessonType.PDF, contentUrl: "https://example.com/notes.pdf", isFree: false, order: 4, duration: "N/A", courseId: iitCourse._id },
            { title: "Maths: Functions & Graphs", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: false, order: 5, duration: "52:10", courseId: iitCourse._id },

            // NEET Lessons
            { title: "Biology: Cell Structure", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: true, order: 1, duration: "30:00", courseId: neetCourse._id },
            { title: "Physics: Optics Introduction", type: LessonType.VIDEO, contentUrl: "dQw4w9WgXcQ", isFree: false, order: 2, duration: "40:00", courseId: neetCourse._id }
        ];

        for (const l of lessonsData) {
            await Lesson.findOneAndUpdate(
                { title: l.title, courseId: l.courseId },
                l,
                { upsert: true }
            );
        }

        // --- 4. Enrollments ---
        console.log("Enrolling Students...");
        // Student 1 in IIT Course
        await Enrollment.findOneAndUpdate(
            { userId: student1._id, courseId: iitCourse._id },
            { progress: 35, isActive: true, enrolledAt: new Date() }, { upsert: true }
        );
        // Student 1 in NEET Course (Just for demo variety)
        await Enrollment.findOneAndUpdate(
            { userId: student1._id, courseId: neetCourse._id },
            { progress: 10, isActive: true, enrolledAt: new Date() }, { upsert: true }
        );

        // --- 5. Quizzes (Mock Tests) ---
        console.log("Creating Mock Tests...");
        const quizzesData = [
            {
                title: "IIT-JEE Unit Test 1: Mechanics",
                description: "Comprehensive test covering Kinematics, Laws of Motion, and Work Energy Power.",
                courseId: iitCourse._id,
                settings: {
                    timeLimit: 60,
                    totalMarks: 20,
                    passingMarks: 8,
                    shuffleQuestions: false,
                    shuffleOptions: false,
                    availableLanguages: ["en"]
                },
                schedule: {
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                    gracePeriodMinutes: 0
                },
                security: {
                    maxAttempts: 1,
                    preventTabSwitch: false,
                    requireFullscreen: false,
                    trackIpDevice: false
                },
                questions: [],
                isPublished: true,
            },
        ];

        for (const q of quizzesData) {
            await Quiz.findOneAndUpdate({ title: q.title }, q, { upsert: true });
        }

        // --- 6. Events ---
        console.log("Creating Events...");
        const eventsData = [
            {
                title: "NGIT Tech Symposium 2026",
                description: "Annual tech fest showcasing student projects and industry talks.",
                date: new Date("2026-04-15T10:00:00"),
                location: "Main Auditorium",
                category: "Technical",
                status: "UPCOMING"
            },
            {
                title: "Career Guidance Workshop",
                description: "Expert session on engineering career paths and college selection.",
                date: new Date("2026-03-20T14:00:00"),
                location: "Seminar Hall B",
                category: "Career",
                status: "UPCOMING"
            }
        ];
        for (const e of eventsData) {
            await Event.findOneAndUpdate({ title: e.title }, e, { upsert: true });
        }

        // --- 7. Materials ---
        console.log("Uploading Materials...");
        const materialsData = [
            {
                title: "JEE Formula Handbook Vol 1",
                course: "IIT-JEE Foundation",
                type: "PDF",
                url: "https://example.com/handbook.pdf",
                size: "4.5 MB"
            },
            {
                title: "Chemistry Periodic Table Chart",
                course: "NEET Medical",
                type: "PDF",
                url: "https://example.com/chart.pdf",
                size: "1.2 MB"
            },
            {
                title: "Physics: Kinematics Problem Set",
                course: "IIT-JEE Foundation",
                type: "PDF",
                url: "https://example.com/physics_problems.pdf",
                size: "2.1 MB"
            }
        ];
        for (const m of materialsData) {
            await Material.findOneAndUpdate({ title: m.title }, m, { upsert: true });
        }

        // --- 8. Payments ---
        console.log("Processing Payments...");
        await Payment.findOneAndUpdate(
            { razorpayOrderId: "order_seed_123456" },
            {
                userId: student1._id,
                courseId: iitCourse._id,
                amount: 24999,
                currency: "INR",
                razorpayOrderId: "order_seed_123456",
                razorpayPaymentId: "pay_seed_987654",
                razorpaySignature: "sig_seed_abcdef",
                status: PaymentStatus.SUCCESS,
                createdAt: new Date("2025-12-15") // Paid a while ago
            },
            { upsert: true }
        );

        // --- 9. Attempts (Mock Test Results) ---
        console.log("Submitting Mock Tests...");
        const calcQuiz = await Quiz.findOne({ title: "Maths Chapter Test: Calculus" });
        if (calcQuiz) {
            // Generate perfect score answers
            const answers = [];

            await Attempt.findOneAndUpdate(
                { studentId: student1._id, quizId: calcQuiz._id },
                {
                    studentId: student1._id,
                    quizId: calcQuiz._id,
                    totalScore: calcQuiz.settings?.totalMarks || 10,
                    totalMarks: calcQuiz.settings?.totalMarks || 10,
                    isPassed: true,
                    startTime: new Date(Date.now() - 1200000),
                    endTime: new Date(),
                    securityLogs: { tabSwitchCount: 0, violations: [] }
                },
                { upsert: true }
            );
        }

        const mechanicsQuiz = await Quiz.findOne({ title: "IIT-JEE Unit Test 1: Mechanics" });
        if (mechanicsQuiz) {
            // Generate partial score answers (3 correct, 2 wrong)
            const answers = [];

            const score = 12; // Example score

            await Attempt.findOneAndUpdate(
                { studentId: student1._id, quizId: mechanicsQuiz._id },
                {
                    studentId: student1._id,
                    quizId: mechanicsQuiz._id,
                    totalScore: score,
                    totalMarks: mechanicsQuiz.settings?.totalMarks || 20,
                    isPassed: score >= (mechanicsQuiz.settings?.passingMarks || 8),
                    startTime: new Date(Date.now() - 86400000 - 2500000), // ~40 mins before yesterday
                    endTime: new Date(Date.now() - 86400000), // Yesterday
                    securityLogs: { tabSwitchCount: 0, violations: [] }
                },
                { upsert: true }
            );
        }


        // --- 10. CMS Content ---
        console.log("Seeding CMS Content...");
        await CMSContent.findOneAndUpdate({ key: "HOME_HERO" }, {
            key: "HOME_HERO",
            data: {
                title: "Empowering Genius Minds",
                subtitle: "Join NGIT's premier coaching programs designed for ambitious students aimed at top-tier success.",
                ctaText: "Explore Courses",
                imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
            }
        }, { upsert: true });

        await CMSContent.findOneAndUpdate({ key: "HOME_SLIDER" }, {
            key: "HOME_SLIDER",
            data: [
                {
                    id: 1,
                    title: "Shape Your Future at NGIT",
                    subtitle: "India's Premier IIT-JEE Coaching Institute",
                    description: "Join 5000+ students who achieved their dreams with our expert faculty and proven teaching methodology",
                    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070",
                    cta1Text: "Download Prospectus",
                    cta1Link: "/prospectus.pdf",
                    cta2Text: "Book Free Demo",
                    cta2Link: "/register",
                },
                {
                    id: 2,
                    title: "98% Success Rate in 2025",
                    subtitle: "Top Ranks in IIT-JEE & NEET",
                    description: "45 students in Top 100 ranks. Experience excellence with NGIT's result-oriented approach",
                    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
                    cta1Text: "View Results",
                    cta1Link: "/results",
                    cta2Text: "Apply Now",
                    cta2Link: "/register",
                },
                {
                    id: 3,
                    title: "World-Class Infrastructure",
                    subtitle: "Modern Classrooms • Digital Library • Smart Labs",
                    description: "Learn in an environment designed for excellence with AC classrooms, hostel facilities, and 24/7 support",
                    image: "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?q=80&w=2070",
                    cta1Text: "Virtual Tour",
                    cta1Link: "/gallery",
                    cta2Text: "Contact Us",
                    cta2Link: "/contact",
                }
            ]
        }, { upsert: true });

        await CMSContent.findOneAndUpdate({ key: "SOCIAL_LINKS" }, {
            key: "SOCIAL_LINKS",
            data: {
                facebook: "https://facebook.com/ngit",
                instagram: "https://instagram.com/ngit_official",
                youtube: "https://youtube.com/ngit_lectures",
                linkedin: "https://linkedin.com/school/ngit"
            }
        }, { upsert: true });

        await CMSContent.findOneAndUpdate({ key: "CONTACT_INFO" }, {
            key: "CONTACT_INFO",
            data: {
                email: "admissions@ngit.edu",
                phone: "+91 98765 43210",
                address: "Neil Gogte Institute of Technology, Hyderabad, Telangana"
            }
        }, { upsert: true });

        // --- 11. Attendance ---
        console.log("Marking Attendance...");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await Attendance.findOneAndUpdate(
            { studentId: student1._id, date: today },
            { studentId: student1._id, date: today, status: AttendanceStatus.PRESENT, markedBy: admin._id },
            { upsert: true }
        );


        console.log("✅ Seeding Completed Successfully!");
        process.exit(0);
    } catch (e: any) {
        console.error("Critical Error in Seed:", e.message);
        console.error("Error Name:", e.name);
        process.exit(1);
    }
})();
