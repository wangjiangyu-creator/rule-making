import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHome } from '../src/views/home.js';
import { renderTopics } from '../src/views/topics.js';
import { renderDatabase } from '../src/views/database.js';

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
