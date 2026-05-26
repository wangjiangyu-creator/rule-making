# China Institutional Practice Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a large China-first institutional-practice batch, promote China-linked records on relevant topic and institution pages, and strengthen institution coverage for China’s activity across WTO, IMF/World Bank/AIIB/NDB, UN/UNCTAD, and coalition forums.

**Architecture:** Keep the Topic Atlas + Database structure intact. Implement the change through one new China batch module, targeted institution-node enrichment, a small context-aware ordering helper, and red-green test coverage for both content presence and China-first retrieval behavior.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, structured ES-module data files, Node built-in test runner.

---

## File Structure

- Create: `src/data/records-china-institutions-batch.js`
- Create: `docs/superpowers/plans/2026-05-26-china-institutional-practice-expansion-implementation.md`
- Modify: `src/data/records.js`
- Modify: `src/data/institutions.js`
- Modify: `src/data/record-dimensions.js`
- Modify: `src/lib/search.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/institutions.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

## Planned New Record Batch

This plan adds the following new China-focused records:

- `wto-trade-policy-review-china-secretariat-report-2024`
- `wto-trade-policy-review-china-government-report-2024`
- `wto-china-round-table-accessions-2026`
- `wto-investment-facilitation-workshop-2017`
- `china-welcomes-wto-ecommerce-interim-arrangements-2026`
- `imfc-statement-pan-gongsheng-2024`
- `imfc-statement-pan-gongsheng-2026`
- `world-bank-china-country-partnership-framework-2020-2025`
- `china-wbg-global-center-ecological-systems-transitions-2024`
- `aiib-corporate-strategy-2021-2030`
- `ndb-general-strategy-2022-2026`
- `global-development-initiative-building-on-2030-sdgs-2021`
- `group-friends-global-development-initiative-launch-2022`
- `gdi-ministerial-meeting-un-desa-statement-2022`
- `un-china-sustainable-development-cooperation-framework-2021-2025`
- `unctad-invest-china-building-prosperous-future-2023`
- `g20-hangzhou-communique-2016`
- `apec-beijing-agenda-2014`
- `apec-accord-innovative-development-economic-reform-growth-2014`
- `brics-xiamen-declaration-2017`
- `brics-beijing-declaration-2022`
- `bri-debt-sustainability-framework-participating-countries-2019`
- `bri-debt-sustainability-framework-market-access-countries-2023`
- `second-belt-road-forum-joint-communique-2019`
- `beijing-initiative-belt-road-green-development-2023`
- `beijing-declaration-belt-road-ceo-conference-2023`

This plan also enriches institution tagging for existing records tied to China-backed institutions and forums.

## Planned Institution Additions

- `aiib`
- `new-development-bank`
- `brics`
- `belt-road-forum`

### Task 1: Lock the China batch and China-first retrieval behavior with failing tests

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Extend the data-model test with the new institution ids and China batch expectations**

Add `aiib`, `new-development-bank`, `brics`, and `belt-road-forum` to the expected institution ids in `tests/data-model.test.mjs`.

Add a new test:

```js
test('china institutional-practice batch materially deepens the China shelf', () => {
  const expectedIds = [
    'wto-trade-policy-review-china-secretariat-report-2024',
    'wto-trade-policy-review-china-government-report-2024',
    'wto-china-round-table-accessions-2026',
    'wto-investment-facilitation-workshop-2017',
    'china-welcomes-wto-ecommerce-interim-arrangements-2026',
    'imfc-statement-pan-gongsheng-2024',
    'imfc-statement-pan-gongsheng-2026',
    'world-bank-china-country-partnership-framework-2020-2025',
    'china-wbg-global-center-ecological-systems-transitions-2024',
    'aiib-corporate-strategy-2021-2030',
    'ndb-general-strategy-2022-2026',
    'global-development-initiative-building-on-2030-sdgs-2021',
    'group-friends-global-development-initiative-launch-2022',
    'gdi-ministerial-meeting-un-desa-statement-2022',
    'un-china-sustainable-development-cooperation-framework-2021-2025',
    'unctad-invest-china-building-prosperous-future-2023',
    'g20-hangzhou-communique-2016',
    'apec-beijing-agenda-2014',
    'apec-accord-innovative-development-economic-reform-growth-2014',
    'brics-xiamen-declaration-2017',
    'brics-beijing-declaration-2022',
    'bri-debt-sustainability-framework-participating-countries-2019',
    'bri-debt-sustainability-framework-market-access-countries-2023',
    'second-belt-road-forum-joint-communique-2019',
    'beijing-initiative-belt-road-green-development-2023',
    'beijing-declaration-belt-road-ceo-conference-2023',
  ];

  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic.china.length >= 45, 'china topic has at least forty-five records');
  assert.ok(new Set(byTopic.china.map((record) => record.recordType)).size >= 6, 'china topic spans at least six material types');
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('wto')),
    'china topic includes WTO-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('imf')),
    'china topic includes IMF-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('world-bank')),
    'china topic includes World Bank-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('g20')),
    'china topic includes G20-linked records',
  );
  assert.ok(
    byTopic.china.some((record) => record.institutions.includes('apec')),
    'china topic includes APEC-linked records',
  );
});
```

- [ ] **Step 2: Add failing render-smoke assertions for China-first promotion on topic and institution pages**

Add a render test:

```js
test('china-linked records are promoted on mixed topic and institution pages', () => {
  const chinaTopicHtml = renderTopicDetail('china');
  const wtoHtml = renderTopicDetail('wto-reform');
  const worldBankHtml = renderInstitutionDetail('world-bank');

  assert.match(chinaTopicHtml, /China and International Rule-Making/);
  assert.match(wtoHtml, /China in this topic/);
  assert.match(worldBankHtml, /China in this institution/);
  assert.match(wtoHtml, /Trade Policy Review: China 2024/);
  assert.match(worldBankHtml, /Country Partnership Framework for China/);
  assert.ok(wtoHtml.indexOf('Trade Policy Review: China 2024') < wtoHtml.indexOf('Ottawa Group and WTO Reform'));
});
```

- [ ] **Step 3: Run the focused tests and verify they fail**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL because the new ids, institution nodes, and China-promotion behavior do not exist yet.

### Task 2: Add institution nodes and the China-aware ordering helper

**Files:**
- Modify: `src/data/institutions.js`
- Modify: `src/lib/search.js`
- Modify: `src/views/topics.js`
- Modify: `src/views/institutions.js`
- Test: `tests\render-smoke.test.mjs`

- [ ] **Step 1: Add the missing institution nodes**

Append these entries to `src/data/institutions.js`:

```js
{
  id: 'aiib',
  name: 'Asian Infrastructure Investment Bank',
  shortName: 'AIIB',
  type: 'international-organization',
  summary: 'China-backed multilateral development bank focused on infrastructure, connectivity, sustainable development, and cross-border financing rules.',
  topicIds: ['china', 'international-investment', 'monetary-financial-regulation', 'great-powers'],
},
{
  id: 'new-development-bank',
  name: 'New Development Bank',
  shortName: 'NDB',
  type: 'international-organization',
  summary: 'BRICS-created development bank that channels infrastructure and sustainable-development finance through an emerging-powers institutional framework.',
  topicIds: ['china', 'monetary-financial-regulation', 'international-investment', 'great-powers'],
},
{
  id: 'brics',
  name: 'BRICS',
  shortName: 'BRICS',
  type: 'forum',
  summary: 'Coalition forum through which China and other major emerging economies coordinate development, financial, and institutional reform agendas.',
  topicIds: ['china', 'great-powers', 'monetary-financial-regulation', 'middle-small-powers'],
},
{
  id: 'belt-road-forum',
  name: 'Belt and Road Forum for International Cooperation',
  shortName: 'BRF',
  type: 'forum',
  summary: 'China-led forum that consolidates Belt and Road policy coordination, development-finance cooperation, connectivity, and implementation commitments.',
  topicIds: ['china', 'international-investment', 'middle-small-powers', 'great-powers'],
},
```

- [ ] **Step 2: Add a context-aware China promotion helper in `src/lib/search.js`**

Add:

```js
export function isChinaRelatedRecord(record) {
  return asList(record.topics).includes('china') || asList(record.actors).includes('china');
}

