import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = process.argv[2] || 'theme/before';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { path: '', name: 'home' },
  { path: 'about', name: 'about' },
  { path: 'projects', name: 'projects' },
  { path: 'projects/crowdaxis', name: 'project-detail' },
  { path: 'experience', name: 'experience' },
  { path: 'contact', name: 'contact' },
  { path: '404-nonexistent-page', name: '404' }
];

const viewports = [
  { width: 390, height: 844, name: '390' },
  { width: 768, height: 1024, name: '768' },
  { width: 1280, height: 720, name: '1280' },
  { width: 1920, height: 1080, name: '1920' }
];

const baseUrl = 'http://localhost:3005';

console.log(`Starting screenshots capture into ${outDir}...`);
for (const r of routes) {
  for (const v of viewports) {
    const filename = `${r.name}-${v.name}.png`;
    const targetPath = path.join(outDir, filename);
    const url = `${baseUrl}/${r.path}`;
    console.log(`Capturing ${url} at ${v.width}x${v.height} -> ${targetPath}`);
    try {
      execFileSync('npx.cmd', [
        'playwright',
        'screenshot',
        '--channel', 'msedge',
        `--viewport-size="${v.width},${v.height}"`,
        url,
        targetPath
      ], { stdio: 'inherit', shell: true });
    } catch (err) {
      console.error(`Failed to capture ${url} at ${v.name}:`, err.message);
    }
  }
}
console.log('Finished capturing screenshots.');
