# Source Dossier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade record pages with a structured source dossier that shows source hierarchy, document variants, and short per-link notes without breaking the current corpus.

**Architecture:** Keep `sourceLinks` as the canonical outward-facing source field, add a small structured vocabulary and normalization helper, and upgrade the record-detail renderer to group links into primary, official, and secondary blocks. Use backward-compatible normalization so legacy `{ label, url }` entries still render while a first-pass enrichment upgrades the highest-value legal and institutional records.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, structured ES-module data files, Node built-in test runner.

**Git note:** `git` is not currently available in PATH on this machine, so this plan uses verification checkpoints instead of commit steps. If a usable git binary becomes available during execution, commit after each completed task.

---

## File Structure

- Create: `src/lib/sources.js`
- Create: `tests/source-links.test.mjs`
- Create: `docs/superpowers/plans/2026-05-25-source-dossier-implementation.md`
- Modify: `src/data/schema.js`
- Modify: `src/lib/format.js`
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

### Task 1: Lock the source-dossier behavior with failing tests

**Files:**
- Create: `tests/source-links.test.mjs`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/source-links.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Create a failing source-normalization test file**

Create `tests/source-links.test.mjs` to define the helper API before any production code exists.

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { groupSourceLinks, normalizeSourceLink } from '../src/lib/sources.js';

const fixtureRecord = {
  id: 'fixture-record',
  sourceAuthority: 'official-government',
  languageStatus: 'official-original',
};

test('normalizeSourceLink inherits record-level authority and language status', () => {
  const normalized = normalizeSourceLink(
    fixtureRecord,
    {
      label: 'Official text',
      url: 'https://example.com/text',
      linkType: 'full-text',
      note: 'Controlling text.',
    },
    0,
  );

  assert.equal(normalized.authority, 'official-government');
  assert.equal(normalized.languageStatus, 'official-original');
  assert.equal(normalized.group, 'primary');
});

test('groupSourceLinks orders primary, official, and secondary links', () => {
  const groups = groupSourceLinks({
    ...fixtureRecord,
    sourceLinks: [
      { label: 'Repository page', url: 'https://example.com/page', linkType: 'official-page' },
      { label: 'Commentary', url: 'https://example.com/commentary', linkType: 'commentary', authority: 'think-tank' },
      { label: 'Official PDF', url: 'https://example.com/text.pdf', linkType: 'pdf' },
    ],
  });

  assert.deepEqual(
    groups.map((group) => group.id),
    ['primary', 'official', 'secondary'],
  );
  assert.equal(groups[0].links[0].label, 'Official PDF');
  assert.equal(groups[2].links[0].label, 'Commentary');
});

test('groupSourceLinks gives legacy links a safe fallback group', () => {
  const groups = groupSourceLinks({
    ...fixtureRecord,
    sourceLinks: [
      { label: 'Legacy official page', url: 'https://example.com/legacy' },
    ],
  });

  assert.equal(groups[0].id, 'official');
  assert.equal(groups[0].links[0].linkType, 'official-page');
});
```

- [ ] **Step 2: Extend the data-model test with link-type and enrichment invariants**

Add controlled source-link vocabulary checks and first-pass enrichment expectations to `tests/data-model.test.mjs`.

```js
import { recordTypes, languageStatuses, sourceAuthorities, sourceLinkTypes } from '../src/data/schema.js';

const expectedSourceLinkTypes = [
  'official-page',
  'full-text',
  'pdf',
  'html-text',
  'metadata',
  'summary',
  'press-release',
  'working-paper',
  'commentary',
];

test('schema lists allowed source-link categories', () => {
  assert.deepEqual(sourceLinkTypes, expectedSourceLinkTypes);
});

test('records use valid structured source-link fields when present', () => {
  for (const record of records) {
    for (const sourceLink of record.sourceLinks) {
      if (sourceLink.linkType) {
        assert.ok(sourceLinkTypes.includes(sourceLink.linkType), `${record.id} uses valid source link type`);
      }

      if (sourceLink.authority) {
        assert.ok(sourceAuthorities.includes(sourceLink.authority), `${record.id} uses valid per-link authority`);
      }

      if (sourceLink.languageStatus) {
        assert.ok(languageStatuses.includes(sourceLink.languageStatus), `${record.id} uses valid per-link language status`);
      }

      if (sourceLink.note) {
        assert.ok(sourceLink.note.length >= 12, `${record.id} source note is descriptive`);
      }
    }
  }
});

