const { renderToBuffer } = require('@react-pdf/renderer');
const React = require('react');
const { Document, Page, Image } = require('@react-pdf/renderer');

async function test() {
    try {
        const doc = React.createElement(Document, null, 
            React.createElement(Page, null, 
                React.createElement(Image, { 
                    src: 'https://via.placeholder.com/150',
                    style: {
                        position: 'absolute',
                        left: 100,
                        top: 100,
                        width: 100,
                        height: 100
                    }
                })
            )
        );
        
        const buffer = await renderToBuffer(doc);
        console.log("Success Buffer length:", buffer.length);
    } catch (e) {
        console.error("Crash:", e.message);
    }
}
test();
