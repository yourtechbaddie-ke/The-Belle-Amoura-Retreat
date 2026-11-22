import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function copyRecursive(src, dest, options = {}) {
  const { exclude = [] } = options;
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      const rel = path.relative(rootDir, path.join(src, entry)).replace(/\\/g, '/');
      if (exclude.some((pattern) => rel === pattern || rel.startsWith(pattern + '/'))) {
        continue;
      }
      copyRecursive(path.join(src, entry), path.join(dest, entry), options);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Clean dist/
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// 2. Copy public/ to dist/ and dist/public/ (mirrors Express static mounts)
copyRecursive(path.join(rootDir, 'public'), distDir);
copyRecursive(path.join(rootDir, 'public'), path.join(distDir, 'public'));

// 3. Copy src/ (excluding server-only modules and legacy unused api/migrations)
copyRecursive(path.join(rootDir, 'src'), distDir, {
  exclude: ['src/api', 'src/migrations', 'src/whatsapp-service.js']
});

// 4. Copy portals/ to dist/portals/
copyRecursive(path.join(rootDir, 'portals'), path.join(distDir, 'portals'));

console.log('[Build] Static output assembled into dist/ for Vercel deployment.');
