import { readdir, stat, rename } from 'fs/promises';
import { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const renameFiles = async (dir) => {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      const filePath = join(dir, file);
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        await renameFiles(filePath);
      } else if (extname(file) === '.jsx') {
        const newFilePath = filePath.replace(/\.jsx$/, '.tsx');
        await rename(filePath, newFilePath);
        console.log(`Renamed: ${filePath} -> ${newFilePath}`);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}:`, err);
  }
};

// Resolve the current directory
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, 'src');

// Start renaming from the 'src' directory
renameFiles(srcDir);