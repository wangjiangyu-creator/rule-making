# Britain and Imperial Rule-Making Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated historical Britain shelf that makes the portal comparative across major powers by introducing a mixed eighteenth- to early twentieth-century corpus on British trade, empire, finance, and international legal rule-making.

**Architecture:** Keep the topic-first portal structure intact and implement the Britain shelf almost entirely through the structured data layer. Add one new topic, broaden the existing `united-kingdom` actor framing, create a dedicated Britain batch file plus targeted re-links to existing UK-relevant records, map everything into the current dimensions layer, and extend the timeline so the new shelf behaves like a first-class research topic.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, structured ES-module data files, Node built-in test runner.

**Git note:** `git` is not available in PATH on this machine, so this plan uses verification checkpoints instead of commit steps. If a usable git binary appears during execution, commit after each completed task.

---

## File Structure

- Create: `src/data/records-britain-batch.js`
- Create: `docs/superpowers/plans/2026-05-25-britain-imperial-rulemaking-implementation.md`
- Modify: `src/data/topics.js`
- Modify: `src/data/actors.js`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `src/data/record-dimensions.js`
- Modify: `src/data/timeline.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

## Planned Britain Batch

This plan adds the following new Britain-facing records:

- `navigation-acts-repeal-1849`
- `bank-charter-act-1844`
- `declaration-paris-maritime-law-1856`
- `cobden-chevalier-treaty-1860`
- `general-act-berlin-conference-1885`
- `bagehot-lombard-street-1873`
- `hall-treatise-international-law-1880`
- `oppenheim-international-law-1905`
- `de-cecco-international-gold-standard-1974`
- `gong-standard-civilization-1984`
- `hobsbawm-age-of-empire-1987`
- `eichengreen-golden-fetters-1992`
- `cain-hopkins-british-imperialism-1993`
- `koskenniemi-gentle-civilizer-2001`
- `findlay-orourke-power-plenty-2007`
- `darwin-empire-project-2009`
- `pitts-boundaries-of-the-international-2018`
- `gallagher-robinson-imperialism-free-trade-1953`

This plan also re-links selected existing records into the new shelf:

- `ruggie-embedded-liberalism-postwar-order-1982`
- `stein-hegemons-dilemma-1984`
- `steil-battle-bretton-woods-2013`
- `helleiner-forgotten-foundations-bretton-woods-2014`

## Target Shelf Outcomes

After the batch and re-link pass, the tests should enforce at least:

- `britain-imperial-rulemaking`: `18` linked records
- `united-kingdom` actor page links to the new topic
- Britain shelf contains both scholarship and primary or official historical materials
- Britain shelf propagates into at least `great-powers`, `theories-rulemaking`, and `monetary-financial-regulation` where analytically justified
- `#/timeline?topic=britain-imperial-rulemaking` renders a real chronology rather than an empty page

### Task 1: Lock the Britain shelf expectations with failing tests

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add a failing data-model test for the new topic shelf**

Extend `tests/data-model.test.mjs` with one focused Britain-shelf test.

```js
test('britain and imperial rule-making shelf has a substantive mixed historical corpus', () => {
  const expectedIds = [
    'navigation-acts-repeal-1849',
    'bank-charter-act-1844',
    'declaration-paris-maritime-law-1856',
    'cobden-chevalier-treaty-1860',
    'general-act-berlin-conference-1885',
    'bagehot-lombard-street-1873',
    'hall-treatise-international-law-1880',
    'oppenheim-international-law-1905',
    'gallagher-robinson-imperialism-free-trade-1953',
    'cain-hopkins-british-imperialism-1993',
    'darwin-empire-project-2009',
    'findlay-orourke-power-plenty-2007',
  ];

  const recordIds = new Set(records.map((record) => record.id));
  const britainShelf = records.filter((record) => record.topics.includes('britain-imperial-rulemaking'));

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(
    britainShelf.length >= 18,
    'britain and imperial rule-making topic has at least eighteen linked records',
  );
  assert.ok(
    britainShelf.some((record) => ['academic-article', 'book-chapter'].includes(record.recordType)),
    'britain shelf includes scholarship',
  );
  assert.ok(
    britainShelf.some((record) =>
      ['treaty-agreement', 'national-law-policy', 'institutional-document'].includes(record.recordType)),
    'britain shelf includes primary or official historical materials',
  );
  assert.ok(
    britainShelf.some((record) => record.topics.includes('great-powers')),
    'britain shelf propagates into great-powers',
  );
  assert.ok(
    britainShelf.some((record) => record.topics.includes('monetary-financial-regulation')),
    'britain shelf propagates into money and finance',
  );
});
```