test('first-pass dossier records expose structured source variants', () => {
  const requiredIds = [
    'wto-work-programme-electronic-commerce-1998',
    'china-data-security-law-2021',
    'eu-artificial-intelligence-act-2024',
    'un-governing-ai-humanity-2024',
  ];

  for (const recordId of requiredIds) {
    const record = records.find((item) => item.id === recordId);
    assert.ok(record, `${recordId} exists`);
    assert.ok(record.sourceLinks.some((link) => link.linkType), `${recordId} has typed source links`);
    assert.ok(record.sourceLinks.some((link) => link.note), `${recordId} has source notes`);
  }

  const chinaDsl = records.find((item) => item.id === 'china-data-security-law-2021');
  assert.ok(chinaDsl.sourceLinks.some((link) => link.languageStatus === 'official-original'));
  assert.ok(chinaDsl.sourceLinks.some((link) => link.languageStatus === 'official-english'));
});
```

- [ ] **Step 3: Add a failing render-smoke test for the source dossier UI**

Extend `tests/render-smoke.test.mjs` so the record page must render grouped source sections, notes, and legacy-link fallback.

```js
test('record detail renders grouped source dossier blocks', () => {
  const fixtureRecord = {
    id: 'source-dossier-fixture',
    title: 'Source Dossier Fixture',
    recordType: 'institutional-document',
    date: '2024-01-01',
    year: 2024,
    actors: [],
    jurisdictions: ['Global'],
    institutions: ['wto'],
    topics: ['wto-reform'],
    dimensions: ['agenda-setting'],
    summary: 'Fixture record for grouped source-dossier rendering.',
    sourceAuthority: 'official-international-organization',
    languageStatus: 'official-english',
    sourceLinks: [
      {
        label: 'Official text PDF',
        url: 'https://example.com/text.pdf',
        linkType: 'pdf',
        note: 'Controlling text.',
      },
      {
        label: 'Repository page',
        url: 'https://example.com/page',
        linkType: 'official-page',
        note: 'Repository landing page.',
      },
      {
        label: 'Think-tank commentary',
        url: 'https://example.com/commentary',
        linkType: 'commentary',
        authority: 'think-tank',
        note: 'Secondary context.',
      },
    ],
    citation: 'Source Dossier Fixture.',
    relatedRecordIds: [],
    tags: [],
  };

  records.push(fixtureRecord);

  try {
    const html = renderRecordDetail(fixtureRecord.id);
    assert.match(html, /Source dossier/);
    assert.match(html, /Controlling or primary text/);
    assert.match(html, /Official versions and document pages/);
    assert.match(html, /Secondary or contextual links/);
    assert.match(html, /Controlling text\./);
    assert.ok(html.indexOf('Official text PDF') < html.indexOf('Think-tank commentary'));
  } finally {
    records.pop();
  }
});
```

- [ ] **Step 4: Run the focused tests and verify they fail for the expected reason**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\source-links.test.mjs tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL because `sourceLinkTypes` is not exported yet, `src/lib/sources.js` does not exist, and `renderRecordDetail()` still renders a flat `Sources` list instead of a grouped dossier.

### Task 2: Add the source-link vocabulary, formatting labels, and normalization layer

**Files:**
- Modify: `src/data/schema.js`
- Modify: `src/lib/format.js`
- Create: `src/lib/sources.js`
- Test: `tests/source-links.test.mjs`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Add a controlled `sourceLinkTypes` export to the schema**

Extend `src/data/schema.js` with the approved closed vocabulary.

```js
export const sourceLinkTypes = [
  'official-page',
  'full-text',
  'pdf',
  'html-text',
  'metadata',
  'summary',
  'press-release',
  'working-paper',
  'commentary',
];
```

- [ ] **Step 2: Add a display helper for source-link types**

Extend `src/lib/format.js` so the renderer can show compact editorial badges without hard-coding text in the view.

```js
const sourceLinkTypeLabels = {
  'official-page': 'Official page',
  'full-text': 'Full text',
  'pdf': 'PDF',
  'html-text': 'HTML text',
  'metadata': 'Metadata',
  'summary': 'Summary',
  'press-release': 'Press release',
  'working-paper': 'Working paper',
  'commentary': 'Commentary',
};

