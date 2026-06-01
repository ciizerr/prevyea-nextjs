const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '.temp/prevyea-client/src/Pages');
const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('Sem') && f.endsWith('.jsx'));

const allRepoPdfs = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    // Find all urls inside pdfs array
    const match = content.match(/const\s+pdfs\s*=\s*\[([\s\S]*?)\];/);
    if (match) {
        const arrayContent = match[1];
        
        const urlRegex = /url:\s*["']([^"']+)["']/g;
        let urlMatch;
        while ((urlMatch = urlRegex.exec(arrayContent)) !== null) {
            const url = urlMatch[1];
            // parse url e.g. /sem1/ge1/2021.pdf
            const parts = url.split('/');
            if (parts.length >= 4) {
                // ['', 'sem1', 'ge1', '2021.pdf']
                const semester = parts[1]; // sem1
                const subject = parts[2]; // ge1
                const year = parseInt(parts[3].replace('.pdf', ''), 10);
                
                allRepoPdfs.push({
                    file: file,
                    semester: semester,
                    subject: subject,
                    year: year,
                    url: url
                });
            }
        }
    }
}

fs.writeFileSync('repo-pyqs.json', JSON.stringify(allRepoPdfs, null, 2));
console.log('Extracted', allRepoPdfs.length, 'pdfs from repo.');
