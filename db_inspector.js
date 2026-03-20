
const mongoose = require("mongoose");
const fs = require("fs");
const uri = "mongodb+srv://dorusgame_db_user:c8ch9VhqQW8sKZr@cluster0.q1y4bfd.mongodb.net/?appName=Cluster0";

async function check() {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);
    
    fs.writeFileSync("e:/Ngit/db_collections.txt", names.join(", "));
    process.exit(0);
}

check().catch(e => {
    fs.writeFileSync("e:/Ngit/db_collections.txt", e.message);
    process.exit(1);
});
