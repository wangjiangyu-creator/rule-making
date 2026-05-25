# Thin Topic Balance Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the five thin topic shelves by adding a balance-first content batch, plus a small cross-link audit, so the portal becomes more even across substantive research areas.

**Architecture:** Keep the current portal structure unchanged and add the new content through a dedicated `records-fourth-batch.js` module plus matching dimension mappings. Tighten the data-model and render-smoke tests first, then build the batch in three topic-group passes so each step leaves the corpus in a coherent, testable state.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, structured ES-module data files, Node built-in test runner.

**Git note:** `git` is not available in PATH on this machine, so this plan uses verification checkpoints instead of commit steps. If a usable git binary appears during execution, commit after each completed task.

---

## File Structure

- Create: `src/data/records-fourth-batch.js`
- Create: `docs/superpowers/plans/2026-05-25-thin-topic-balance-expansion-implementation.md`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Modify: `src/data/record-dimensions.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

## Planned Record Batch

This plan adds the following new records:

- `us-national-cybersecurity-strategy-2023`
- `declaration-future-internet-2022`
- `us-ai-bill-of-rights-2022`
- `political-declaration-responsible-military-ai-autonomy-2023`
- `goldsmith-wu-who-controls-internet-2006`
- `xi-high-level-dialogue-global-development-2022`
- `gdi-concept-note-2022`
- `vision-actions-belt-road-2015`
- `china-anti-foreign-sanctions-law-2021`
- `third-belt-road-forum-chairs-statement-2023`
- `uncitral-code-conduct-adjudicators-isds-2023`
- `world-bank-global-investment-competitiveness-report-2019-2020`
- `world-bank-global-investment-competitiveness-report-2017-2018`
- `unctad-investment-facilitation-iias-trends-policy-options-2023`
- `unctad-facilitating-investment-sdgs-2022`
- `toward-integrated-policy-framework-2020`
- `fsb-global-stablecoin-high-level-recommendations-2023`
- `g20-common-framework-debt-treatments-2020`
- `enhancing-cross-border-payments-roadmap-2020`
- `tooze-crashed-decade-financial-crises-2018`
- `oecd-framework-classification-ai-systems-2022`
- `un-ai-advisory-body-interim-report-2023`
- `unesco-ai-readiness-assessment-methodology-2023`

This plan also repairs one high-value existing cross-link:

- `farrell-newman-weaponized-interdependence-2019` gains `united-states` and `china`

## Target Shelf Outcomes

After the batch and cross-link audit, the tests should enforce at least:

- `united-states`: `18` linked records
- `china`: `19` linked records
- `international-investment`: `18` linked records
- `monetary-financial-regulation`: `20` linked records
- `ai-governance`: `20` linked records

The tests should also preserve mixed material types for those shelves.

### Task 1: Lock the thin-topic batch expectations with failing tests

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add failing data-model assertions for the new batch ids and shelf minima**

Extend `tests/data-model.test.mjs` with one focused batch test.

```js
test('thin-topic balance batch raises the weaker shelves with mixed-source additions', () => {
  const expectedIds = [
    'us-national-cybersecurity-strategy-2023',
    'declaration-future-internet-2022',
    'us-ai-bill-of-rights-2022',
    'political-declaration-responsible-military-ai-autonomy-2023',
    'goldsmith-wu-who-controls-internet-2006',
    'xi-high-level-dialogue-global-development-2022',
    'gdi-concept-note-2022',
    'vision-actions-belt-road-2015',
    'china-anti-foreign-sanctions-law-2021',
    'third-belt-road-forum-chairs-statement-2023',
    'uncitral-code-conduct-adjudicators-isds-2023',
    'world-bank-global-investment-competitiveness-report-2019-2020',
    'world-bank-global-investment-competitiveness-report-2017-2018',
    'unctad-investment-facilitation-iias-trends-policy-options-2023',
    'unctad-facilitating-investment-sdgs-2022',
    'toward-integrated-policy-framework-2020',
    'fsb-global-stablecoin-high-level-recommendations-2023',
    'g20-common-framework-debt-treatments-2020',
    'enhancing-cross-border-payments-roadmap-2020',
    'tooze-crashed-decade-financial-crises-2018',
    'oecd-framework-classification-ai-systems-2022',
    'un-ai-advisory-body-interim-report-2023',
    'unesco-ai-readiness-assessment-methodology-2023',
  ];

  const recordIds = new Set(records.map((record) => record.id));
  const byTopic = Object.fromEntries(
    topics.map((topic) => [topic.id, records.filter((record) => record.topics.includes(topic.id))]),
  );

  for (const expectedId of expectedIds) {
    assert.ok(recordIds.has(expectedId), `${expectedId} exists`);
  }

  assert.ok(byTopic['united-states'].length >= 18, 'united states topic has at least eighteen records');
  assert.ok(byTopic.china.length >= 19, 'china topic has at least nineteen records');
  assert.ok(byTopic['international-investment'].length >= 18, 'international investment topic has at least eighteen records');
  assert.ok(byTopic['monetary-financial-regulation'].length >= 20, 'money and finance topic has at least twenty records');
  assert.ok(byTopic['ai-governance'].length >= 20, 'ai governance topic has at least twenty records');

  assert.ok(
    byTopic['united-states'].some((record) => ['academic-article', 'book-chapter'].includes(record.recordType)),
    'united states shelf includes literature',
  );
  assert.ok(
    byTopic.china.some((record) => ['official-statement', 'research-report'].includes(record.recordType)),
    'china shelf includes statements or report-style materials',
  );
  assert.ok(
    byTopic['international-investment'].some((record) => record.recordType === 'research-report'),
    'international investment includes report-style reform materials',
  );
  assert.ok(
    byTopic['monetary-financial-regulation'].some((record) => record.recordType === 'official-statement'),
    'money and finance includes official statements',
  );
  assert.ok(
    byTopic['ai-governance'].some((record) => ['academic-article', 'book-chapter', 'research-report'].includes(record.recordType)),
    'ai governance includes literature or report-style governance materials',
  );
});
```

- [ ] **Step 2: Add failing render-smoke coverage for updated topic, actor, and institution propagation**

Extend `tests/render-smoke.test.mjs` with one topic-page check and one actor/institution propagation check.

```js
test('thin-topic pages surface the new balance-first materials', () => {
  const unitedStatesHtml = renderTopicDetail('united-states');
  const investmentHtml = renderTopicDetail('international-investment');
  const aiHtml = renderTopicDetail('ai-governance');

  assert.match(unitedStatesHtml, /National Cybersecurity Strategy/);
  assert.match(unitedStatesHtml, /Who Controls the Internet/);
  assert.match(investmentHtml, /Code of Conduct for Adjudicators in International Investment Disputes/);
  assert.match(aiHtml, /OECD Framework for the Classification of AI Systems/);
});

