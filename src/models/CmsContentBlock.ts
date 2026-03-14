import mongoose, { Schema, Document } from "mongoose";

export interface ICmsContentBlock extends Document {
    section_id: mongoose.Types.ObjectId;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    button_text?: string;
    button_link?: string;
    sort_order: number;
    extra_data?: any; // For flexible properties like categories, color, icons
    createdAt: Date;
    updatedAt: Date;
}

const CmsContentBlockSchema = new Schema({
    section_id: { type: Schema.Types.ObjectId, ref: 'CmsSection', required: true },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    button_text: { type: String },
    button_link: { type: String },
    sort_order: { type: Number, default: 0 },
    extra_data: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.CmsContentBlock || mongoose.model<ICmsContentBlock>("CmsContentBlock", CmsContentBlockSchema);
