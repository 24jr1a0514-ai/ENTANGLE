const https = require('https');

const candidates = [
  'jNQXAC9IVRw', 'dQw4w9WgXcQ', 'tPEE9ZwTmy0', '9bZkp7q19f0', 'kJQP7kiw5Fk'
];

async function checkVideo(id) {
  return new Promise((resolve) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve({ id, status: 'OK' });
      } else {
        resolve({ id, status: `UNAVAILABLE (${res.statusCode})` });
      }
    }).on('error', (e) => {
      resolve({ id, status: `ERROR (${e.message})` });
    });
  });
}

async function main() {
  const valid = [];
  for (const id of candidates) {
    const result = await checkVideo(id);
    if (result.status === 'OK') {
      valid.push(id);
    }
  }
  console.log(`Found ${valid.length} valid videos:`);
  console.log(valid.join(', '));
}
main();
