
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./src/models/Media";

dotenv.config({ path: ".env.local" });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const Media = mongoose.model("Media");

    const galleryCount = await Media.countDocuments({});

    console.log("Gallery Images:", galleryCount);

    process.exit(0);
}

check();
