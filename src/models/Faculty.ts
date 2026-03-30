import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaculty extends Document {
    name: string;
    position: string;
    email: string;
    phone: string;
    image?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        image: { type: String },
        qualification: { type: String },
        experience: { type: String },
        specialization: { type: String },
        bio: { type: String },
    },
    { timestamps: true }
);

const Faculty: Model<IFaculty> = mongoose.models.Faculty || mongoose.model<IFaculty>("Faculty", FacultySchema);
export default Faculty;