test('new batch records propagate to actor and institution pages', () => {
  const actorHtml = renderActorDetail('united-states');
  const institutionHtml = renderInstitutionDetail('imf');

  assert.match(actorHtml, /Declaration for the Future of the Internet/);
  assert.match(institutionHtml, /Integrated Policy Framework/);
});
```

- [ ] **Step 3: Run the focused tests and verify they fail for missing batch records**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL because the new ids do not exist yet, the shelf minima are not met, and the topic/actor/institution pages do not render the new material.

### Task 2: Scaffold the fourth batch file and apply the cross-link repair

**Files:**
- Create: `src/data/records-fourth-batch.js`
- Modify: `src/data/records.js`
- Modify: `src/data/records-third-batch.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Create the new batch file and wire it into the record aggregator**

Create `src/data/records-fourth-batch.js` with an exported array and import it into `src/data/records.js`.

```js
// src/data/records-fourth-batch.js
export const fourthBatchRecords = [
];
```

```js
// src/data/records.js
import { fourthBatchRecords } from './records-fourth-batch.js';

export const records = [
  ...baseRecords,
  ...thirdBatchRecords,
  ...fourthBatchRecords,
].map((record) => ({
  ...record,
  dimensions: recordDimensionsById[record.id] ?? [],
}));
```

- [ ] **Step 2: Repair the Farrell-Newman record so it strengthens the US and China shelves immediately**

Update the existing record in `src/data/records-third-batch.js`.

```js
{
  id: 'farrell-newman-weaponized-interdependence-2019',
  ...
  topics: ['great-powers', 'united-states', 'china', 'cyber-data-governance', 'monetary-financial-regulation'],
  ...
}
```

- [ ] **Step 3: Run the focused tests again to confirm they still fail for the expected missing-record reasons**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: FAIL, but with one cross-link repaired and the remaining failures driven by the still-missing fourth-batch records and dimension mappings.

### Task 3: Add the United States and China sub-batch plus dimension mappings

**Files:**
- Modify: `src/data/records-fourth-batch.js`
- Modify: `src/data/record-dimensions.js`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the US-facing records to `src/data/records-fourth-batch.js`**

Append these records:

