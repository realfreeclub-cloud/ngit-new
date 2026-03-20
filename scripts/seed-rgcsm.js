
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const CertificateTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    backgroundImage: { type: String },
    width: { type: Number, default: 842 },
    height: { type: Number, default: 595 },
    config: {
        format: { type: String, default: 'A4' },
        orientation: { type: String, default: 'landscape' },
        dpi: { type: Number, default: 72 },
        printMargin: { type: Number, default: 0 }
    },
    elements: [
        {
            id: { type: String, required: true },
            type: { type: String, enum: ["text", "image", "qrcode"], required: true },
            content: { type: String, default: "" },
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            width: { type: Number },
            height: { type: Number },
            rotation: { type: Number, default: 0 },
            opacity: { type: Number, default: 1 },
            locked: { type: Boolean, default: false },
            hidden: { type: Boolean, default: false },
            style: {
                fontFamily: { type: String, default: "Inter" },
                fontSize: { type: Number, default: 12 },
                fontWeight: { type: String, default: "normal" },
                textAlign: { type: String, default: "left" },
                color: { type: String, default: "#000000" },
                letterSpacing: { type: Number, default: 0 },
                lineHeight: { type: Number, default: 1.2 },
                borderRadius: { type: Number, default: 0 },
                boxShadow: { type: String },
                objectFit: { type: String, default: "contain" }
            }
        },
    ],
    isDefault: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const CertificateTemplate = mongoose.models.CertificateTemplate || mongoose.model('CertificateTemplate', CertificateTemplateSchema);

async function run() {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const elements = [
        { id: '1', type: 'text', content: 'S.N. CA2K5002610', x: 420, y: 30, style: { fontSize: 8, fontFamily: 'Helvetica', textAlign: 'right' } },
        { id: '2', type: 'text', content: 'An ISO 9001 : 2015 Certified Org.', x: 0, y: 45, width: 595, style: { fontSize: 8, fontFamily: 'Helvetica', textAlign: 'center' } },
        { id: '3', type: 'image', content: '/certificates/rgcsm_logo.png', x: 197, y: 55, width: 200, height: 60, style: { objectFit: 'contain' } },
        { id: '4', type: 'text', content: 'A National Programme of Vocational Education & Development', x: 0, y: 115, width: 595, style: { fontSize: 10, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '5', type: 'text', content: '(An Autonomous Institution Registered Under the Socitp, NCT New Delhi, PT Act and MCA Act)', x: 0, y: 128, width: 595, style: { fontSize: 8, fontFamily: 'Helvetica', textAlign: 'center' } },
        { id: '6', type: 'text', content: 'Ministry of Corporate Affairs', x: 0, y: 155, width: 595, style: { fontSize: 10, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '7', type: 'text', content: 'Govt. of India', x: 0, y: 190, width: 595, style: { fontSize: 20, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '8', type: 'text', content: 'Certificate', x: 0, y: 240, width: 595, style: { fontSize: 40, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold', color: '#1B8A4F' } },
        { id: '9', type: 'text', content: 'This is to Certify that', x: 0, y: 295, width: 595, style: { fontSize: 24, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold', color: '#2B78BC' } },
        { id: '10', type: 'text', content: '{{student_name}}', x: 0, y: 340, width: 595, style: { fontSize: 16, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold', color: '#000000' } },
        { id: '11', type: 'text', content: 'attended the', x: 0, y: 365, width: 595, style: { fontSize: 11, fontFamily: 'Helvetica', textAlign: 'center' } },
        { id: '12', type: 'text', content: '{{course_name}}', x: 0, y: 385, width: 595, style: { fontSize: 14, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold', color: '#000000' } },
        { id: '13', type: 'text', content: 'Course during {{issue_date}}', x: 0, y: 415, width: 595, style: { fontSize: 11, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '14', type: 'text', content: 'Conducted by RGCSM SOCIETY', x: 0, y: 440, width: 595, style: { fontSize: 11, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '15', type: 'text', content: 'and obtained the grade "{{grade}}"', x: 0, y: 500, width: 595, style: { fontSize: 11, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '16', type: 'text', content: 'Enrollment No. : {{enrollment_number}}', x: 0, y: 560, width: 595, style: { fontSize: 11, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '17', type: 'text', content: 'ASC Name : {{institute_name}}', x: 0, y: 590, width: 595, style: { fontSize: 10, fontFamily: 'Helvetica', textAlign: 'center', fontWeight: 'bold' } },
        { id: '18', type: 'text', content: 'Date of Issue : {{issue_date}}', x: 100, y: 650, width: 200, style: { fontSize: 10, fontFamily: 'Helvetica', textAlign: 'left', fontWeight: 'bold' } },
        { id: '19', type: 'qrcode', content: '{{qr_code}}', x: 267, y: 700, width: 60, height: 60 },
        { id: '20', type: 'image', content: '{{student_photo}}', x: 480, y: 220, width: 70, height: 90, style: { objectFit: 'cover', borderRadius: 4 } }
    ];

    const template = await CertificateTemplate.create({
        name: 'RGCSM Skills A4 Portrait',
        description: 'New Premium layout identical to the reference image.',
        width: 595,
        height: 842,
        backgroundImage: '/certificates/rgcsm_bg.png',
        config: {
            format: 'A4',
            orientation: 'portrait',
            dpi: 72,
            printMargin: 0
        },
        elements,
        isDefault: false
    });

    console.log("Template created with ID:", template._id);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
