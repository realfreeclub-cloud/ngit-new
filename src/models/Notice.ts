import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotice extends Document {
    title: string;
    description: string;
    link?: string;
    isActive: boolean;
    showInScroller: boolean;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NoticeSchema: Schema<INotice> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Notice title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Notice full description is required"],
        },
        link: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        showInScroller: {
            type: Boolean,
            default: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Notice: Model<INotice> = mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
export default Notice;
