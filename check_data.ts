
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./src/models/Course";
import "./src/models/Faculty";
import "./src/models/Attempt";

dotenv.config({ path: ".env.local" });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Course = mongoose.model("Course");
    const Faculty = mongoose.model("Faculty");
    const Attempt = mongoose.model("Attempt");

    const coursesCount = await Course.countDocuments({ isPublished: true });
    const facultyCount = await Faculty.countDocuments({});
    const resultsCount = await Attempt.countDocuments({ status: "EVALUATED" });

    console.log("Published Courses:", coursesCount);
    console.log("Faculty Members:", facultyCount);
    console.log("Evaluated Results:", resultsCount);

    process.exit(0);
}

check();