- [ ] **Step 2: Add failing render-smoke coverage for topics, actor propagation, and timeline**

Extend `tests/render-smoke.test.mjs`:

```js
import { renderTimelinePage } from '../src/views/timeline.js';

test('britain shelf surfaces in topics, actor detail, and timeline views', () => {
  assert.match(renderTopics(), /Britain and Imperial Rule-Making/);

  const britainHtml = renderTopicDetail('britain-imperial-rulemaking');
  assert.match(britainHtml, /Lombard Street/);
  assert.match(britainHtml, /Declaration Respecting Maritime Law/);

  const actorHtml = renderActorDetail('united-kingdom');
  assert.match(actorHtml, /Britain and Imperial Rule-Making/);
  assert.match(actorHtml, /The Hegemon&#39;s Dilemma|The Hegemon's Dilemma/);

  const originalLocation = globalThis.location;
  globalThis.location = { hash: '#/timeline?topic=britain-imperial-rulemaking' };

  try {
    const timelineHtml = renderTimelinePage();
    assert.match(timelineHtml, /Cobden-Chevalier Treaty/);
  } finally {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  }
});
```

- [ ] **Step 3: Run the focused tests and verify they fail for the expected reasons**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL because the new topic does not exist yet, the Britain record ids are missing, the UK actor page has not been broadened, and the Britain timeline route has no content.

### Task 2: Add the new topic and broaden the United Kingdom actor framing

**Files:**
- Modify: `src/data/topics.js`
- Modify: `src/data/actors.js`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the Britain topic object**

Insert a new topic in `src/data/topics.js`:

```js
{
  id: 'britain-imperial-rulemaking',
  title: 'Britain and Imperial Rule-Making',
  shortTitle: 'Britain and Empire',
  summary:
    'Historical study of how Britain shaped international economic and legal rules through empire, trade, finance, naval and market power, legal doctrine, and institutional practice.',
  pilot: false,
  questions: [
    'How did Britain set objectives and define the terms of international commercial and legal order during the period of imperial dominance?',
    'Through which instruments did Britain turn imperial, naval, financial, and legal power into durable international rules?',
    'Which elements of British rule-making survived into later monetary, commercial, and institutional orders?',
  ],
  dimensionIds: [
    'objective-setting',
    'agenda-setting',
    'coalition-consensus-building',
    'norm-entrepreneurship-drafting-power',
  ],
},
```

- [ ] **Step 2: Broaden the United Kingdom actor**

Update the `united-kingdom` actor in `src/data/actors.js`:

```js
{
  id: 'united-kingdom',
  name: 'United Kingdom',
  type: 'great-power',
  summary:
    'Spans imperial Britain, postwar Britain, and the contemporary United Kingdom, shaping international economic rules through empire, finance, treaty practice, market access, standards diplomacy, and institutional statecraft.',
  topicIds: [
    'great-powers',
    'britain-imperial-rulemaking',
    'digital-trade-ecommerce',
    'middle-small-powers',
    'ai-governance',
  ],
},
```

- [ ] **Step 3: Run the focused tests again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL, but the failures should move off the missing topic id and onto the still-missing records and timeline entries.

### Task 3: Create the Britain batch file, wire it in, and re-link existing UK historical records

**Files:**
- Create: `src/data/records-britain-batch.js`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Create the dedicated Britain batch file and import it**

Create `src/data/records-britain-batch.js`:

```js
export const britainBatchRecords = [
];
```

Wire it into `src/data/records.js`:

```js
import { britainBatchRecords } from './records-britain-batch.js';

const baseRecords = [
  ...
  ...thirdBatchRecords,
  ...fourthBatchRecords,
  ...britainBatchRecords,
];
```