```js
{
  id: 'us-national-cybersecurity-strategy-2023',
  title: 'National Cybersecurity Strategy',
  alternateTitle: 'United States National Cybersecurity Strategy 2023',
  recordType: 'official-statement',
  date: '2023-03-02',
  year: 2023,
  actors: ['united-states'],
  jurisdictions: ['United States'],
  institutions: ['us-state-department'],
  topics: ['united-states', 'cyber-data-governance', 'great-powers'],
  summary:
    'The strategy frames US cybersecurity policy through resilience, market-shaping regulation, coalition-building, and international norm development, making it a core US rule-making document.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'White House strategy page',
      url: 'https://www.whitehouse.gov/briefing-room/statements-releases/2023/03/02/fact-sheet-national-cybersecurity-strategy/',
    },
  ],
  citation: 'The White House, National Cybersecurity Strategy, 2 March 2023.',
  relatedRecordIds: ['us-international-cyberspace-digital-policy-strategy-2024', 'china-data-security-law-2021'],
  tags: ['united-states', 'cybersecurity', 'digital-policy', 'coalition-building', 'strategy'],
},
{
  id: 'declaration-future-internet-2022',
  title: 'Declaration for the Future of the Internet',
  alternateTitle: 'Political declaration launched by the United States and partners',
  recordType: 'official-statement',
  date: '2022-04-28',
  year: 2022,
  actors: ['united-states', 'european-union'],
  jurisdictions: ['Global'],
  institutions: ['us-state-department'],
  topics: ['united-states', 'cyber-data-governance', 'middle-small-powers'],
  summary:
    'The declaration articulates an open, global, interoperable, reliable, and secure internet vision and shows how the United States and partners use coalition-building to shape digital governance norms.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'State Department declaration page',
      url: 'https://www.state.gov/declaration-for-the-future-of-the-internet/',
    },
  ],
  citation: 'United States Department of State, Declaration for the Future of the Internet, 28 April 2022.',
  relatedRecordIds: ['eu-us-data-privacy-framework-2023', 'oecd-government-access-private-sector-data-2022'],
  tags: ['future-of-the-internet', 'digital-governance', 'coalition', 'internet-governance', 'norms'],
},
{
  id: 'us-ai-bill-of-rights-2022',
  title: 'Blueprint for an AI Bill of Rights',
  alternateTitle: 'Making Automated Systems Work for the American People',
  recordType: 'institutional-document',
  date: '2022-10-04',
  year: 2022,
  actors: ['united-states'],
  jurisdictions: ['United States'],
  institutions: [],
  topics: ['united-states', 'ai-governance'],
  summary:
    'The White House blueprint articulates rights-based principles for automated systems and serves as a US domestic template with wider international governance relevance.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'White House blueprint page',
      url: 'https://www.whitehouse.gov/ostp/ai-bill-of-rights/',
    },
  ],
  citation: 'White House Office of Science and Technology Policy, Blueprint for an AI Bill of Rights, 4 October 2022.',
  relatedRecordIds: ['us-executive-order-ai-14110-2023', 'oecd-ai-principles-2019'],
  tags: ['ai-bill-of-rights', 'automated-systems', 'rights-based-governance', 'united-states'],
},
{
  id: 'political-declaration-responsible-military-ai-autonomy-2023',
  title: 'Political Declaration on Responsible Military Use of Artificial Intelligence and Autonomy',
  alternateTitle: 'US-led political declaration on military AI',
  recordType: 'official-statement',
  date: '2023-02-16',
  year: 2023,
  actors: ['united-states'],
  jurisdictions: ['Global'],
  institutions: ['us-state-department'],
  topics: ['united-states', 'ai-governance', 'great-powers'],
  summary:
    'The declaration shows how the United States uses political coalition instruments to shape emerging international expectations for military AI and autonomy.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'State Department declaration page',
      url: 'https://www.state.gov/political-declaration-on-responsible-military-use-of-artificial-intelligence-and-autonomy/',
    },
  ],
  citation: 'United States Department of State, Political Declaration on Responsible Military Use of Artificial Intelligence and Autonomy, 16 February 2023.',
  relatedRecordIds: ['g7-hiroshima-ai-process-code-conduct-2023', 'bletchley-declaration-2023'],
  tags: ['military-ai', 'political-declaration', 'united-states', 'coalition', 'emerging-norms'],
},
{
  id: 'goldsmith-wu-who-controls-internet-2006',
  title: 'Who Controls the Internet? Illusions of a Borderless World',
  alternateTitle: 'Book on states, territory, and internet governance',
  recordType: 'book-chapter',
  date: '2006',
  year: 2006,
  actors: ['united-states'],
  jurisdictions: ['Global', 'United States'],
  institutions: [],
  topics: ['united-states', 'cyber-data-governance', 'great-powers'],
  summary:
    'Goldsmith and Wu argue that the internet remains shaped by territorial states and state power, making the book a useful bridge between US governance practice and rule-making theory.',
  sourceAuthority: 'academic-publisher',
  languageStatus: 'english-only',
  sourceLinks: [
    {
      label: 'Oxford Academic book page',
      url: 'https://academic.oup.com/book/10332',
    },
  ],
  citation: 'Jack Goldsmith and Tim Wu, Who Controls the Internet? Illusions of a Borderless World (Oxford University Press, 2006).',
  relatedRecordIds: ['declaration-future-internet-2022', 'farrell-newman-weaponized-interdependence-2019'],
  tags: ['internet-governance', 'territoriality', 'state-power', 'united-states', 'cyber-governance'],
},
```

- [ ] **Step 2: Add the China-facing records to `src/data/records-fourth-batch.js`**

Append these records after the US group:

```js
{
  id: 'xi-high-level-dialogue-global-development-2022',
  title: 'President Xi Jinping Chairs the High-level Dialogue on Global Development',
  alternateTitle: 'Important remarks at the High-level Dialogue on Global Development',
  recordType: 'official-statement',
  date: '2022-06-24',
  year: 2022,
  actors: ['china'],
  jurisdictions: ['Global', 'China'],
  institutions: ['un'],
  topics: ['china', 'great-powers'],
  summary:
    'Xi Jinping used the high-level dialogue to frame development as a multilateral rule-making agenda and to position China as a norm-setting actor on global development governance.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'MFA event page',
      url: 'https://www.mfa.gov.cn/eng/zxxx_662805/202206/t20220625_10709082.html',
    },
  ],
  citation: 'Ministry of Foreign Affairs of the People’s Republic of China, President Xi Jinping Chairs the High-level Dialogue on Global Development, 24 June 2022.',
  relatedRecordIds: ['gdi-concept-note-2022', 'aiib-articles-of-agreement-2015'],
  tags: ['china', 'global-development', 'agenda-setting', 'development-governance'],
},
{
  id: 'gdi-concept-note-2022',
  title: 'Global Development Initiative Concept Paper',
  alternateTitle: 'Concept paper on China’s Global Development Initiative',
  recordType: 'institutional-document',
  date: '2022-09-21',
  year: 2022,
  actors: ['china'],
  jurisdictions: ['Global', 'China'],
  institutions: ['un'],
  topics: ['china', 'great-powers'],
  summary:
    'The concept paper translates the Global Development Initiative into a more structured agenda document, showing how China frames development governance priorities and implementation pathways.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'MFA concept paper page',
      url: 'https://www.mfa.gov.cn/eng/wjbxw/202209/t20220921_10769718.html',
    },
  ],
  citation: 'Ministry of Foreign Affairs of the People’s Republic of China, Global Development Initiative Concept Paper, 21 September 2022.',
  relatedRecordIds: ['xi-high-level-dialogue-global-development-2022', 'china-wto-reform-proposal-2019'],
  tags: ['china', 'global-development-initiative', 'concept-paper', 'agenda-setting'],
},
{
  id: 'vision-actions-belt-road-2015',
  title: 'Vision and Actions on Jointly Building Silk Road Economic Belt and 21st-Century Maritime Silk Road',
  alternateTitle: 'Belt and Road vision and actions document',
  recordType: 'institutional-document',
  date: '2015-03-28',
  year: 2015,
  actors: ['china'],
  jurisdictions: ['China', 'Global'],
  institutions: [],
  topics: ['china', 'great-powers', 'international-investment'],
  summary:
    'The document provides the early policy blueprint for the Belt and Road Initiative and shows how China linked connectivity, finance, and institutional coordination to a broader international rule-shaping project.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'State Council authorized release',
      url: 'https://english.www.gov.cn/archive/publications/2015/03/30/content_281475080249035.htm',
    },
  ],
  citation: 'National Development and Reform Commission, Ministry of Foreign Affairs, and Ministry of Commerce of the People’s Republic of China, Vision and Actions on Jointly Building Silk Road Economic Belt and 21st-Century Maritime Silk Road, 28 March 2015.',
  relatedRecordIds: ['aiib-articles-of-agreement-2015', 'brics-new-development-bank-agreement-2014'],
  tags: ['belt-and-road', 'connectivity', 'development-finance', 'china', 'policy-blueprint'],
},
{
  id: 'china-anti-foreign-sanctions-law-2021',
  title: 'Anti-Foreign Sanctions Law of the People’s Republic of China',
  alternateTitle: 'Zhonghua Renmin Gongheguo Fan Waiguo Zhicai Fa',
  recordType: 'national-law-policy',
  date: '2021-06-10',
  year: 2021,
  actors: ['china'],
  jurisdictions: ['China'],
  institutions: [],
  topics: ['china', 'great-powers'],
  summary:
    'The Anti-Foreign Sanctions Law shows how China uses domestic law to answer and reshape external rule pressure through countermeasures, legal authority, and regulatory reach.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-original',
  sourceLinks: [
    {
      label: 'NPC Chinese original',
      url: 'http://www.npc.gov.cn/npc/c30834/202106/85a6f8c2f0c84b4d8f0a89b88d6f5cf0.shtml',
    },
    {
      label: 'NPC English translation',
      url: 'http://www.npc.gov.cn/englishnpc/c23934/202112/1f0283f31c5b4df0a0a3cfd5e7ed6619.shtml',
    },
  ],
  citation: 'Anti-Foreign Sanctions Law of the People’s Republic of China, adopted 10 June 2021.',
  relatedRecordIds: ['china-export-control-law-2020', 'us-chips-and-science-act-2022'],
  tags: ['china', 'countermeasures', 'sanctions', 'domestic-law-externalization', 'great-powers'],
},
{
  id: 'third-belt-road-forum-chairs-statement-2023',
  title: 'Chair’s Statement of the Third Belt and Road Forum for International Cooperation',
  alternateTitle: 'Third Belt and Road Forum chair’s statement',
  recordType: 'institutional-document',
  date: '2023-10-18',
  year: 2023,
  actors: ['china'],
  jurisdictions: ['Global', 'China'],
  institutions: [],
  topics: ['china', 'great-powers', 'international-investment'],
  summary:
    'The chair’s statement captures how China frames high-quality Belt and Road cooperation through connectivity, finance, standards, and multilateral coordination.',
  sourceAuthority: 'official-government',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'Belt and Road Forum chair’s statement page',
      url: 'https://www.yidaiyilu.gov.cn/p/0MQRJ5N2.html',
    },
  ],
  citation: 'Chair’s Statement of the Third Belt and Road Forum for International Cooperation, 18 October 2023.',
  relatedRecordIds: ['vision-actions-belt-road-2015', 'aiib-articles-of-agreement-2015'],
  tags: ['belt-and-road', 'forum', 'china', 'connectivity', 'international-cooperation'],
},
```

- [ ] **Step 3: Add the corresponding dimension mappings**

Extend `src/data/record-dimensions.js`:

