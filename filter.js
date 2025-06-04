
import fs from "fs";
import path from "path";

if (process.argv.length < 3) {
    console.error('Usage: node filter.js <input.json>');
    process.exit(1);
}

const inputPath = process.argv[2];

// 1. Read & parse the input file
let data;
try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    data = JSON.parse(raw);
    if (!Array.isArray(data)) {
        throw new Error('Expected JSON array at top level');
    }
} catch (err) {
    console.error('Error reading/parsing input JSON:', err.message);
    process.exit(1);
}

// 2. Filter into two arrays
const withName = data.filter(item =>
    Object.prototype.hasOwnProperty.call(item, 'name')
);
const withoutName = data.filter(item =>
    !Object.prototype.hasOwnProperty.call(item, 'name')
);

// 3. Write the two output files next to the input
const outDir = path.dirname(inputPath);

fs.writeFileSync(
    path.join(outDir, 'with_name.json'),
    JSON.stringify(withName, null, 2),
    'utf8'
);

fs.writeFileSync(
    path.join(outDir, 'without_name.json'),
    JSON.stringify(withoutName, null, 2),
    'utf8'
);

console.log('→ Wrote with_name.json and without_name.json');