- [ ] **Step 2: Re-link the existing UK comparison records into the new shelf**

Update these existing records in `src/data/records-third-batch.js` so they also include `britain-imperial-rulemaking` in `topics`:

```js
'ruggie-embedded-liberalism-postwar-order-1982'
'stein-hegemons-dilemma-1984'
'steil-battle-bretton-woods-2013'
'helleiner-forgotten-foundations-bretton-woods-2014'
```

Each of those records should keep its existing topic set and add the new topic rather than replacing anything.

- [ ] **Step 3: Run the focused tests again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL, but with the new topic and some historical UK records already visible on the actor page.

### Task 4: Add the interpretive and comparative scholarship sub-batch plus dimension mappings

**Files:**
- Modify: `src/data/records-britain-batch.js`
- Modify: `src/data/record-dimensions.js`
- Test: `tests\data-model.test.mjs`

- [ ] **Step 1: Add the historical interpretation and comparative-theory records**

Append these records to `britainBatchRecords` with proper topics, actor links, attribution, and source links:

```js
const theoryBatchIds = [
  'gallagher-robinson-imperialism-free-trade-1953',
  'de-cecco-international-gold-standard-1974',
  'gong-standard-civilization-1984',
  'hobsbawm-age-of-empire-1987',
  'eichengreen-golden-fetters-1992',
  'cain-hopkins-british-imperialism-1993',
  'koskenniemi-gentle-civilizer-2001',
  'findlay-orourke-power-plenty-2007',
  'darwin-empire-project-2009',
  'pitts-boundaries-of-the-international-2018',
];
```

Topic rules for this sub-batch:

- every record gets `britain-imperial-rulemaking`
- most also get `great-powers`
- selected finance titles also get `monetary-financial-regulation`
- selected public-law titles also get `theories-rulemaking`

- [ ] **Step 2: Add the matching dimension entries**

Add `recordDimensionsById` entries so these titles are distributed across:

- `objective-setting`
- `agenda-setting`
- `legitimacy-management`
- `norm-entrepreneurship-drafting-power`

At least one record in this sub-batch should also receive `coalition-consensus-building`.

- [ ] **Step 3: Run the focused tests**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL, but with the Britain shelf now clearly visible as a historical literature corpus.

### Task 5: Add the imperial trade, legal-doctrinal, and treaty sub-batch

**Files:**
- Modify: `src/data/records-britain-batch.js`
- Modify: `src/data/record-dimensions.js`
- Test: `tests\data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the trade, treaty, and doctrine records**

Append these records with official or archival source links where possible:

```js
const legalTradeBatchIds = [
  'navigation-acts-repeal-1849',
  'declaration-paris-maritime-law-1856',
  'cobden-chevalier-treaty-1860',
  'general-act-berlin-conference-1885',
  'hall-treatise-international-law-1880',
  'oppenheim-international-law-1905',
];
```

Topic rules for this sub-batch:

- all records get `britain-imperial-rulemaking`
- `declaration-paris-maritime-law-1856`, `hall-treatise-international-law-1880`, and `oppenheim-international-law-1905` also get `theories-rulemaking`
- `cobden-chevalier-treaty-1860` and `general-act-berlin-conference-1885` also get `great-powers`
- add `international-investment` only where the fit is real, not symbolic

- [ ] **Step 2: Add dimension mappings for the new primary-text and doctrinal records**

Use the current dimension vocabulary conservatively:

```js
'navigation-acts-repeal-1849': ['objective-setting', 'norm-entrepreneurship-drafting-power']
'declaration-paris-maritime-law-1856': ['legitimacy-management', 'norm-entrepreneurship-drafting-power']
'cobden-chevalier-treaty-1860': ['agenda-setting', 'coalition-consensus-building', 'norm-entrepreneurship-drafting-power']
'general-act-berlin-conference-1885': ['objective-setting', 'agenda-setting', 'coalition-consensus-building']
```

Add similarly specific mappings for the Hall and Oppenheim records.

- [ ] **Step 3: Run the focused tests**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL, but now mainly because the monetary/timeline layer is still incomplete.

### Task 6: Add the money-and-finance sub-batch and Britain timeline entries

**Files:**
- Modify: `src/data/records-britain-batch.js`
- Modify: `src/data/record-dimensions.js`
- Modify: `src/data/timeline.js`
- Test: `tests\data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the finance records**

