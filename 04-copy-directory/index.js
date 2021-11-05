const path = require('path');
const fsPromises = require('fs/promises');

const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

async function copyFiles(src, dest) {
  await fsPromises.rm(dest, { recursive: true, force: true });
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
    console.log('Files have been copied.');
  } catch {
    console.log('Error');
  }
}

copyFiles(src, dest);
