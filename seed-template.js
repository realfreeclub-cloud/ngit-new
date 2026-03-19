const mongoose = require('mongoose');

// Elements for the "NGIT Professional" Template
const elements = [
    {
        id: "institute_name",
        type: "text",
        content: "NGIT Institute",
        x: 0,
        y: 60,
        width: 842,
        height: 60,
        style: { fontFamily: "Helvetica", fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#1a237e" }
    },
    {
        id: "institute_sub",
        type: "text",
        content: "Run by Chowdhry Law Chambers • ISO 9001:2015 Certified",
        x: 0,
        y: 100,
        width: 842,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 10, textAlign: "center", color: "#666666" }
    },
    {
        id: "title",
        type: "text",
        content: "CERTIFICATE OF COMPLETION",
        x: 0,
        y: 150,
        width: 842,
        height: 50,
        style: { fontFamily: "Helvetica", fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#d4af37", letterSpacing: 2 }
    },
    {
        id: "certify_text",
        type: "text",
        content: "This is to certify that",
        x: 0,
        y: 220,
        width: 842,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 14, textAlign: "center", color: "#333333" }
    },
    {
        id: "student_name",
        type: "text",
        content: "{{student_name}}",
        x: 0,
        y: 250,
        width: 842,
        height: 40,
        style: { fontFamily: "Helvetica", fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#000000" }
    },
    {
        id: "completed_text",
        type: "text",
        content: "has successfully completed the course",
        x: 0,
        y: 300,
        width: 842,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 14, textAlign: "center", color: "#333333" }
    },
    {
        id: "course_name",
        type: "text",
        content: "{{course_name}}",
        x: 0,
        y: 330,
        width: 842,
        height: 30,
        style: { fontFamily: "Helvetica", fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#1a237e" }
    },
    {
        id: "footer_line",
        type: "text",
        content: "with a duration of {{duration}}, achieving a Grade of {{grade}} ({{percentage}}%).",
        x: 0,
        y: 370,
        width: 842,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 12, textAlign: "center", color: "#555555" }
    },
    {
        id: "qr_code",
        type: "image",
        content: "{{qr_code}}",
        x: 390,
        y: 430,
        width: 60,
        height: 60
    },
    {
        id: "verify_label",
        type: "text",
        content: "Scan to Verify",
        x: 390,
        y: 495,
        width: 60,
        height: 10,
        style: { fontFamily: "Helvetica", fontSize: 8, textAlign: "center", color: "#999999" }
    },
    {
        id: "signature_director",
        type: "text",
        content: "Director Academics",
        x: 100,
        y: 500,
        width: 200,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 10, fontWeight: "bold", textAlign: "center", color: "#333333" }
    },
    {
        id: "signature_controller",
        type: "text",
        content: "Exam Controller",
        x: 542,
        y: 500,
        width: 200,
        height: 20,
        style: { fontFamily: "Helvetica", fontSize: 10, fontWeight: "bold", textAlign: "center", color: "#333333" }
    }
];

async function seed() {
    try {
        await mongoose.connect('mongodb+srv://dorusgame_db_user:c8ch9VhqQW8sKZr@cluster0.q1y4bfd.mongodb.net/?appName=Cluster0');
        
        // Unset old defaults
        await mongoose.connection.collection('certificatetemplates').updateMany({}, { $set: { isDefault: false } });

        // Add pre-styled professional template
        await mongoose.connection.collection('certificatetemplates').insertOne({
            name: "Professional Completion Design",
            description: "Default academic layout based on the NGIT Standard certificate design.",
            width: 842,
            height: 595,
            config: { format: "A4", orientation: "landscape", dpi: 72, printMargin: 0 },
            isDefault: true,
            elements: elements,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("Professional Default Template seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
}

seed();
