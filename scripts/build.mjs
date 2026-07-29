import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

function commitIdentifier() {
  try { return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); }
  catch { return 'local-uncommitted'; }
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/assets/app.js',
  sourcemap: true,
  minify: true,
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_COMMIT__: JSON.stringify(commitIdentifier())
  },
  loader: { '.png': 'file', '.svg': 'file' }
});
let html = await readFile('index.html', 'utf8');
html = html
  .replace('<script type="module" src="/src/main.js"></script>', '<link rel="stylesheet" href="./assets/app.css"><script type="module" src="./assets/app.js"></script>');
await writeFile('dist/index.html', html);
for (const file of ['README.md', 'CHANGELOG.md', 'RELEASE_NOTES.md']) await cp(file, `dist/${file}`);
console.log('Static build written to dist/.');
