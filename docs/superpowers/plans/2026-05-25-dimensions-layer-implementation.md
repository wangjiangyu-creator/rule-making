# Dimensions Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class Dimensions layer to the portal, including data definitions, record classification, routes, filters, and visible dimension metadata across the site.

**Architecture:** Keep the existing topic-first SPA architecture intact and add a parallel dimensions layer. Introduce a dedicated `dimensions` dataset and a separate `record-dimensions` mapping file, then merge the mapping into exported records so the analytical classification is explicit without hand-editing every source object. Extend existing route, search, and renderer patterns rather than redesigning the app.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, Node built-in test runner.

---

## File Structure

- Create: `src/data/dimensions.js`
- Create: `src/data/record-dimensions.js`
- Create: `src/views/dimensions.js`
- Create: `docs/superpowers/plans/2026-05-25-dimensions-layer-implementation.md`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/data/topics.js`
- Modify: `src/data/records.js`
- Modify: `src/lib/search.js`
- Modify: `src/views/home.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

### Task 1: Lock the new behavior with failing tests

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add a failing data-model test for dimensions**

Add assertions that import `dimensions`, verify stable ids, require every record to have at least one valid dimension, and require every declared dimension to have linked records.

```js
import { dimensions } from '../src/data/dimensions.js';

const expectedDimensionIds = [
  'objective-setting',
  'legitimacy-management',
  'agenda-setting',
  'coalition-consensus-building',
  'norm-entrepreneurship-drafting-power',
];

test('dimensions use stable unique ids and every record has valid dimensions', () => {
  assert.deepEqual(
    dimensions.map((dimension) => dimension.id),
    expectedDimensionIds,
  );

  const dimensionIds = new Set(dimensions.map((dimension) => dimension.id));

  for (const record of records) {
    assert.ok(record.dimensions.length >= 1, `${record.id} has at least one dimension`);
    for (const dimensionId of record.dimensions) {
      assert.ok(dimensionIds.has(dimensionId), `${record.id} references dimension ${dimensionId}`);
    }
  }
});
```

- [ ] **Step 2: Add a failing render-smoke test for routes, filters, and metadata**

Add smoke tests that require:
- `renderDimensions()` to include `Rule-Making Dimensions`
- `renderDimensionDetail('agenda-setting')` to include `Agenda-Setting`
- `renderDatabase()` to include `name="dimension"`
- `renderRecordDetail(...)` to include `Dimensions`

```js
import { renderDimensionDetail, renderDimensions } from '../src/views/dimensions.js';

test('dimensions renderers include index and detail output', () => {
  assert.match(renderDimensions(), /Rule-Making Dimensions/);
  assert.match(renderDimensionDetail('agenda-setting'), /Agenda-Setting/);
});

test('database and record detail expose dimensions', () => {
  assert.match(renderDatabase(), /name="dimension"/);
  assert.match(renderRecordDetail('wto-joint-statement-electronic-commerce-2019'), /Dimensions/);
});
```

- [ ] **Step 3: Run the focused tests and verify they fail for the expected reason**

Run: `node --test tests/data-model.test.mjs tests/render-smoke.test.mjs`

Expected: FAIL because `dimensions` exports, dimension routes, and record `dimensions` metadata do not exist yet.

### Task 2: Add the dimensions data model and corpus classification

**Files:**
- Create: `src/data/dimensions.js`
- Create: `src/data/record-dimensions.js`
- Modify: `src/data/topics.js`
- Modify: `src/data/records.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Create the dimensions dataset**

Create `src/data/dimensions.js` with the five approved dimensions and their summaries/questions.

```js
export const dimensions = [
  {
    id: 'objective-setting',
    title: 'Objective-Setting',
    summary: 'How actors define the purposes, goals, and mandates of international rule-making.',
    questions: [
      'Who defines what a negotiation or institution is meant to achieve?',
      'How are priorities framed before drafting begins?',
    ],
  },
  // four more dimensions...
];
```

- [ ] **Step 2: Create the record-dimensions mapping**

Create `src/data/record-dimensions.js` as an explicit `recordId -> dimensionIds[]` map covering the whole corpus.

```js
export const recordDimensionsById = {
  'wto-joint-statement-electronic-commerce-2019': [
    'agenda-setting',
    'coalition-consensus-building',
  ],
  'usmca-digital-trade-chapter-2020': [
    'norm-entrepreneurship-drafting-power',
    'objective-setting',
  ],
};
```

- [ ] **Step 3: Add curated topic-to-dimension links**

Extend `src/data/topics.js` so each topic carries a small `dimensionIds` array.

```js
{
  id: 'wto-reform',
  title: 'WTO Institutional Reform and Negotiations',
  // ...
  dimensionIds: [
    'agenda-setting',
    'coalition-consensus-building',
    'legitimacy-management',
  ],
}
```

- [ ] **Step 4: Merge the mapping into exported records**

Modify `src/data/records.js` so the exported `records` array normalizes each record with a `dimensions` field.

```js
import { recordDimensionsById } from './record-dimensions.js';

