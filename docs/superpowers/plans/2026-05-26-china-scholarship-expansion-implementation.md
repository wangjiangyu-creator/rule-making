# China Scholarship Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the China shelf with a large scholarly batch on international rule-making and make the China topic page visibly categorized under the existing record-type model.

**Architecture:** Keep the current schema and route structure. Add one new China scholarship batch file, aggregate it through the existing records index, and update only the China topic detail renderer so it groups linked records by existing `recordType` values with section subheadings and divider lines.

**Tech Stack:** Plain ES modules, static HTML rendering, Node built-in tests, GitHub Pages-compatible static hosting.

---

## File Structure

- Modify: `docs/superpowers/specs/2026-05-26-china-scholarship-expansion-design.md`
- Create: `src/data/records-china-scholarship-batch.js`
- Modify: `src/data/records.js`
- Modify: `src/views/topics.js`
- Modify: `src/styles.css`
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

## Task 1: Add the China Scholarship Batch

**Files:**
- Create: `src/data/records-china-scholarship-batch.js`
- Modify: `src/data/records.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Build the verified literature set**

Add a dedicated China batch covering:

- WTO accession, WTO-plus obligations, WTO reform, and regional trade strategy
- investment treaties, BIT politics, and international economic law positioning
- AIIB, BRICS, G20, and broader global economic governance strategy
- cyber sovereignty, data governance, digital trade, and AI governance

- [ ] **Step 2: Link the literature across the portal map**

For each new record:

- keep `recordType` within the existing schema
- add authors and publisher metadata where available
- link to `china` plus relevant comparative and issue-specific topics
- attach institution ids where the work is materially about WTO, G20, BRICS, AIIB, NDB, UN, or related forums

- [ ] **Step 3: Aggregate the new batch**

Append the new batch through `src/data/records.js` without altering the schema.

## Task 2: Render Category Sections on the China Page

**Files:**
- Modify: `src/views/topics.js`
- Modify: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add China-only category grouping**

Group the China topic page by current `recordType` categories only. Render each non-empty category as its own section with:

- a subheading
- a short count line
- the record list for that category
- a divider line between category sections

- [ ] **Step 2: Preserve the current behavior elsewhere**

Leave non-China topic pages on the existing flat linked-record layout.

## Task 3: Tighten Validation

**Files:**
- Modify: `tests/data-model.test.mjs`
- Modify: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Raise China shelf expectations**

Add assertions that the China topic now includes:

- a materially larger total record count
- scholarly coverage through `academic-article` and `book-chapter`
- continued official and report-style coverage

- [ ] **Step 2: Validate grouped rendering**

Add render assertions that the China page exposes category subheadings and divider markup while other topic pages still render normally.

## Task 4: Verify and Publish

**Files:**
- No new files

- [ ] **Step 1: Run focused tests**

Run the touched render and data-model tests first.

- [ ] **Step 2: Run the full suite**

Run `node --test tests/*.test.mjs`.

- [ ] **Step 3: Publish if the workspace is on the deploy branch**

If the repo is on the production branch and the working tree is ready, commit and push the scholarship expansion so the live China page picks up the new categorized shelf.
