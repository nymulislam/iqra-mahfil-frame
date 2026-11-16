const fs = require('fs');
const path = require('path');

const url = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

async function run() {
  const fontsDir = path.join(__dirname, '..', 'public', 'assets', 'fonts');
  fs.mkdirSync(fontsDir, { recursive: true });

  console.log('Fetching Google Fonts CSS...');
  const res = await fetch(url, { headers });
  const css = await res.text();

  const blocks = [...css.matchAll(/\/\* ([^*]+) \*\/\s*@font-face\s*\{([^}]+)\}/g)];
  const rules = [];

  for (const [, subsetRaw, body] of blocks) {
    const subset = subsetRaw.trim().replace(/\s+/g, '-');
    const weightMatch = body.match(/font-weight:\s*(\d+);/);
    const styleMatch = body.match(/font-style:\s*([^;]+);/);
    const urlMatch = body.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    const rangeMatch = body.match(/unicode-range:\s*([^;]+);/);

    if (weightMatch && urlMatch) {
      const weight = weightMatch[1];
      const fontUrl = urlMatch[1];
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const range = rangeMatch ? rangeMatch[1].trim() : '';

      const filename = `hind-siliguri-${subset}-${weight}.woff2`;
      const filePath = path.join(fontsDir, filename);

      console.log(`Downloading ${subset} ${weight} -> ${filename}`);
      const fRes = await fetch(fontUrl, { headers });
      const buffer = Buffer.from(await fRes.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      rules.push(`/* ${subset} */\n@font-face {\n  font-family: 'Hind Siliguri';\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url('/assets/fonts/${filename}') format('woff2');\n  unicode-range: ${range};\n}`);
    }
  }

  const outCss = rules.join('\n\n');
  fs.writeFileSync(path.join(fontsDir, 'fonts.css'), outCss, 'utf8');
  console.log(`\nSuccessfully downloaded ${rules.length} font files to public/assets/fonts/`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
