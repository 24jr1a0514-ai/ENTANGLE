const https = require('https');

const candidates = [
  'LpuPe81bc2w', 'Q1YqgPAtzho', 'zNzzGgr2mhk', 'F_Riqjdh2oM', 'QuR969uMICM', // the 5 OK
  'O4wP10Y-G3Y', '9w-9oG67V7k', 'J6xVd8oP810', '65Oa-O_dJ2k', // search 1
  'JhHMJCUmq28', 'g_IaVepNDT4', '-ZliupK6OGs', 'wB_P_aD8F6Y', // more
  'lZAxgE8p-dE', 'owHKOUj4Gv8', '1a-pP1R-RGA', 'UjaK7yT4n9U',
  'kQJ4_5-Vq0s', 'R-v2Dk_dF-4', 'bU1RzS-50eM', '3Q6J8bX_aWk'
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
