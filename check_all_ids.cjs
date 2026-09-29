const fs = require('fs');
const content = fs.readFileSync('src/data/curriculum.ts', 'utf8');

const startIdx = content.indexOf('"intermediate":');
const endIdx = content.indexOf('"undergraduate":', startIdx);
const intermediateContent = content.substring(startIdx, endIdx);

// Extract chapter objects...
// Let's just find "id": "something"
const regex = /"id":\s*"([^"]+)"/g;
let match;
const ids = new Set();
while ((match = regex.exec(intermediateContent)) !== null) {
  ids.add(match[1]);
}
console.log(Array.from(ids).join(', '));
