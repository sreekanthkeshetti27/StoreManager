const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const outputFileName = 'project_code.txt'; // The file you will send to me

// Folders to Ignore (CRITICAL: Keeps node_modules out)
const ignoredFolders = ['node_modules', '.git', 'dist', 'build', 'coverage'];

// Files to Ignore
const ignoredFiles = [
    'package-lock.json', 
    'yarn.lock', 
    'generate.js', 
    '.DS_Store', 
    '.env' // KEEP .env HERE to protect your secrets!
];

// File Extensions to Include (MERN Stack specific)
const includedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.html'];

// --- THE LOGIC ---
const outputFile = fs.createWriteStream(outputFileName);

function processDirectory(directory) {
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively go into folders unless they are ignored
            if (!ignoredFolders.includes(item)) {
                processDirectory(fullPath);
            }
        } else {
            // Check file extension and if it's ignored
            const ext = path.extname(item);
            if (includedExtensions.includes(ext) && !ignoredFiles.includes(item)) {
                
                // 1. Write the File Name as a header
                outputFile.write(`\n\n========================================\n`);
                outputFile.write(`File Path: ${fullPath}\n`);
                outputFile.write(`========================================\n\n`);

                // 2. Write the content
                const content = fs.readFileSync(fullPath, 'utf8');
                outputFile.write(content);
            }
        }
    });
}

console.log('Gathering MERN stack files...');
processDirectory(__dirname);
console.log(`\nDone! All code is now in: ${outputFileName}`);