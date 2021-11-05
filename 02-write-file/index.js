const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Please enter your text:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    endFunc();
  }
  writeStream.write(data);
});

process.on('SIGINT', endFunc);

function endFunc() {
  stdout.write('Good bye!');
  exit();
}
