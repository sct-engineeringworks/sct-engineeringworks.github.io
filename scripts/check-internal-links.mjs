import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const dist = resolve('dist');

if (!existsSync(dist)) {
  throw new Error('dist does not exist. Run npm run build first.');
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeExists(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return existsSync(join(dist, 'index.html'));
  const relative = clean.replace(/^\//, '');
  return (
    existsSync(join(dist, relative)) ||
    existsSync(join(dist, relative, 'index.html')) ||
    existsSync(join(dist, `${relative}.html`))
  );
}

const failures = [];
const htmlFiles = walk(dist).filter((file) => extname(file) === '.html');

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith('/') && !href.startsWith('//') && !routeExists(href)) {
      failures.push(`${file.replace(`${dist}/`, '')}: ${href}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} pages: no broken internal links.`);

