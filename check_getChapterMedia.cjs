const fs = require('fs');

// We can just import chapterMedia.ts if we run it via ts-node, or we can just simulate it.
// Let's use regex to extract INTERMEDIATE_CHAPTER_VIDEOS from chapterMedia.ts
const content = fs.readFileSync('src/data/chapterMedia.ts', 'utf8');

const match = content.match(/const INTERMEDIATE_CHAPTER_VIDEOS[^=]*= \{([\s\S]*?)\n\};\n/);
if (match) {
  const str = match[1];
  const keys = [...str.matchAll(/^\s*'([^']+)'\s*:/gm)].map(m => m[1]);
  
  for (let i = 1; i <= 20; i++) {
    const id = 'int-' + i;
    const hasVideo = keys.includes(id);
    console.log(id, hasVideo ? 'YES' : 'NO');
  }
}
