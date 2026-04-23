import mongoose, { Schema, model, models } from "mongoose";

export interface ITypingResult {
  userId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  totalCharacters: number;
  timeTaken: number; // in seconds
  submittedText: string;
  createdAt: Date;
}

const TypingResultSchema = new Schema<ITypingResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "TypingExam", required: true },
    wpm: { type: Number, required: true },
    rawWpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    errors: { type: Number, required: true },
    totalCharacters: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    submittedText: { type: String, required: true },
  },
  { timestamps: true }
);

const TypingResult = models.TypingResult || model("TypingResult", TypingResultSchema);
export default TypingResult;