Append these records:

```js
const financeBatchIds = [
  'bank-charter-act-1844',
  'bagehot-lombard-street-1873',
];
```

Topic rules:

- both records get `britain-imperial-rulemaking`
- both also get `monetary-financial-regulation`
- `bagehot-lombard-street-1873` may also get `theories-rulemaking` if the shelf needs the conceptual cross-link

- [ ] **Step 2: Add the dimension mappings**

Add explicit entries:

```js
'bank-charter-act-1844': ['objective-setting', 'norm-entrepreneurship-drafting-power']
'bagehot-lombard-street-1873': ['legitimacy-management', 'norm-entrepreneurship-drafting-power']
```

- [ ] **Step 3: Add the Britain timeline entries**

Append a first historical chronology to `src/data/timeline.js`:

```js
{
  date: '1844-07-19',
  title: 'Bank Charter Act restructures British monetary governance',
  tag: 'financial-regulation',
  topicId: 'britain-imperial-rulemaking',
  relatedIds: ['bank-charter-act-1844'],
},
{
  date: '1856-04-16',
  title: 'Declaration of Paris codifies rules on maritime war and neutrality',
  tag: 'legal-order',
  topicId: 'britain-imperial-rulemaking',
  relatedIds: ['declaration-paris-maritime-law-1856'],
},
{
  date: '1860-01-23',
  title: 'Cobden-Chevalier Treaty anchors a new free-trade turn',
  tag: 'trade-order',
  topicId: 'britain-imperial-rulemaking',
  relatedIds: ['cobden-chevalier-treaty-1860'],
},
{
  date: '1885-02-26',
  title: 'Berlin Conference general act formalizes imperial partition rules',
  tag: 'imperial-order',
  topicId: 'britain-imperial-rulemaking',
  relatedIds: ['general-act-berlin-conference-1885'],
},
```

- [ ] **Step 4: Run the focused tests and confirm they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: PASS.

### Task 7: Run the full suite and verify the Britain shelf in external Chrome

**Files:**
- Test: `tests/attribution.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`
- Test: `tests/source-links.test.mjs`

- [ ] **Step 1: Run the full test suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\attribution.test.mjs tests\data-model.test.mjs tests\render-smoke.test.mjs tests\source-links.test.mjs
```

Expected: PASS with all tests green.

- [ ] **Step 2: Review the key routes in external Chrome**

Open and inspect:

```text
http://127.0.0.1:4173/#/topics/britain-imperial-rulemaking
http://127.0.0.1:4173/#/actors/united-kingdom
http://127.0.0.1:4173/#/timeline?topic=britain-imperial-rulemaking
http://127.0.0.1:4173/#/database?topic=britain-imperial-rulemaking
```

Verify:

- the new topic card appears on `#/topics`
- the Britain topic page shows a mixed historical shelf
- the UK actor page now reads historically as well as contemporarily
- the Britain timeline route renders entries and linked records
- no encoding or broken-link markers appear in the new records

- [ ] **Step 3: Record the outcome**

Summarize:

- total new records added
- the final Britain shelf count
- whether selected existing records were re-linked successfully
- whether the full suite passed

## Self-Review

### Spec coverage check

This plan covers the approved spec sections:

- dedicated Britain topic shelf: Task 2
- UK actor refinement: Task 2
- mixed historical corpus across trade, finance, and legal doctrine: Tasks 4, 5, and 6
- propagation into comparative topics and actor view: Tasks 3, 4, 5, and 6
- timeline behavior: Task 6
- tests to prevent regression: Tasks 1 and 7

### Placeholder scan

The plan contains no `TODO`, `TBD`, or deferred “implement later” language. Each task names the exact files, targeted ids, test commands, and expected outcomes.

### Type consistency check

The plan uses the existing portal vocabulary consistently:

- topic id: `britain-imperial-rulemaking`
- actor id: `united-kingdom`
- timeline field: `relatedIds`
- record type and dimension handling remain within the current schema
