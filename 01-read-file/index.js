const fs = require('fs');
const path = require('path');

let fileStream = fs.createReadStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });

fileStream.on('data', function (chunk) {
  console.log(chunk);
});