```js
'us-national-cybersecurity-strategy-2023': [
  'objective-setting',
  'coalition-consensus-building',
  'norm-entrepreneurship-drafting-power',
],
'declaration-future-internet-2022': [
  'legitimacy-management',
  'coalition-consensus-building',
  'norm-entrepreneurship-drafting-power',
],
'us-ai-bill-of-rights-2022': [
  'objective-setting',
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
'political-declaration-responsible-military-ai-autonomy-2023': [
  'objective-setting',
  'coalition-consensus-building',
  'norm-entrepreneurship-drafting-power',
],
'goldsmith-wu-who-controls-internet-2006': [
  'objective-setting',
  'norm-entrepreneurship-drafting-power',
],
'xi-high-level-dialogue-global-development-2022': [
  'objective-setting',
  'coalition-consensus-building',
],
'gdi-concept-note-2022': [
  'objective-setting',
  'agenda-setting',
  'coalition-consensus-building',
],
'vision-actions-belt-road-2015': [
  'objective-setting',
  'coalition-consensus-building',
  'norm-entrepreneurship-drafting-power',
],
'china-anti-foreign-sanctions-law-2021': [
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
'third-belt-road-forum-chairs-statement-2023': [
  'objective-setting',
  'agenda-setting',
  'coalition-consensus-building',
],
```

- [ ] **Step 4: Run the focused tests and confirm that investment, finance, and AI failures remain**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: the United States and China assertions begin to pass, but the overall batch test still fails because the investment, monetary-financial, and AI additions are not in place yet.

### Task 4: Add the investment and monetary-financial regulation sub-batch plus dimension mappings

**Files:**
- Modify: `src/data/records-fourth-batch.js`
- Modify: `src/data/record-dimensions.js`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the international-investment records**

Append these records:

```js
{
  id: 'uncitral-code-conduct-adjudicators-isds-2023',
  title: 'Code of Conduct for Adjudicators in International Investment Disputes',
  alternateTitle: 'UNCITRAL Code of Conduct for Adjudicators in ISDS',
  recordType: 'institutional-document',
  date: '2023-07-03',
  year: 2023,
  actors: [],
  jurisdictions: ['UNCITRAL member states'],
  institutions: ['uncitral'],
  topics: ['international-investment'],
  summary:
    'The code of conduct is a concrete institutional reform product from the ISDS reform process and shows how legitimacy, ethics, and adjudicator behavior are being formalized in investment dispute settlement.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'UNCITRAL code of conduct page',
      url: 'https://uncitral.un.org/en/codeofconduct',
    },
  ],
  citation: 'UNCITRAL, Code of Conduct for Adjudicators in International Investment Disputes, 3 July 2023.',
  relatedRecordIds: ['uncitral-isds-working-group-iii', 'icsid-rules-regulations-2022'],
  tags: ['investment-disputes', 'isds-reform', 'ethics', 'adjudicators', 'uncitral'],
},
{
  id: 'world-bank-global-investment-competitiveness-report-2019-2020',
  title: 'Global Investment Competitiveness Report 2019/2020',
  alternateTitle: 'Rebuilding Investor Confidence in Times of Uncertainty',
  recordType: 'research-report',
  date: '2020',
  year: 2020,
  actors: [],
  jurisdictions: ['Global'],
  institutions: ['world-bank'],
  topics: ['international-investment'],
  summary:
    'The report examines what drives investor decisions and policy competition for investment, making it useful for the facilitation and governance side of international investment rule-making.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'World Bank report page',
      url: 'https://www.worldbank.org/en/topic/competitiveness/publication/global-investment-competitiveness-report-2019-2020',
    },
  ],
  citation: 'World Bank Group, Global Investment Competitiveness Report 2019/2020: Rebuilding Investor Confidence in Times of Uncertainty.',
  relatedRecordIds: ['wto-investment-facilitation-development-agreement-2024', 'unctad-investment-policy-framework-sustainable-development-2015'],
  tags: ['investment-competitiveness', 'investor-confidence', 'facilitation', 'world-bank'],
},
{
  id: 'world-bank-global-investment-competitiveness-report-2017-2018',
  title: 'Global Investment Competitiveness Report 2017/2018',
  alternateTitle: 'Foreign Investor Perspectives and Policy Implications',
  recordType: 'research-report',
  date: '2018',
  year: 2018,
  actors: [],
  jurisdictions: ['Global'],
  institutions: ['world-bank'],
  topics: ['international-investment'],
  summary:
    'The first Global Investment Competitiveness Report provides survey-based evidence on investor priorities and policy implications, helping connect investment facilitation debates to real policy demand.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'World Bank report page',
      url: 'https://www.worldbank.org/en/topic/competitiveness/publication/global-investment-competitiveness-report-2017-2018',
    },
  ],
  citation: 'World Bank Group, Global Investment Competitiveness Report 2017/2018: Foreign Investor Perspectives and Policy Implications.',
  relatedRecordIds: ['world-bank-global-investment-competitiveness-report-2019-2020', 'wto-investment-facilitation-development-agreement-2024'],
  tags: ['investment-competitiveness', 'investor-survey', 'facilitation', 'world-bank'],
},
{
  id: 'unctad-investment-facilitation-iias-trends-policy-options-2023',
  title: 'Investment Facilitation in International Investment Agreements: Trends and Policy Options',
  alternateTitle: 'UNCTAD investment facilitation policy paper',
  recordType: 'research-report',
  date: '2023',
  year: 2023,
  actors: [],
  jurisdictions: ['Global'],
  institutions: ['unctad'],
  topics: ['international-investment'],
  summary:
    'UNCTAD reviews how investment facilitation is incorporated into international investment agreements and what policy options follow for contemporary rule design.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'UNCTAD publication page',
      url: 'https://unctad.org/publication/investment-facilitation-international-investment-agreements-trends-and-policy-options',
    },
  ],
  citation: 'UNCTAD, Investment Facilitation in International Investment Agreements: Trends and Policy Options, 2023.',
  relatedRecordIds: ['wto-investment-facilitation-development-agreement-2024', 'unctad-investment-policy-framework-sustainable-development-2015'],
  tags: ['unctad', 'investment-facilitation', 'iias', 'policy-options'],
},
{
  id: 'unctad-facilitating-investment-sdgs-2022',
  title: 'Facilitating Investment for the Sustainable Development Goals',
  alternateTitle: 'UNCTAD policy work on investment facilitation and SDGs',
  recordType: 'research-report',
  date: '2022',
  year: 2022,
  actors: [],
  jurisdictions: ['Global'],
  institutions: ['unctad'],
  topics: ['international-investment'],
  summary:
    'This UNCTAD work links investment facilitation to sustainable development goals and highlights how contemporary investment rule-making is shifting beyond protection alone.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'UNCTAD publication page',
      url: 'https://unctad.org/publication/facilitating-investment-sustainable-development-goals',
    },
  ],
  citation: 'UNCTAD, Facilitating Investment for the Sustainable Development Goals, 2022.',
  relatedRecordIds: ['unctad-investment-facilitation-iias-trends-policy-options-2023', 'wto-investment-facilitation-development-agreement-2024'],
  tags: ['investment-facilitation', 'sdgs', 'unctad', 'development'],
},
```

