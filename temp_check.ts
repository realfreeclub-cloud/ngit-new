
import mongoose from "mongoose";
import connectDB from "./src/lib/db";
import CertificateTemplate from "./src/models/CertificateTemplate";

async function check() {
    try {
        await connectDB();
        const all = await CertificateTemplate.find().select("name isDefault");
        console.log("All templates:", JSON.stringify(all, null, 2));
        const def = await CertificateTemplate.findOne({ isDefault: true }).select("_id name");
        console.log("Default Template:", JSON.stringify(def, null, 2));
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

check();
