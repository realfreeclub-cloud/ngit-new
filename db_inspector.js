
const mongoose = require("mongoose");
const fs = require("fs");
const uri = "mongodb+srv://dorusgame_db_user:c8ch9VhqQW8sKZr@cluster0.q1y4bfd.mongodb.net/?appName=Cluster0";

async function check() {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const certs = await db.collection("certificates").countDocuments();
    const templates = await db.collection("certificatetemplates").countDocuments();
    const testResults = await db.collection("mocktestresults").countDocuments();
    
    let out = `Database check:\n`;
    out += `- Total Certificates: ${certs}\n`;
    out += `- Total Templates: ${templates}\n`;
    out += `- Total Mock Test Results: ${testResults}\n`;
    
    fs.writeFileSync("e:/Ngit/db_counts.txt", out);
    process.exit(0);
}

check().catch(e => {
    fs.writeFileSync("e:/Ngit/db_counts.txt", e.message);
    process.exit(1);
});