- [ ] **Step 2: Add the monetary and financial regulation records**

Append these records after the investment group:

```js
{
  id: 'toward-integrated-policy-framework-2020',
  title: 'Toward an Integrated Policy Framework',
  alternateTitle: 'IMF staff paper on monetary, exchange rate, macroprudential, and capital-flow tools',
  recordType: 'research-report',
  date: '2020-07-13',
  year: 2020,
  actors: [],
  jurisdictions: ['IMF members'],
  institutions: ['imf'],
  topics: ['monetary-financial-regulation'],
  summary:
    'The IMF staff paper proposes an integrated framework for using macroeconomic and financial policy tools, showing how expert institutions reshape monetary and capital-flow rule-making after crises.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'IMF paper page',
      url: 'https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2020/07/13/Toward-an-Integrated-Policy-Framework-49500',
    },
  ],
  citation: 'IMF, Toward an Integrated Policy Framework, Staff Discussion Note, 13 July 2020.',
  relatedRecordIds: ['imf-institutional-view-capital-flows-2012', 'dodd-frank-act-2010'],
  tags: ['imf', 'integrated-policy-framework', 'capital-flows', 'macroprudential', 'monetary-governance'],
},
{
  id: 'fsb-global-stablecoin-high-level-recommendations-2023',
  title: 'High-level Recommendations for the Regulation, Supervision and Oversight of Global Stablecoin Arrangements',
  alternateTitle: 'FSB global stablecoin recommendations',
  recordType: 'institutional-document',
  date: '2023-07-17',
  year: 2023,
  actors: [],
  jurisdictions: ['FSB members'],
  institutions: ['fsb'],
  topics: ['monetary-financial-regulation'],
  summary:
    'The recommendations show how the FSB coordinates rule-making on digital money and cross-border financial stability through soft-law standards and implementation expectations.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'FSB recommendations page',
      url: 'https://www.fsb.org/2023/07/high-level-recommendations-for-the-regulation-supervision-and-oversight-of-global-stablecoin-arrangements-final-report/',
    },
  ],
  citation: 'Financial Stability Board, High-level Recommendations for the Regulation, Supervision and Oversight of Global Stablecoin Arrangements, 17 July 2023.',
  relatedRecordIds: ['fsb-crypto-asset-recommendations-2023', 'cpmi-iosco-principles-financial-market-infrastructures-2012'],
  tags: ['fsb', 'stablecoins', 'financial-stability', 'soft-law', 'digital-money'],
},
{
  id: 'g20-common-framework-debt-treatments-2020',
  title: 'Common Framework for Debt Treatments beyond the DSSI',
  alternateTitle: 'G20 common framework on sovereign debt treatment',
  recordType: 'official-statement',
  date: '2020-11-13',
  year: 2020,
  actors: ['china', 'united-states', 'european-union', 'japan', 'united-kingdom'],
  jurisdictions: ['G20'],
  institutions: ['g20', 'imf'],
  topics: ['monetary-financial-regulation', 'china', 'great-powers'],
  summary:
    'The common framework records how major powers and international financial institutions sought to coordinate sovereign debt treatment rules after the pandemic shock.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'G20 Saudi presidency document page',
      url: 'https://www.mofa.gov.sa/sites/mofaen/KingdomForeignPolicy/G20/Pages/commonframeworkfordebttreatmentsbeyondthedssi.aspx',
    },
  ],
  citation: 'G20, Common Framework for Debt Treatments beyond the DSSI, 13 November 2020.',
  relatedRecordIds: ['imf-articles-of-agreement-1944', 'brics-new-development-bank-agreement-2014'],
  tags: ['g20', 'sovereign-debt', 'common-framework', 'pandemic', 'coordination'],
},
{
  id: 'enhancing-cross-border-payments-roadmap-2020',
  title: 'Enhancing Cross-border Payments: Stage 3 Roadmap',
  alternateTitle: 'FSB roadmap for cross-border payments',
  recordType: 'institutional-document',
  date: '2020-10-13',
  year: 2020,
  actors: [],
  jurisdictions: ['G20', 'Global'],
  institutions: ['fsb', 'cpmi'],
  topics: ['monetary-financial-regulation'],
  summary:
    'The roadmap shows how the FSB and CPMI coordinate a practical agenda for reshaping payment-system rules, standards, and interoperability across borders.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'FSB roadmap page',
      url: 'https://www.fsb.org/2020/10/enhancing-cross-border-payments-stage-3-roadmap/',
    },
  ],
  citation: 'Financial Stability Board, Enhancing Cross-border Payments: Stage 3 Roadmap, 13 October 2020.',
  relatedRecordIds: ['cpmi-iosco-principles-financial-market-infrastructures-2012', 'fsb-global-stablecoin-high-level-recommendations-2023'],
  tags: ['cross-border-payments', 'fsb', 'cpmi', 'payments', 'interoperability'],
},
{
  id: 'tooze-crashed-decade-financial-crises-2018',
  title: 'Crashed: How a Decade of Financial Crises Changed the World',
  alternateTitle: 'Book on the post-2008 financial order',
  recordType: 'book-chapter',
  date: '2018',
  year: 2018,
  actors: ['united-states', 'european-union'],
  jurisdictions: ['Global'],
  institutions: [],
  topics: ['monetary-financial-regulation', 'great-powers'],
  summary:
    'Tooze provides a historically grounded account of post-crisis governance, central bank power, and the institutional remaking of the global financial order.',
  sourceAuthority: 'academic-publisher',
  languageStatus: 'english-only',
  sourceLinks: [
    {
      label: 'Penguin Random House book page',
      url: 'https://www.penguinrandomhouse.com/books/548640/crashed-by-adam-tooze/',
    },
  ],
  citation: 'Adam Tooze, Crashed: How a Decade of Financial Crises Changed the World (Penguin, 2018).',
  relatedRecordIds: ['basel-iii-finalising-post-crisis-reforms-2017', 'imf-articles-of-agreement-1944'],
  tags: ['financial-crisis', 'global-finance', 'great-powers', 'governance', 'history'],
},
```

