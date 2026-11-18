const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let PORT = parseInt(process.env.PORT || '8788', 10);
const OUT_DIR = path.join(__dirname, '..', 'out');
const PUBLIC_DIR = fs.existsSync(OUT_DIR) ? OUT_DIR : path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    const ips = getLocalIPs();
    console.log('\n==================================================');
    console.log(' 🚀 ইক্বরা মাহফিল ফ্রেম — লোকাল সার্ভার চালু হয়েছে!');
    console.log('==================================================');
    console.log(`\n 💻 আপনার পিসির ব্রাউজারে খুলুন:`);
    console.log(`    http://localhost:${port}`);

    if (ips.length > 0) {
      console.log(`\n 📱 একই ওয়াইফাইয়ে আপনার মোবাইল দিয়ে দেখুন:`);
      ips.forEach(ip => {
        console.log(`    http://${ip}:${port}`);
      });
    }
    console.log('\n বন্ধ করতে কীবোর্ডে Ctrl + C চাপুন।');
    console.log('==================================================\n');
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ পোর্ট ${PORT} ব্যস্ত আছে, পরবর্তী পোর্ট চেষ্টা করা হচ্ছে...`);
    PORT++;
    startServer(PORT);
  } else {
    console.error(err);
  }
});

startServer(PORT);