export function sourceLinkTypeLabel(value) {
  return sourceLinkTypeLabels[value] ?? humanizeId(value);
}
```

- [ ] **Step 3: Create the normalization and grouping helper in `src/lib/sources.js`**

Implement a small library that turns raw link objects into renderer-ready grouped source blocks.

```js
const groupTitles = {
  primary: 'Controlling or primary text',
  official: 'Official versions and document pages',
  secondary: 'Secondary or contextual links',
};

const priorityByType = {
  'full-text': 10,
  'html-text': 20,
  'pdf': 30,
  'official-page': 40,
  'summary': 50,
  'press-release': 60,
  'metadata': 70,
  'working-paper': 80,
  'commentary': 90,
};

function inferLinkType(record, sourceLink) {
  const label = String(sourceLink.label ?? '').toLowerCase();

  if (label.includes('pdf')) return 'pdf';
  if (label.includes('summary')) return 'summary';
  if (label.includes('press')) return 'press-release';
  if (record.sourceAuthority.startsWith('official-') || record.sourceAuthority === 'treaty-depository') {
    return 'official-page';
  }

  return 'metadata';
}

function resolveGroup(linkType, authority) {
  if (linkType === 'full-text' || linkType === 'html-text' || linkType === 'pdf') return 'primary';
  if (authority.startsWith('official-') || authority === 'treaty-depository') return 'official';
  return 'secondary';
}

export function normalizeSourceLink(record, sourceLink, index = 0) {
  const linkType = sourceLink.linkType ?? inferLinkType(record, sourceLink);
  const authority = sourceLink.authority ?? record.sourceAuthority;
  const languageStatus = sourceLink.languageStatus ?? record.languageStatus;
  const note = String(sourceLink.note ?? '').trim();
  const group = resolveGroup(linkType, authority);
  const sortKey = Number(sourceLink.sortHint ?? priorityByType[linkType] ?? 999) + index / 1000;

  return {
    ...sourceLink,
    linkType,
    authority,
    languageStatus,
    note,
    group,
    sortKey,
  };
}

export function groupSourceLinks(record) {
  const normalized = (Array.isArray(record.sourceLinks) ? record.sourceLinks : [])
    .map((sourceLink, index) => normalizeSourceLink(record, sourceLink, index))
    .sort((left, right) => left.sortKey - right.sortKey);

  return ['primary', 'official', 'secondary']
    .map((groupId) => ({
      id: groupId,
      title: groupTitles[groupId],
      links: normalized.filter((sourceLink) => sourceLink.group === groupId),
    }))
    .filter((group) => group.links.length > 0);
}
```

- [ ] **Step 4: Run the helper and data-model tests until they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\source-links.test.mjs tests\data-model.test.mjs
```

Expected: PASS for the helper API and schema-level invariants, while the render-smoke test still fails because the UI has not been upgraded yet.

### Task 3: Replace the flat sources list with a grouped source dossier

**Files:**
- Modify: `src/views/database.js`
- Modify: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`
- Test: `tests/source-links.test.mjs`

- [ ] **Step 1: Import the new source helper and formatting helper into the record-detail renderer**

Update the imports at the top of `src/views/database.js`.

```js
import { authorityLabel, formatDate, humanizeId, recordTypeLabel, sourceLinkTypeLabel } from '../lib/format.js';
import { groupSourceLinks } from '../lib/sources.js';
```

- [ ] **Step 2: Replace the flat source list renderer with grouped dossier renderers**

Add small helper renderers inside `src/views/database.js` and switch the record page section heading from `Sources` to `Source dossier`.

```js
function renderSourceBadge(label) {
  return `<span class="source-badge">${escapeHtml(label)}</span>`;
}

