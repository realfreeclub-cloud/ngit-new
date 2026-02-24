import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        image: { type: String },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