- [ ] **Step 3: Add the corresponding dimension mappings**

Extend `src/data/record-dimensions.js`:

```js
'uncitral-code-conduct-adjudicators-isds-2023': [
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
'world-bank-global-investment-competitiveness-report-2019-2020': [
  'objective-setting',
  'legitimacy-management',
],
'world-bank-global-investment-competitiveness-report-2017-2018': [
  'objective-setting',
],
'unctad-investment-facilitation-iias-trends-policy-options-2023': [
  'objective-setting',
  'norm-entrepreneurship-drafting-power',
],
'unctad-facilitating-investment-sdgs-2022': [
  'objective-setting',
  'norm-entrepreneurship-drafting-power',
],
'toward-integrated-policy-framework-2020': [
  'objective-setting',
  'legitimacy-management',
],
'fsb-global-stablecoin-high-level-recommendations-2023': [
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
'g20-common-framework-debt-treatments-2020': [
  'legitimacy-management',
  'coalition-consensus-building',
],
'enhancing-cross-border-payments-roadmap-2020': [
  'agenda-setting',
  'norm-entrepreneurship-drafting-power',
],
'tooze-crashed-decade-financial-crises-2018': [
  'objective-setting',
  'agenda-setting',
],
```

- [ ] **Step 4: Run the focused tests and confirm that the remaining failures are AI-specific**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: the United States, China, investment, and finance assertions pass, with remaining failures tied to the still-missing AI-governance records and pages.

### Task 5: Add the AI-governance sub-batch and finalize propagation

**Files:**
- Modify: `src/data/records-fourth-batch.js`
- Modify: `src/data/record-dimensions.js`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add the AI-governance records**

Append these records:

