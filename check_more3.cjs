const https = require('https');

const candidates = [
  'OQA_2r6tT70', '1008C36_u2s', 'Ndhts8Q5Vf8', 'oO0N-k5Ff2U',
  '1-s3x-O3VNE', '6nQW_aG1q24', '5yM_M2cED2M', 'eI4an8aSsgw', 'hW-Y0E8x5s0'
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
