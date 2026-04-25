import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function prerender() {
  const template = fs.readFileSync(path.resolve(root, 'dist/client/index.html'), 'utf-8');
  const { render } = await import(path.resolve(root, 'dist/server/entry-server.js'));
  const appHtml = render();
  const html = template.replace('<!--app-html-->', appHtml);
  fs.writeFileSync(path.resolve(root, 'dist/client/index.html'), html);
  console.log('Prerender complete.');
}

prerender();
