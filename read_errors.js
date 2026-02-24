const fs = require('fs');
const path = require('path');
const file = fs.readFileSync(path.join(__dirname, 'build_errors.txt'), 'utf16le');
console.log(file.substring(0, 3000));
