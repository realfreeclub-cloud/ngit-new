const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const { Document, Page, Image } = require('@react-pdf/renderer');

async function test() {
    try {
        const QRCode = require('qrcode');
        const url = await QRCode.toDataURL('https://ngit-new.vercel.app/verify/TEST');
        
        const doc = React.createElement(Document, null, 
            React.createElement(Page, null, 
                React.createElement(Image, { 
                    src: url,
                    style: {
                        position: 'absolute',
                        left: 100,
                        top: 100,
                        width: 100,
                        height: 100,
                        opacity: 1,
                        transform: undefined,
                        objectFit: 'contain',
                        borderRadius: undefined
                    }
                })
            )
        );
        
        const buffer = await renderToBuffer(doc);
        console.log("Success Buffer:", buffer.length);
    } catch (e) {
        console.error("Crash:", e.message);
    }
}
test();
