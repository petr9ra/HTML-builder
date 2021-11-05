const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const destination = path.join(__dirname, 'project-dist');

async function createFolder () {
  await fsPromises.rm(destination, { recursive: true, force:true });
  await fsPromises.mkdir(destination, { recursive: true });
}

async function writeHtml() {
  const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  const writeHtml = fs.createWriteStream(path.join(destination, 'index.html'));
  let template = '';

  readTemplate.on('data', data => {
    template = data.toString();
    
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, items) => {
      if(err) throw new Error('Error');
      
      items.forEach((item, index) => {
        if (item.isFile() && path.parse(item.name).ext === '.html') {
          const readItem = fs.createReadStream(path.join(__dirname, 'components', item.name));
          
          const itemName = path.parse(item.name).name;
          const regexp = `{{${itemName}}}`;
          readItem.on('data', data => {
            template = template.replace(regexp, data.toString());
            if (index === items.length - 1) {
              writeHtml.write(template);
            }
          });
        }
      });
    });
  });
}

async function createStyles() {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const writeStyle = fs.createWriteStream(path.join(destination, 'style.css'));

    files.forEach(file => {
      const readStyle = fs.createReadStream(path.join(__dirname, 'styles', file.name));
      if (file.isFile() && path.parse(file.name).ext === '.css') {
        readStyle.on('data', function (chunk) {
          writeStyle.write(chunk.toString() + '\n');
        });
      } 
    });
  } catch {
    console.log('Error');
  }
}

async function copyFiles(src, dest) {
  await fsPromises.mkdir(dest, { recursive: true });
  
  try {
    const files = await fsPromises.readdir(src, { withFileTypes: true });
    
    files.forEach(file => {
      if (!file.isDirectory()) {
        fsPromises.copyFile(path.join(src, file.name), path.join(dest, file.name));
      } else {
        copyFiles(path.join(src, file.name), path.join(dest, file.name));
      }
    });
  } catch {
    console.log('Error');
  }
}

async function GoGoGo () {
  await createFolder();
  writeHtml();
  createStyles();
  copyFiles(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

GoGoGo();
