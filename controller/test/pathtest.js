let path = require('path');

let workPath = path.resolve('.');
console.log('workPath: ' + workPath);
let filePath = path.join(workPath, 'pub', 'index.html');

console.log("filePath: " + filePath);