import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingPassage {
  title: string;
  content: string;
  language: "English" | "Hindi";
  wordCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: Date;
  updatedAt: Date;
}

const TypingPassageSchema = new Schema<ITypingPassage>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, enum: ["English", "Hindi"], default: "English" },
    wordCount: { type: Number, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  },
  { timestamps: true }
);

const TypingPassage = models.TypingPassage || model("TypingPassage", TypingPassageSchema);
export default TypingPassage;