export function sortRecordsForContext(records, { promoteChina = false } = {}) {
  return [...records].sort((left, right) => {
    if (promoteChina) {
      const leftChina = isChinaRelatedRecord(left) ? 1 : 0;
      const rightChina = isChinaRelatedRecord(right) ? 1 : 0;

      if (rightChina !== leftChina) {
        return rightChina - leftChina;
      }
    }

    return sortableDateValue(right).localeCompare(sortableDateValue(left));
  });
}
```

- [ ] **Step 3: Use the helper in topic and institution views**

Update `recordsForTopic()` in `src/views/topics.js` and `recordsForInstitution()` in `src/views/institutions.js` to call `sortRecordsForContext()` with `promoteChina: topicId !== 'china'` or `promoteChina: true` respectively.

Also render a lead section when China-linked records exist on a non-China topic page or institution page:

```js
const chinaLinkedRecords = linkedRecords.filter((record) => isChinaRelatedRecord(record));
```

and then:

```js
<section>
  <h2>China in this topic</h2>
  <div class="record-list">
    ${chinaLinkedRecords.slice(0, 8).map(renderRecordRow).join('')}
  </div>
</section>
```

Use `China in this institution` for institution pages.

- [ ] **Step 4: Run the render-smoke test again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\render-smoke.test.mjs
```

