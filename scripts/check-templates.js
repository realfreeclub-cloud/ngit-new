
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI;

const CertificateTemplateSchema = new mongoose.Schema({ name: String });
const CertificateTemplate = mongoose.models.CertificateTemplate || mongoose.model('CertificateTemplate', CertificateTemplateSchema);

async function check() {
    await mongoose.connect(MONGODB_URI);
    const templates = await CertificateTemplate.find().select('name');
    console.log("Existing Templates:", JSON.stringify(templates, null, 2));
    process.exit(0);
}
check();
