# US, EU, and AI Governance Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a focused content batch that deepens the United States, European Union, and AI governance shelves after the China expansion.

**Architecture:** Keep the existing static portal and schema unchanged. Add records through a new `src/data/records-us-eu-ai-rebalance-batch.js` module, aggregate it in `src/data/records.js`, add dimension mappings, and validate propagation through existing render tests.

**Tech Stack:** Plain ES modules, static HTML rendering, Node built-in tests, GitHub Pages-compatible static hosting.

---

## File Structure

- Create: `src/data/records-us-eu-ai-rebalance-batch.js`
- Modify: `src/data/records.js`
- Modify: `src/data/record-dimensions.js`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

## Task 1: Lock the Rebalance Expectations with Failing Tests

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`
- Test: `tests/data-model.test.mjs`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add a data-model test for the planned batch**

Add a test named `US, EU, and AI rebalance batch deepens the remaining thin shelves`.

The test must assert that these ids exist:

```js
[
  'us-ai-action-plan-2025',
  'us-executive-order-14179-ai-leadership-2025',
  'us-national-standards-strategy-cet-2023',
  'us-outbound-investment-final-rule-2024',
  'us-bis-advanced-computing-export-controls-2022',
  'eu-economic-security-strategy-2023',
  'eu-anti-coercion-instrument-2023',
  'eu-carbon-border-adjustment-mechanism-2023',
  'eu-critical-raw-materials-act-2024',
  'eu-standardisation-strategy-2022',
  'iso-iec-42001-ai-management-system-2023',
  'international-ai-safety-report-2025',
  'international-network-ai-safety-institutes-2024',
  'paris-ai-action-summit-statement-2025',
  'smuha-race-ai-regulation-2021',
  'veale-borgesius-demystifying-eu-ai-act-2021',
]
```

The test must also require `united-states >= 27`, `european-union >= 27`, and `ai-governance >= 31`.

- [ ] **Step 2: Add render-smoke assertions for propagation**

Add a render test named `US, EU, and AI rebalance records propagate through topic and institution pages`.

Assert that:

- the US actor page renders `America&#39;s AI Action Plan`
- the EU topic page renders `European Economic Security Strategy`
- the AI topic page renders `ISO/IEC 42001`
- the NIST institution page renders `National Standards Strategy`
- the UNESCO institution page renders `Recommendation on the Ethics of Artificial Intelligence`

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected result: FAIL because the batch records do not exist yet.

## Task 2: Add the Batch and Aggregate It

**Files:**
- Create: `src/data/records-us-eu-ai-rebalance-batch.js`
- Modify: `src/data/records.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Create the batch file**

Create `src/data/records-us-eu-ai-rebalance-batch.js` exporting `usEuAiRebalanceBatchRecords`.

- [ ] **Step 2: Wire the batch into `records.js`**

Import `usEuAiRebalanceBatchRecords` and spread it after `fifthBatchRecords` so the new records participate in all existing views.

- [ ] **Step 3: Add all 16 records**

Each record must use existing schema values, stable source links, explicit authors or publisher metadata, and conservative summaries.

## Task 3: Add Dimension Mappings

**Files:**
- Modify: `src/data/record-dimensions.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Map every new record to at least one dimension**

Use the existing five dimensions only:

- `agenda-setting`
- `coalition-consensus-building`
- `legitimacy-management`
- `norm-entrepreneurship-drafting-power`
- `objective-setting`

- [ ] **Step 2: Run focused tests and verify GREEN**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\data-model.test.mjs tests\render-smoke.test.mjs
```

Expected result: PASS.

## Task 4: Verify the Full Portal

**Files:**
- No new files

- [ ] **Step 1: Run the full test suite**

Run:

```powershell
& 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.mjs
```

Expected result: all tests pass.

- [ ] **Step 2: Review the git diff**

Check that only the planned docs, data, aggregation, dimensions, and tests changed.

- [ ] **Step 3: Commit the batch**

Commit with:

```powershell
& 'C:\Users\USER\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe' add docs/superpowers/specs/2026-05-26-us-eu-ai-governance-rebalance-design.md docs/superpowers/plans/2026-05-26-us-eu-ai-governance-rebalance-implementation.md src/data/records-us-eu-ai-rebalance-batch.js src/data/records.js src/data/record-dimensions.js tests/data-model.test.mjs tests/render-smoke.test.mjs
& 'C:\Users\USER\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe' commit -m "feat: rebalance US EU and AI governance shelves"
```
