const https = require('https');

const candidates = [
  'O5nskjZ_GoI', 'LN0ucKNX0hc', '1GSjbWt0c9M', 'I0-izyq6q5s', '3tc8sJ19l1M',
  'qHxx8LlYivU', 'tpIctyqH29Q', '7G0EwMOLRuc', 'z1p_8lY0_9o', 'mCq8-xTH7jA',
  'g-7rDIfK8Zk', 'wB_P_aD8F6Y', 'lZAxgE8p-dE', 'owHKOUj4Gv8', '1a-pP1R-RGA',
  'UjaK7yT4n9U', 'kQJ4_5-Vq0s', 'R-v2Dk_dF-4', 'bU1RzS-50eM', '3Q6J8bX_aWk'
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
