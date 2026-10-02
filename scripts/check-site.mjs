import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const baseUrl = process.env.LUCIA_SITE_URL || 'http://127.0.0.1:3000';
const options = () => ({ signal: AbortSignal.timeout(20000) });

async function getPage(path, marker) {
    const response = await fetch(new URL(path, baseUrl), options());
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    assert.ok((await response.text()).includes(marker), `${path}: expected page content missing`);
}

await getPage('/', '探索世界');
await getPage('/posts', '所有旅誌');
await getPage('/about', 'About Lucia');

const response = await fetch(new URL('/api/posts', baseUrl), options());
assert.equal(response.status, 200);
const posts = await response.json();
assert.ok(Array.isArray(posts) && posts.length > 0, 'Article index is unavailable');
for (const post of posts) {
    assert.ok(typeof post.slug === 'string' && typeof post.title === 'string');
    await getPage(`/posts/${encodeURIComponent(post.slug)}`, '<article');
}

const missing = await fetch(new URL('/posts/lucia-missing-smoke-test', baseUrl), options());
assert.equal(missing.status, 404, 'Missing articles should return 404');

// Exercise the actual tile provider used by the homepage, including HTTP-200 error images.
const mapSource = await readFile(new URL('../src/components/MapBackground.tsx', import.meta.url), 'utf8');
const template = mapSource.match(/<TileLayer[\s\S]*?url="([^"]+)"/)?.[1];
assert.ok(template, 'Map tile URL is missing');
const tileUrl = template.replace('{s}', 'b').replace('{z}', '3').replace('{x}', '4').replace('{y}', '3').replace('{r}', '@2x');
const tile = await fetch(tileUrl, {
    ...options(),
    headers: { 'User-Agent': 'LuciaOnTheGo/0.1 (+https://github.com/luciahappy123-jpg/luciaonthego)' },
});
assert.equal(tile.status, 200, `Map tiles: HTTP ${tile.status}`);
assert.ok(!/^"?wm-/i.test(tile.headers.get('etag') || ''), 'Map provider returned an API-key watermark instead of a map');
const png = Buffer.from(await tile.arrayBuffer());
assert.ok(png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'Map tile is not a PNG');
console.log(`PASS: homepage, navigation pages, ${posts.length} articles, missing article, and map tile`);
