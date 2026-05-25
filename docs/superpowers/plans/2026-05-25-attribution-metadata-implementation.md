# Attribution Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add structured author and publisher metadata to the portal so attribution appears cleanly on record detail pages, list views, and search.

**Architecture:** Add explicit `authors` and `publisher` support to the record schema, centralize attribution formatting in a small helper module, and thread the formatted output through existing list/detail renderers without changing the topic-first site structure. Roll out the data enrichment in a first pass across representative academic, institutional, and official records so the new UI ships with visible value.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, structured ES-module data files, Node built-in test runner.

**Git note:** `git` is not available in PATH on this machine, so this plan uses verification checkpoints instead of commit steps. If a usable git binary appears during execution, commit after each completed task.

---

## File Structure

- Create: `src/lib/attribution.js`
- Create: `tests/attribution.test.mjs`
- Create: `docs/superpowers/plans/2026-05-25-attribution-metadata-implementation.md`
- Modify: `src/data/schema.js`
- Modify: `src/lib/search.js`
- Modify: `src/views/home.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/actors.js`
- Modify: `src/views/dimensions.js`
- Modify: `src/views/institutions.js`
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

### Task 1: Lock the attribution behavior with failing tests

**Files:**
- Create: `tests/attribution.test.mjs`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/attribution.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Create a failing helper test file**

Create `tests/attribution.test.mjs` to define the helper surface before production code exists.

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authorDisplay,
  attributionDisplay,
  hasAttribution,
} from '../src/lib/attribution.js';

test('authorDisplay joins multiple authors naturally', () => {
  assert.equal(
    authorDisplay([
      { name: 'Judith Goldstein', kind: 'person' },
      { name: 'Miles Kahler', kind: 'person' },
      { name: 'Robert O. Keohane', kind: 'person' },
    ]),
    'Judith Goldstein, Miles Kahler, and Robert O. Keohane',
  );
});

test('attributionDisplay combines authors and publisher', () => {
  assert.equal(
    attributionDisplay({
      authors: [{ name: 'Richard H. Steinberg', kind: 'person' }],
      publisher: 'Cambridge University Press',
    }),
    'Richard H. Steinberg | Cambridge University Press',
  );
});

test('attributionDisplay falls back to publisher-only when authors are absent', () => {
  assert.equal(
    attributionDisplay({ publisher: 'World Trade Organization' }),
    'World Trade Organization',
  );
});

test('hasAttribution is false when neither authors nor publisher is present', () => {
  assert.equal(hasAttribution({}), false);
});
```

- [ ] **Step 2: Extend the data-model test with author-shape checks**

Update `tests/data-model.test.mjs` so structured attribution fields are validated when present.

```js
import {
  authorKinds,
  languageStatuses,
  recordTypes,
  sourceAuthorities,
  sourceLinkTypes,
} from '../src/data/schema.js';

const expectedAuthorKinds = ['person', 'institution'];

test('schema lists allowed attribution categories', () => {
  assert.deepEqual(authorKinds, expectedAuthorKinds);
});

test('records use valid attribution fields when present', () => {
  for (const record of records) {
    if (record.authors) {
      assert.ok(Array.isArray(record.authors), `${record.id} authors is an array`);
      assert.ok(record.authors.length >= 1, `${record.id} authors is not empty`);

      for (const author of record.authors) {
        assert.ok(author.name.length >= 3, `${record.id} author has a display name`);
        assert.ok(authorKinds.includes(author.kind), `${record.id} author uses a valid kind`);
      }
    }

    if (record.publisher) {
      assert.ok(record.publisher.length >= 3, `${record.id} publisher is descriptive`);
    }
  }
});
```

- [ ] **Step 3: Add failing render-smoke coverage for list and detail attribution**

Extend `tests/render-smoke.test.mjs` with one real record and one fixture record.

```js
test('record detail renders attribution metadata when present', () => {
  const html = renderRecordDetail('un-governing-ai-humanity-2024');

  assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence/);
  assert.match(html, /Publisher/);
  assert.match(html, /United Nations/);
});