Expected: still FAIL because the new records do not exist yet, but the new promotion headings should now render for fixtures once data is added.

### Task 3: Add the China institutional-practice batch and wire it into the corpus

**Files:**
- Create: `src/data/records-china-institutions-batch.js`
- Modify: `src/data/records.js`
- Test: `tests\data-model.test.mjs`

- [ ] **Step 1: Create the new batch file and export the China institutional-practice records**

Create:

```js
export const chinaInstitutionalPracticeBatch = [
  // add the 26 records listed in Planned New Record Batch
];
```

Each record must:

- include `china` in `topics`
- include at least one relevant institution or secondary topic
- use HTTPS official links
- preserve explicit `sourceAuthority` and `languageStatus`

- [ ] **Step 2: Import the batch into `src/data/records.js`**

Add:

```js
import { chinaInstitutionalPracticeBatch } from './records-china-institutions-batch.js';
```

and append:

```js
  ...chinaInstitutionalPracticeBatch,
```

before the `.map((record) => ({ ...record, dimensions: ... }))` call.

- [ ] **Step 3: Enrich existing China-backed records with institution tags**

Update existing records so they propagate correctly:

- `aiib-articles-of-agreement-2015` → add `aiib`
- `brics-new-development-bank-agreement-2014` → add `new-development-bank` and `brics`
- `third-belt-road-forum-chairs-statement-2023` → add `belt-road-forum`
- `vision-actions-belt-road-2015` → add `belt-road-forum`

- [ ] **Step 4: Run the focused data-model test**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs
```

Expected: likely FAIL on missing dimensions until Task 4 is completed.

### Task 4: Add dimension mappings for the new batch and finalize retrieval behavior

**Files:**
- Modify: `src/data/record-dimensions.js`
- Test: `tests\data-model.test.mjs`
- Test: `tests\render-smoke.test.mjs`

- [ ] **Step 1: Add dimensions for each new record**

Assign at least one relevant dimension to every new id. Use this pattern:

- agenda-setting:
  - `wto-china-round-table-accessions-2026`
  - `g20-hangzhou-communique-2016`
  - `brics-beijing-declaration-2022`
  - `global-development-initiative-building-on-2030-sdgs-2021`
- coalition-consensus-building:
  - `group-friends-global-development-initiative-launch-2022`
  - `second-belt-road-forum-joint-communique-2019`
  - `apec-beijing-agenda-2014`
- legitimacy-management:
  - `wto-trade-policy-review-china-secretariat-report-2024`
  - `world-bank-china-country-partnership-framework-2020-2025`
  - `un-china-sustainable-development-cooperation-framework-2021-2025`
- norm-entrepreneurship-drafting-power:
  - `aiib-corporate-strategy-2021-2030`
  - `ndb-general-strategy-2022-2026`
  - `bri-debt-sustainability-framework-participating-countries-2019`
  - `bri-debt-sustainability-framework-market-access-countries-2023`
- objective-setting:
  - `china-welcomes-wto-ecommerce-interim-arrangements-2026`
  - `imfc-statement-pan-gongsheng-2024`
  - `imfc-statement-pan-gongsheng-2026`

- [ ] **Step 2: Run the focused tests again**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: PASS for the focused tests.

### Task 5: Run the full verification suite

**Files:**
- No additional file edits expected
- Test: `tests\*.test.mjs`

- [ ] **Step 1: Run the full test suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS with zero failures.

- [ ] **Step 2: Inspect git status**

Run:

```powershell
& 'C:\Users\USER\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe' status --short
```

Expected: only the intended implementation files are modified.
