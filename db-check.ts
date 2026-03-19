
import mongoose from "mongoose";
import Question from "./src/models/Question";
import Quiz from "./src/models/Quiz";
import connectDB from "./src/lib/db";

async function check() {
    await connectDB();
    const questionsCount = await Question.countDocuments();
    const quizzesCount = await Quiz.countDocuments();
    console.log("Questions Count:", questionsCount);
    console.log("Quizzes Count:", quizzesCount);
    
    if (questionsCount > 0) {
        const sample = await Question.findOne().lean();
        console.log("Sample Question:", JSON.stringify(sample, null, 2));
    }
    
    process.exit(0);
}

check();
