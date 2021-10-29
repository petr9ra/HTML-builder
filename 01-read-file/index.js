const fs = require('fs');
const path = require('path');

let fileStream = fs.createReadStream('./01-read-file/text.txt');

fileStream.on('data', function (chunk) {
  console.log(chunk.toString());
});