function renderSourceDossierRow(sourceLink) {
  const href = sanitizeSourceHref(sourceLink.url);
  const linkMarkup = href
    ? `<a href="${escapeHtml(href)}" rel="noreferrer" target="_blank">${escapeHtml(sourceLink.label)}</a>`
    : `${escapeHtml(sourceLink.label)} <span class="source-url-invalid">(invalid source URL)</span>`;

  const badges = [
    sourceLinkTypeLabel(sourceLink.linkType),
    authorityLabel(sourceLink.authority),
    humanizeId(sourceLink.languageStatus),
  ];

  return `
    <li class="source-dossier-row">
      <p class="source-dossier-link">${linkMarkup}</p>
      <p class="source-badge-list">${badges.map(renderSourceBadge).join('')}</p>
      ${sourceLink.note ? `<p class="source-note">${escapeHtml(sourceLink.note)}</p>` : ''}
    </li>
  `;
}

function renderSourceDossierGroup(group) {
  return `
    <section class="source-dossier-group">
      <h3>${escapeHtml(group.title)}</h3>
      <ul class="clean-list source-dossier-list">
        ${group.links.map(renderSourceDossierRow).join('')}
      </ul>
    </section>
  `;
}
```

Then replace the source section in `renderRecordDetail()`:

```js
const sourceGroups = groupSourceLinks(record);

<section>
  <h2>Source dossier</h2>
  <div class="source-dossier">
    ${sourceGroups.map(renderSourceDossierGroup).join('')}
  </div>
</section>
```

- [ ] **Step 3: Add focused source-dossier styling**

Extend `src/styles.css` with compact dossier styling that matches the portal's existing editorial tone.

```css
.source-dossier {
  display: grid;
  gap: 1.5rem;
}

.source-dossier-group {
  display: grid;
  gap: 0.75rem;
}

.source-dossier-list {
  gap: 0.75rem;
}

.source-dossier-row {
  display: grid;
  gap: 0.45rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.source-badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
}

.source-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.75rem;
  padding: 0.15rem 0.45rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
}

.source-note {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.95rem;
}
```

- [ ] **Step 4: Run the renderer-focused tests until they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\render-smoke.test.mjs tests\source-links.test.mjs
```

Expected: PASS, with `renderRecordDetail()` now producing grouped source-dossier sections, source badges, notes, and legacy-link fallback behavior.

### Task 4: Enrich the first-pass high-value records with typed links and notes

