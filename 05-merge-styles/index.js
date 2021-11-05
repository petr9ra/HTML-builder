const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(source, { withFileTypes: true }, (err, items) => {
  if(err) throw err;
  
  const writeStream = fs.createWriteStream(destination);
  items.forEach(item => {
    const readStream = fs.createReadStream(path.join(source, item.name));
    if (item.isFile() && path.parse(item.name).ext === '.css') {
      readStream.on('data', function (chunk) {
        writeStream.write(chunk.toString() + '\n');
      });
    }
  });
});
