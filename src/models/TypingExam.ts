import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingExam {
  title: string;
  category: string; // SSC, UP Police, KVS, etc.
  language: "English" | "Hindi";
  passageId: mongoose.Types.ObjectId;
  duration: number; // in minutes
  startTime: Date;
  endTime: Date;
  status: "Draft" | "Active" | "Expired";
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TypingExamSchema = new Schema<ITypingExam>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, enum: ["English", "Hindi"], default: "English" },
    passageId: { type: Schema.Types.ObjectId, ref: "TypingPassage", required: true },
    duration: { type: Number, required: true }, // duration in minutes
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["Draft", "Active", "Expired"], default: "Draft" },
    rules: [{ type: String }],
  },
  { timestamps: true }
);

const TypingExam = models.TypingExam || model("TypingExam", TypingExamSchema);
export default TypingExam;