test('database list renderer shows compact attribution lines', () => {
  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/database?topic=ai-governance' };

  try {
    const html = renderDatabase();

    assert.match(html, /United Nations High-Level Advisory Body on Artificial Intelligence \| United Nations/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});
```

- [ ] **Step 4: Run the focused tests and verify they fail for the expected reason**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\attribution.test.mjs tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL because `src/lib/attribution.js` and `authorKinds` do not exist yet, the search/render layers do not know about attribution, and no records have been enriched with the new fields.

### Task 2: Add the attribution schema, helper, and search support

**Files:**
- Create: `src/lib/attribution.js`
- Modify: `src/data/schema.js`
- Modify: `src/lib/search.js`
- Test: `tests/attribution.test.mjs`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Add the closed author-kind vocabulary to the schema**

Extend `src/data/schema.js`:

```js
export const authorKinds = [
  'person',
  'institution',
];
```

- [ ] **Step 2: Create the attribution helper**

Add `src/lib/attribution.js` with small string-formatting helpers that stay view-agnostic.

```js
function asList(value) {
  return Array.isArray(value) ? value : [];
}

function cleanText(value) {
  return String(value ?? '').trim();
}

export function authorDisplay(authors) {
  const names = asList(authors)
    .map((author) => cleanText(author?.name))
    .filter(Boolean);

  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

export function attributionDisplay(record) {
  const authorText = authorDisplay(record?.authors);
  const publisherText = cleanText(record?.publisher);

  if (authorText && publisherText) return `${authorText} | ${publisherText}`;
  return authorText || publisherText;
}

export function hasAttribution(record) {
  return attributionDisplay(record).length > 0;
}
```

- [ ] **Step 3: Add attribution fields to searchable record text**

Extend `recordSearchText()` in `src/lib/search.js`:

```js
function authorNames(authors) {
  return asList(authors).map((author) => author?.name);
}

export function recordSearchText(record) {
  return [
    record.title,
    record.alternateTitle,
    record.summary,
    record.recordType,
    record.sourceAuthority,
    record.languageStatus,
    record.publisher,
    ...authorNames(record.authors),
    record.year,
    ...
  ]
```

- [ ] **Step 4: Run the helper and schema tests until they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\attribution.test.mjs tests\data-model.test.mjs
```

Expected: PASS for the helper API and schema/search invariants, while the render-smoke test still fails because the UI has not been upgraded yet.

### Task 3: Render attribution in list views and record detail pages

**Files:**
- Modify: `src/views/home.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/actors.js`
- Modify: `src/views/dimensions.js`
- Modify: `src/views/institutions.js`
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Thread the formatted attribution line into every record-list renderer**

Import the helper and render a muted line under record titles in:

- `src/views/home.js`
- `src/views/topics.js`
- `src/views/actors.js`
- `src/views/dimensions.js`
- `src/views/institutions.js`
- `src/views/database.js`

Pattern:

```js
import { attributionDisplay } from '../lib/attribution.js';

function renderRecordRow(record) {
  const attribution = attributionDisplay(record);

  return `
    <article class="record-row">
      <p class="eyebrow">...</p>
      <h3><a href="#/records/${escapeHtml(record.id)}">${escapeHtml(record.title)}</a></h3>
      ${attribution ? `<p class="record-attribution">${escapeHtml(attribution)}</p>` : ''}
      <p>${escapeHtml(record.summary)}</p>
    </article>
  `;
}
```

- [ ] **Step 2: Add top-of-page attribution plus metadata rows on record detail pages**

Update `src/views/database.js`:

```js
import { attributionDisplay, authorDisplay } from '../lib/attribution.js';

export function renderRecordDetail(recordId) {
  const record = records.find((item) => item.id === recordId);
  const attribution = attributionDisplay(record);
  const authors = authorDisplay(record.authors);

  return `
    <article class="record-detail">
      <section class="page-hero">
        <p class="eyebrow">${escapeHtml(recordTypeLabel(record.recordType))}</p>
        <h1>${escapeHtml(record.title)}</h1>
        ${record.alternateTitle ? `<p class="lede">${escapeHtml(record.alternateTitle)}</p>` : ''}
        ${attribution ? `<p class="record-attribution record-attribution-detail">${escapeHtml(attribution)}</p>` : ''}
      </section>

      <section>
        <h2>Summary</h2>
        <p>${escapeHtml(record.summary)}</p>
      </section>

      <section>
        <h2>Metadata</h2>
        <dl>
          ${authors ? `<dt>Authors</dt><dd>${escapeHtml(authors)}</dd>` : ''}
          ${record.publisher ? `<dt>Publisher</dt><dd>${escapeHtml(record.publisher)}</dd>` : ''}
          ...
        </dl>
      </section>
```

- [ ] **Step 3: Add compact editorial styling for attribution lines**

Extend `src/styles.css`:

```css
.record-attribution {
  margin: 0;
  color: var(--color-muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
}

.record-attribution-detail {
  margin-top: 1rem;
  font-size: 0.98rem;
}
```

- [ ] **Step 4: Run the renderer-focused tests until they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\render-smoke.test.mjs tests\attribution.test.mjs
```

Expected: PASS, with compact attribution lines on record lists and structured attribution metadata on record detail pages.

### Task 4: Enrich representative records with structured authors and publishers

**Files:**
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `tests/data-model.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Enrich high-value official and institutional records in `src/data/records.js`**

Add structured attribution to:

- `wto-work-programme-electronic-commerce-1998`
- `wto-agreement-electronic-commerce-2024`
- `china-data-security-law-2021`
- `eu-artificial-intelligence-act-2024`

Pattern:

```js
authors: [
  { name: 'WTO General Council', kind: 'institution' },
],
publisher: 'World Trade Organization',
```

```js
authors: [
  { name: "Standing Committee of the National People's Congress", kind: 'institution' },
],
publisher: "National People's Congress of the People's Republic of China",
```

```js
authors: [
  { name: 'European Parliament', kind: 'institution' },
  { name: 'Council of the European Union', kind: 'institution' },
],
publisher: 'European Union',
```

- [ ] **Step 2: Enrich representative scholarship and report records in `src/data/records-third-batch.js`**

Add structured attribution to:

- `un-governing-ai-humanity-2024`
- `krasner-structural-causes-regime-consequences-1982`
- `goldstein-kahler-keohane-slaughter-legalization-world-politics-2000`
- `keohane-after-hegemony-1984`
- `steinberg-shadow-law-power-gatt-wto-2002`
- `bradford-brussels-effect-2020`

Pattern:

```js
authors: [
  { name: 'United Nations High-Level Advisory Body on Artificial Intelligence', kind: 'institution' },
],
publisher: 'United Nations',
```

```js
authors: [
  { name: 'Stephen D. Krasner', kind: 'person' },
],
publisher: 'Cambridge University Press',
```

```js
authors: [
  { name: 'Judith Goldstein', kind: 'person' },
  { name: 'Miles Kahler', kind: 'person' },
  { name: 'Robert O. Keohane', kind: 'person' },
  { name: 'Anne-Marie Slaughter', kind: 'person' },
],
publisher: 'Cambridge University Press',
```

- [ ] **Step 3: Tighten the first-pass enrichment expectation**

Extend `tests/data-model.test.mjs` with a narrow, intentional expectation:

```js
test('first-pass attribution records expose structured authors and publishers', () => {
  const requiredIds = [
    'wto-work-programme-electronic-commerce-1998',
    'china-data-security-law-2021',
    'eu-artificial-intelligence-act-2024',
    'un-governing-ai-humanity-2024',
    'krasner-structural-causes-regime-consequences-1982',
    'goldstein-kahler-keohane-slaughter-legalization-world-politics-2000',
    'keohane-after-hegemony-1984',
    'steinberg-shadow-law-power-gatt-wto-2002',
    'bradford-brussels-effect-2020',
  ];

  for (const recordId of requiredIds) {
    const record = records.find((item) => item.id === recordId);
    assert.ok(record.authors?.length || record.publisher, `${recordId} has first-pass attribution`);
  }
});
```

- [ ] **Step 4: Run the data-model and smoke tests again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs tests\attribution.test.mjs
```

Expected: PASS, with representative article, book, institutional-report, and official-law records now visibly exercising the new attribution layer.

### Task 5: Verify the whole site and review the upgraded pages in external Chrome

**Files:**
- Test: `tests\*.test.mjs`
- Preview: local static server and Chrome pages

- [ ] **Step 1: Run the full automated suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS with all suites green and no regression in topics, dimensions, timeline, source dossier, or filtering.

- [ ] **Step 2: Start or reuse the local preview server**

If the preview server is not already running, start it in a separate shell:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\preview-server.mjs
```

Expected: the site is reachable at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Open representative pages in external Chrome**

Use external Chrome, not the in-app browser:

```powershell
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/wto-agreement-electronic-commerce-2024'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/un-governing-ai-humanity-2024'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/theories-rulemaking'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/database?topic=ai-governance'
```

Verify manually:

- attribution line appears below the title and above the summary on record pages
- `Authors` and `Publisher` metadata rows only appear when data exists
- list views show muted compact attribution lines without duplicating the full citation
- multiple authors join naturally
- institutional authors render the same way as personal authors
- records without attribution remain clean

- [ ] **Step 4: Re-run the full suite after any visual fix**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS again after any renderer or CSS follow-up from the Chrome review.

## Self-Review

- Spec coverage:
  - structured `authors` and `publisher`: Task 2
  - list-view attribution: Task 3
  - detail-page attribution plus metadata rows: Task 3
  - first-pass enrichment across record types: Task 4
  - tests and Chrome verification: Tasks 1 and 5
- Placeholder scan:
  - no `TODO`, `TBD`, or deferred implementation markers remain
  - each code-changing step includes concrete code snippets
  - each verification step includes an exact command and expected outcome
- Type consistency:
  - the plan uses one consistent helper surface: `authorDisplay()`, `attributionDisplay()`, and `hasAttribution()`
  - the structured attribution fields stay aligned with the approved spec: `authors`, `publisher`, and `kind`
