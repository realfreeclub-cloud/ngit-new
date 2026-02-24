import mongoose, { Schema, Document, Model } from "mongoose";

export enum QuestionType {
    MCQ_SINGLE = "MCQ_SINGLE",
    MCQ_MULTIPLE = "MCQ_MULTIPLE",
    TRUE_FALSE = "TRUE_FALSE",
    FILL_BLANK = "FILL_BLANK",
    SHORT_ANSWER = "SHORT_ANSWER",
    DESCRIPTIVE = "DESCRIPTIVE",
    PRACTICAL = "PRACTICAL",
    TYPING = "TYPING",
}

export enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

export interface IQuestion extends Document {
    courseId: mongoose.Types.ObjectId;
    topic: string;
    type: QuestionType;
    difficulty: Difficulty;
    content: {
        en: string;
        hi?: string;
    };
    options?: {
        _id?: mongoose.Types.ObjectId;
        text: { en: string; hi?: string };
        isCorrect: boolean;
    }[];
    marks: number;
    negativeMarks: number;
    explanation?: {
        en: string;
        hi?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        topic: { type: String, required: true },
        type: {
            type: String,
            enum: Object.values(QuestionType),
            required: true,
        },
        difficulty: {
            type: String,
            enum: Object.values(Difficulty),
            default: Difficulty.MEDIUM,
        },
        content: {
            en: { type: String, required: true },
            hi: { type: String },
        },
        options: [
            {
                text: {
                    en: { type: String, required: true },
                    hi: { type: String },
                },
                isCorrect: { type: Boolean, default: false },
            },
        ],
        marks: { type: Number, default: 1 },
        negativeMarks: { type: Number, default: 0 },
        explanation: {
            en: { type: String },
            hi: { type: String },
        },
    },
    { timestamps: true }
);

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
