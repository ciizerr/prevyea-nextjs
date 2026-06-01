const fs = require('fs');

const repoData = JSON.parse(fs.readFileSync('repo-pyqs.json', 'utf8'));
const dbData = JSON.parse(fs.readFileSync('existing-pyqs.json', 'utf8'));

// Normalize repo data
// repo: { semester: 'sem1', subject: 'ge1', year: 2021 } -> Sem 1, GE-1, 2021
const repoNormalized = repoData.map(r => {
    let sem = r.semester.replace('sem', 'Sem ');
    let sub = r.subject.toUpperCase();
    if (sub === 'AECC11') sub = 'AECC-1'; // fixing a typo in SemOne.jsx
    if (sub.length > 3 && !sub.includes('-')) {
        // e.g. AECC1 -> AECC-1
        sub = sub.replace(/(\D+)(\d+)/, '$1-$2');
    } else if (sub.length <= 3 && !sub.includes('-')) {
        // cc1 -> CC-1
        sub = sub.replace(/(\D+)(\d+)/, '$1-$2');
    }
    return {
        key: `${sem}_${sub}_${r.year}`,
        semester: sem,
        subject: sub,
        year: r.year,
        originalUrl: r.url
    };
});

// Normalize db data
// db: { semester: 'Sem 1', subjectName: 'CC-2', year: 2026 }
const dbNormalized = dbData.map(d => {
    let sem = d.semester;
    let sub = d.subjectName;
    return {
        key: `${sem}_${sub}_${d.year}`,
        semester: sem,
        subject: sub,
        year: d.year,
        title: d.title
    };
});

const dbKeys = new Set(dbNormalized.map(d => d.key));

const missing = [];
for (const r of repoNormalized) {
    if (!dbKeys.has(r.key)) {
        missing.push(r);
    }
}

let existingMd = '# Existing PYQs in Database\n\n| Semester | Subject | Year | Title |\n|---|---|---|---|\n';
dbNormalized.forEach(d => {
    existingMd += `| ${d.semester} | ${d.subject} | ${d.year} | ${d.title} |\n`;
});

let missingMd = '# Missing PYQs (in Repo but not in DB)\n\n| Semester | Subject | Year | Original URL |\n|---|---|---|---|\n';
missing.forEach(m => {
    missingMd += `| ${m.semester} | ${m.subject} | ${m.year} | ${m.originalUrl} |\n`;
});

fs.writeFileSync('C:/Users/mitsu/.gemini/antigravity-ide/brain/a927238f-6608-44a7-a68a-96d00de7325e/existing_pyqs.md', existingMd);
fs.writeFileSync('C:/Users/mitsu/.gemini/antigravity-ide/brain/a927238f-6608-44a7-a68a-96d00de7325e/missing_pyqs.md', missingMd);

console.log(`Found ${dbNormalized.length} existing and ${missing.length} missing.`);