```js
{
  id: 'oecd-framework-classification-ai-systems-2022',
  title: 'OECD Framework for the Classification of AI Systems',
  alternateTitle: 'OECD AI system classification framework',
  recordType: 'institutional-document',
  date: '2022',
  year: 2022,
  actors: [],
  jurisdictions: ['OECD members', 'Global'],
  institutions: ['oecd'],
  topics: ['ai-governance'],
  summary:
    'The OECD framework offers a structured classification tool for AI systems and shows how technical-conceptual standardization supports governance design and international policy coordination.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'OECD report page',
      url: 'https://www.oecd.org/publications/oecd-framework-for-the-classification-of-ai-systems-cb6d9eca-en.htm',
    },
  ],
  citation: 'OECD, OECD Framework for the Classification of AI Systems, 2022.',
  relatedRecordIds: ['oecd-ai-principles-2019', 'eu-artificial-intelligence-act-2024'],
  tags: ['oecd', 'ai-classification', 'framework', 'governance', 'standard-setting'],
},
{
  id: 'un-ai-advisory-body-interim-report-2023',
  title: 'Interim Report: Governing AI for Humanity',
  alternateTitle: 'UN High-Level Advisory Body on AI interim report',
  recordType: 'research-report',
  date: '2023-12-21',
  year: 2023,
  actors: [],
  jurisdictions: ['Global'],
  institutions: ['un'],
  topics: ['ai-governance'],
  summary:
    'The interim report previews the UN advisory body’s institutional diagnosis and options, making it a useful bridge between early agenda-framing and the 2024 final report.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'UN interim report page',
      url: 'https://www.un.org/sites/un2.un.org/files/governing_ai_for_humanity_interim_report.pdf',
    },
  ],
  citation: 'United Nations High-Level Advisory Body on Artificial Intelligence, Interim Report: Governing AI for Humanity, 21 December 2023.',
  relatedRecordIds: ['un-governing-ai-humanity-2024', 'un-general-assembly-ai-resolution-78-265-2024'],
  tags: ['un', 'ai-governance', 'interim-report', 'institutional-design', 'global-governance'],
},
{
  id: 'unesco-ai-readiness-assessment-methodology-2023',
  title: 'Readiness Assessment Methodology: A Tool of the Recommendation on the Ethics of Artificial Intelligence',
  alternateTitle: 'UNESCO AI readiness assessment methodology',
  recordType: 'institutional-document',
  date: '2023',
  year: 2023,
  actors: [],
  jurisdictions: ['UNESCO member states'],
  institutions: ['un'],
  topics: ['ai-governance'],
  summary:
    'UNESCO’s readiness assessment methodology translates AI ethics principles into an assessment instrument, showing how soft-law recommendations are operationalized in state practice.',
  sourceAuthority: 'official-international-organization',
  languageStatus: 'official-english',
  sourceLinks: [
    {
      label: 'UNESCO methodology page',
      url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics/readiness-assessment-methodology',
    },
  ],
  citation: 'UNESCO, Readiness Assessment Methodology: A Tool of the Recommendation on the Ethics of Artificial Intelligence, 2023.',
  relatedRecordIds: ['unesco-recommendation-ethics-ai-2021', 'oecd-framework-classification-ai-systems-2022'],
  tags: ['unesco', 'ai-ethics', 'readiness-assessment', 'implementation', 'soft-law'],
},
```

- [ ] **Step 2: Add the corresponding dimension mappings**

Extend `src/data/record-dimensions.js`:

```js
'oecd-framework-classification-ai-systems-2022': [
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
'un-ai-advisory-body-interim-report-2023': [
  'objective-setting',
  'legitimacy-management',
],
'unesco-ai-readiness-assessment-methodology-2023': [
  'legitimacy-management',
  'norm-entrepreneurship-drafting-power',
],
```

- [ ] **Step 3: Run the focused tests until they pass**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected: PASS, with the thin-topic batch ids present, the shelf minima met, and the topic/actor/institution propagation checks satisfied.

### Task 6: Verify the whole site and review the strengthened shelves in external Chrome

**Files:**
- Test: `tests\*.test.mjs`
- Preview: local static server and Chrome pages

- [ ] **Step 1: Run the full automated suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS with the new thin-topic coverage, attribution, source dossier, timeline, and dimensions tests all green.

- [ ] **Step 2: Start or reuse the local preview server**

If the preview server is not already running, start it in a separate shell:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\preview-server.mjs
```

Expected: the site is reachable at `http://127.0.0.1:4173/`.

- [ ] **Step 3: Open the strengthened topic pages and representative records in external Chrome**

Use external Chrome, not the in-app browser:

```powershell
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/united-states'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/china'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/international-investment'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/monetary-financial-regulation'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/topics/ai-governance'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/us-national-cybersecurity-strategy-2023'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/uncitral-code-conduct-adjudicators-isds-2023'
Start-Process 'C:\Program Files\Google\Chrome\Application\chrome.exe' 'http://127.0.0.1:4173/#/records/oecd-framework-classification-ai-systems-2022'
```

Verify manually:

- the thin-topic shelves visibly gained depth
- new record titles appear on their home topic pages
- cross-topic records show up in actor and institution views where expected
- source links, attribution lines, and record metadata all render cleanly
- no mojibake or broken route imports appear in the updated pages

- [ ] **Step 4: Re-run the full suite after any visual-fix follow-up**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

Expected: PASS again after any data or renderer correction from the Chrome review.

## Self-Review

- Spec coverage:
  - balance-first focus on the five thin shelves: Tasks 3, 4, and 5
  - mixed record types and source discipline: Tasks 1, 3, 4, and 5
  - propagation through topics, actors, institutions, and dimensions: Tasks 1, 2, 3, 4, and 5
  - external Chrome verification: Task 6
- Placeholder scan:
  - no `TODO`, `TBD`, or deferred implementation markers remain
  - each code-changing step includes concrete record ids, fields, and commands
  - each verification step includes an exact command and expected outcome
- Type consistency:
  - new records are added through one new batch file, `src/data/records-fourth-batch.js`
  - every new record gets a matching `recordDimensionsById` entry
  - the plan reuses the current schema, actors, and institutions rather than introducing a second content model
