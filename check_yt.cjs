const https = require('https');

const videoIds = [
  'ExxFxD4OSc0', 'LpuPe81bc2w', '7T8q6Z7A9J0', 'Q1YqgPAtzho', 'bs2_G28t3Fk',
  'zNzzGgr2mhk', 'F_Riqjdh2oM', 'h876g2nZ1F8', 'mAHC1d_yG5I', 'a1NZC55tZIs',
  'Nii5x3L0Ums', 'F2XvR11rQAc', '1w5y32NbgfE', '98h_K_3xN7g', 'QuR969uMICM',
  'P35F_s_5Wqg', '9g9O58pQ3kU'
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
  for (const id of videoIds) {
    const result = await checkVideo(id);
    console.log(`${result.id}: ${result.status}`);
  }
}
main();
