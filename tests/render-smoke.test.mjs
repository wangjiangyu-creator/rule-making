import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHome } from '../src/views/home.js';
import { renderTopics } from '../src/views/topics.js';
import { renderDatabase, renderRecordDetail } from '../src/views/database.js';
import { records } from '../src/data/records.js';

test('index renders the static app mount and script', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(html, /<main\s+id="app"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /Great Powers and Rule-Making/);
});

test('view renderers include core portal sections', () => {
  assert.match(renderHome(), /Digital Trade/);
  assert.match(renderTopics(), /Research Topics/);
  assert.match(renderDatabase(), /Rule-Making Records/);
});

test('stylesheet includes database interface selectors', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.filters\b/);
  assert.match(css, /\.record-row\b/);
  assert.match(css, /\.timeline-list\b/);
});

test('database renderer escapes unsafe query text', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?q=<script>' };

  try {
    const html = renderDatabase();

    assert.doesNotMatch(html, /value="<script>"/);
    assert.doesNotMatch(html, /<script>/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});

test('record detail renders unsafe source URLs as plain text', () => {
  const unsafeRecord = {
    id: 'unsafe-source-url-regression',
    title: 'Unsafe Source URL Regression',
    recordType: 'official-statement',
    date: '2026-01-01',
    year: 2026,
    actors: [],
    jurisdictions: [],
    institutions: [],
    topics: [],
    summary: 'A regression fixture for unsafe source URL rendering.',
    sourceAuthority: 'official-government',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Unsafe Source',
        url: 'javascript:alert(1)',
      },
    ],
    citation: 'Unsafe source URL regression fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(unsafeRecord);

  try {
    const html = renderRecordDetail(unsafeRecord.id);

    assert.doesNotMatch(html, /href="javascript:alert\(1\)"/);
    assert.match(html, /Unsafe Source/);
    assert.match(html, /\(invalid source URL\)/);
  } finally {
    records.pop();
  }
});

test('main renders hero content and focuses the app on route changes', async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const originalLocation = globalThis.location;
  const app = {
    innerHTML: '',
    focusCount: 0,
    focus() {
      this.focusCount += 1;
    },
  };
  let hashchangeHandler;

  globalThis.document = {
    querySelector(selector) {
      assert.equal(selector, '#app');
      return app;
    },
  };
  globalThis.window = {
    addEventListener(event, handler) {
      if (event === 'hashchange') {
        hashchangeHandler = handler;
      }
    },
  };
  globalThis.location = { hash: '#/' };

  try {
    const moduleUrl = new URL('../src/main.js', import.meta.url);
    moduleUrl.search = `renderer-smoke=${Date.now()}`;

    await import(moduleUrl.href);

    assert.match(app.innerHTML, /Great Powers and Rule-Making/);
    assert.match(app.innerHTML, /#\/topics\/digital-trade-ecommerce/);
    assert.match(app.innerHTML, /#\/database/);
    assert.equal(app.focusCount, 1);
    assert.equal(typeof hashchangeHandler, 'function');

    globalThis.location.hash = '#/database';
    hashchangeHandler();

    assert.equal(app.focusCount, 2);
  } finally {
    if (originalDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});
