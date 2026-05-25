import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('index renders the static app mount and script', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<main\s+id="app"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /Great Powers and Rule-Making/);
});