**Files:**
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `tests/data-model.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Enrich the WTO and China legal-text records in `src/data/records.js`**

Update `wto-work-programme-electronic-commerce-1998` and `china-data-security-law-2021` so they exercise primary-text ordering and per-link language variants.

```js
sourceLinks: [
  {
    label: 'WTO Docs PDF WT/L/274',
    url: 'https://docs.wto.org/dol2fe/Pages/SS/directdoc.aspx?filename=q:/WT/L/274.pdf&Open=True',
    linkType: 'pdf',
    note: 'Controlling General Council document text.',
  },
  {
    label: 'WTO Work Programme page',
    url: 'https://www.wto.org/english/tratop_e/ecom_e/ecom_work_programme_e.htm',
    linkType: 'official-page',
    note: 'WTO topic page summarizing the work programme and related materials.',
  },
],
```

```js
sourceLinks: [
  {
    label: 'NPC Chinese original',
    url: 'https://www.npc.gov.cn/npc/c2/c30834/202106/t20210610_311888.html',
    linkType: 'html-text',
    languageStatus: 'official-original',
    note: 'Chinese controlling text published by the National People's Congress.',
  },
  {
    label: 'NPC English translation',
    url: 'https://www.npc.gov.cn/englishnpc/c2759/c23934/202112/t20211209_385109.html',
    linkType: 'html-text',
    languageStatus: 'official-english',
    note: 'Official English translation published on the NPC English site.',
  },
],
```

- [ ] **Step 2: Enrich the EU and UN report records with document-page and report variants**

Update `eu-artificial-intelligence-act-2024` in `src/data/records.js` and `un-governing-ai-humanity-2024` in `src/data/records-third-batch.js`.

```js
sourceLinks: [
  {
    label: 'EUR-Lex Regulation (EU) 2024/1689',
    url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng',
    linkType: 'html-text',
    note: 'Official legal text in EUR-Lex.',
  },
  {
    label: 'European Commission AI Act policy page',
    url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
    linkType: 'official-page',
    note: 'Commission overview, implementation context, and supporting materials.',
  },
],
```

```js
sourceLinks: [
  {
    label: 'UN report PDF',
    url: 'https://www.un.org/sites/un2.un.org/files/governing_ai_for_humanity_final_report_en.pdf',
    linkType: 'pdf',
    languageStatus: 'official-english',
    note: 'Full English report text released by the United Nations.',
  },
  {
    label: 'UN Digital Library record',
    url: 'https://digitallibrary.un.org/record/4062495?ln=en',
    linkType: 'metadata',
    languageStatus: 'official-bilingual',
    note: 'UN catalog record with repository metadata and access context.',
  },
],
```

- [ ] **Step 3: Tighten the enrichment expectation in `tests/data-model.test.mjs`**

Keep the new structured-link expectations narrow and intentional rather than forcing the whole corpus to be enriched immediately.

```js
test('first-pass dossier records expose typed links, notes, and language variants', () => {
  const structuredIds = [
    'wto-work-programme-electronic-commerce-1998',
    'china-data-security-law-2021',
    'eu-artificial-intelligence-act-2024',
    'un-governing-ai-humanity-2024',
  ];

  for (const recordId of structuredIds) {
    const record = records.find((item) => item.id === recordId);
    assert.ok(record.sourceLinks.every((link) => typeof link.label === 'string' && typeof link.url === 'string'));
    assert.ok(record.sourceLinks.some((link) => link.linkType));
    assert.ok(record.sourceLinks.some((link) => link.note));
  }
});
```

- [ ] **Step 4: Run the model and smoke tests again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs tests\source-links.test.mjs
```

Expected: PASS, with the representative enriched records now producing visibly better dossier output while the broader legacy corpus remains intact.

### Task 5: Verify the whole site and review the upgraded record pages in external Chrome

**Files:**
- Test: `tests\*.test.mjs`
- Preview: local static server and Chrome pages

- [ ] **Step 1: Run the full automated suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS with all suites green and no regressions in topics, dimensions, timeline, or record rendering.

- [ ] **Step 2: Start or reuse the local preview server**

If the preview server is not already running, start it in a separate shell:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\preview-server.mjs
```

Expected: the site is reachable at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Open the upgraded record pages in external Chrome**

Use external Chrome, not the in-app browser:

```powershell
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/wto-work-programme-electronic-commerce-1998'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/china-data-security-law-2021'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/eu-artificial-intelligence-act-2024'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/un-governing-ai-humanity-2024'
```

Verify manually on each page:

- `Source dossier` appears instead of `Sources`
- primary or controlling text appears first
- original and English variants are clearly distinguished where applicable
- document-page and repository links are not mistaken for the controlling text
- source notes explain what each link contains
- invalid-link handling still works on the regression fixture

- [ ] **Step 4: Re-run the full suite after any visual-fix follow-up**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS again after any CSS or renderer adjustments made during visual review.

## Self-Review

- Spec coverage:
  - structured `sourceLinks` upgrade: Task 2
  - grouped `Source dossier` UI: Task 3
  - first-pass legal and institutional record enrichment: Task 4
  - tests and Chrome verification: Tasks 1 and 5
- Placeholder scan:
  - no `TODO`, `TBD`, or deferred implementation markers remain
  - each code-changing step includes concrete code snippets
  - each verification step includes an exact command and expected outcome
- Type consistency:
  - the plan uses one consistent helper surface: `normalizeSourceLink()`, `groupSourceLinks()`, and `sourceLinkTypeLabel()`
  - the structured source fields stay aligned with the approved spec: `label`, `url`, `linkType`, `authority`, `languageStatus`, `note`, `sortHint`
