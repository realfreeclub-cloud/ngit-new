const QRCode = require('qrcode');
async function test() {
    try {
        const url = await QRCode.toDataURL('https://ngit-new.vercel.app/verify/NGIT/2026/FSD/001');
        console.log("Success! Length:", url.length);
        console.log("Starts with:", url.substring(0, 30));
    } catch (e) {
        console.error("FAIL", e);
    }
}
test();
