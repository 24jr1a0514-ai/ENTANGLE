const fs = require('fs');
const content = fs.readFileSync('src/data/curriculum.ts', 'utf8');
const match = content.match(/"([^"]+)":\s*\{\s*"domain":/g);
console.log(match);