const baseRecords = [
  // existing records
];

export const records = [...baseRecords, ...thirdBatchRecords].map((record) => ({
  ...record,
  dimensions: recordDimensionsById[record.id] ?? [],
}));
```

- [ ] **Step 5: Run the data-model test until it passes**

Run: `node --test tests/data-model.test.mjs`

Expected: PASS, with every record resolving at least one valid dimension and every topic still resolving correctly.

### Task 3: Add routes, filters, and visible dimension UI

**Files:**
- Create: `src/views/dimensions.js`
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/lib/search.js`
- Modify: `src/views/home.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the Dimensions nav link and route handling**

Update `index.html` and `src/main.js` to add `#/dimensions` and `#/dimensions/:id`.

```js
import { renderDimensionDetail, renderDimensions } from './views/dimensions.js';

// in route()
} else if (section === 'dimensions' && id) {
  app.innerHTML = renderDimensionDetail(id);
} else if (section === 'dimensions') {
  app.innerHTML = renderDimensions();
}
```

- [ ] **Step 2: Add the new dimensions renderer**

Create `src/views/dimensions.js` using the same card/detail pattern as topics.

```js
export function renderDimensions() {
  return `
    <section class="page-hero">
      <p class="eyebrow">Framework</p>
      <h1>Rule-Making Dimensions</h1>
    </section>
  `;
}
```

- [ ] **Step 3: Extend filtering and database forms**

Update `src/lib/search.js` and `src/views/database.js` to support `dimension` in:
- URL params
- filter state
- select control rendering
- filter predicate

```js
if (filters.dimension && !asList(record.dimensions).includes(filters.dimension)) return false;
```

- [ ] **Step 4: Surface dimensions across the site**

Update:
- `src/views/home.js` to add a `Research pathways` panel
- `src/views/topics.js` to show `Relevant dimensions`
- `src/views/database.js` record detail metadata to show `Dimensions`

```js
<dt>Dimensions</dt>
<dd>${renderLinkedItems(record.dimensions, dimensions, 'dimensions', (dimension) => dimension.title)}</dd>
```

- [ ] **Step 5: Add any minimal styling support**

Use focused CSS additions only for:
- pathway cards/panel
- dimension cards
- small metadata lists or badges if needed

```css
.dimension-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

- [ ] **Step 6: Run the render-smoke tests until they pass**

Run: `node --test tests/render-smoke.test.mjs`

Expected: PASS, with dimension routes, filter controls, and record metadata rendering.

### Task 4: Run full verification and local browser checks

**Files:**
- Modify: none
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Run the full test suite**

Run: `node --test tests/*.test.mjs`

Expected: PASS, with no failed suites and updated totals reflecting the new dimensions coverage.

- [ ] **Step 2: Verify the live local app behavior**

Check these routes in the local browser:
- `#/dimensions`
- `#/dimensions/agenda-setting`
- `#/database?dimension=agenda-setting`
- one topic page with relevant dimensions
- one record page with dimensions metadata

Expected: pages render, the dimension filter narrows results, and links between topic, dimension, and record views work.

- [ ] **Step 3: Review requirements against the spec**

Confirm the implementation satisfies:
- co-equal dimensions section
- full-corpus classification
- multi-dimension support
- database dimension filter
- topic-level relevant dimensions
- record-level visible dimensions

- [ ] **Step 4: Commit**

Run:

```bash
git add index.html src/main.js src/data/dimensions.js src/data/record-dimensions.js src/data/topics.js src/data/records.js src/lib/search.js src/views/home.js src/views/topics.js src/views/dimensions.js src/views/database.js src/styles.css tests/data-model.test.mjs tests/render-smoke.test.mjs docs/superpowers/plans/2026-05-25-dimensions-layer-implementation.md
git commit -m "Add rulemaking dimensions layer"
```
