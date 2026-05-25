# Rulemaking Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public version of the English-first Great Powers and Rule-Making research portal with a structured database and a deeper digital trade and e-commerce pilot.

**Architecture:** Use a static single-page site with hash-based routes so it can run on GitHub Pages without a build service. Store topics, records, actors, institutions, and timeline entries in structured ES module data files. Render the portal client-side with reusable view functions and validate the data model with Node tests.

**Tech Stack:** Plain HTML, CSS, browser JavaScript modules, Node built-in test runner, GitHub Pages-compatible static hosting.

---

## File Structure

- Create: `package.json` for test and local preview scripts.
- Create: `index.html` for the static app shell.
- Create: `src/styles.css` for scholarly, database-first visual styling.
- Create: `src/main.js` for routing, state, filtering, and view composition.
- Create: `src/data/schema.js` for allowed record types, language statuses, and source-authority labels.
- Create: `src/data/topics.js` for topic taxonomy and page copy.
- Create: `src/data/actors.js` for actor profiles.
- Create: `src/data/institutions.js` for institution profiles.
- Create: `src/data/records.js` for the first seed corpus.
- Create: `src/data/timeline.js` for pilot timeline entries.
- Create: `src/lib/format.js` for date, label, and citation helpers.
- Create: `src/lib/search.js` for search indexing and filter logic.
- Create: `src/views/home.js` for the homepage.
- Create: `src/views/topics.js` for topic index and topic detail pages.
- Create: `src/views/database.js` for database list, filtering, and record detail pages.
- Create: `src/views/actors.js` for actor index and actor detail pages.
- Create: `src/views/institutions.js` for institution index and institution detail pages.
- Create: `src/views/sources.js` for Sources and Method.
- Create: `tests/data-model.test.mjs` for schema, relationship, and seed-corpus validation.
- Create: `tests/render-smoke.test.mjs` for route-rendering smoke tests.
- Modify: `.gitignore` only if local preview or dependency artifacts need ignoring.

## Task 1: Static App Shell

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add package metadata and scripts**

Create `package.json`:

```json
{
  "name": "china-and-rulemaking-portal",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "serve": "npx --yes serve@14.2.4 ."
  }
}
```

- [ ] **Step 2: Add the HTML shell**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Great Powers and Rule-Making</title>
    <meta name="description" content="A research portal and database on great powers and rule-making in the international economic system.">
    <link rel="stylesheet" href="./src/styles.css">
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="#/">Great Powers and Rule-Making</a>
      <nav class="top-nav" aria-label="Primary navigation">
        <a href="#/topics">Topics</a>
        <a href="#/topics/digital-trade-ecommerce">Digital Trade Pilot</a>
        <a href="#/database">Database</a>
        <a href="#/actors">Actors</a>
        <a href="#/institutions">Institutions</a>
        <a href="#/sources-method">Sources and Method</a>
      </nav>
    </header>
    <main id="app" tabindex="-1"></main>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 3: Add minimal route rendering**

Create `src/main.js`:

```js
const app = document.querySelector("#app");

function renderShell() {
  app.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">International economic governance</p>
      <h1>Great Powers and Rule-Making</h1>
      <p class="lede">A research portal and database on international rule-making, great powers, institutions, and issue-specific governance regimes.</p>
      <div class="hero-actions">
        <a class="button primary" href="#/topics/digital-trade-ecommerce">Open Digital Trade Pilot</a>
        <a class="button" href="#/database">Search Database</a>
      </div>
    </section>
  `;
}

function route() {
  renderShell();
  app.focus();
}

window.addEventListener("hashchange", route);
route();
```

- [ ] **Step 4: Add baseline CSS**

Create `src/styles.css`:

```css
:root {
  color-scheme: light;
  --ink: #202124;
  --muted: #5f6368;
  --line: #d9dee7;
  --surface: #ffffff;
  --panel: #f6f8fb;
  --accent: #1f6f8b;
  --accent-dark: #164f64;
  --rule: #8a5a2b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--ink);
  background: #fbfcfd;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

a {
  color: var(--accent-dark);
  text-decoration-thickness: .08em;
  text-underline-offset: .18em;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 28px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, .96);
  backdrop-filter: blur(8px);
}

.brand {
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
}

.top-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 14px;
}

.top-nav a {
  color: var(--muted);
  text-decoration: none;
}

.top-nav a:hover {
  color: var(--ink);
}

main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 24px 56px;
}

.page-hero {
  display: grid;
  gap: 18px;
  padding: 46px 0 28px;
  border-bottom: 1px solid var(--line);
}

.eyebrow {
  margin: 0;
  color: var(--rule);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  margin: 0;
  line-height: 1.18;
}

h1 {
  max-width: 820px;
  font-size: 44px;
}

.lede {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  font-size: 18px;
}

.hero-actions,
.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 8px 13px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
}

.button.primary {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
}

@media (max-width: 760px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 18px;
  }

  main {
    padding: 24px 18px 44px;
  }

  h1 {
    font-size: 34px;
  }
}
```

- [ ] **Step 5: Write a smoke test for the shell**

Create `tests/render-smoke.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("HTML shell contains the application root and module entry", async () => {
  const html = await readFile("index.html", "utf8");
  assert.match(html, /<main id="app"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.match(html, /Great Powers and Rule-Making/);
});
```

- [ ] **Step 6: Run the smoke test**

Run: `node --test tests/render-smoke.test.mjs`

Expected: PASS, with one test file and one passing test.

- [ ] **Step 7: Commit**

Run:

```bash
git add package.json index.html src/main.js src/styles.css tests/render-smoke.test.mjs
git commit -m "Build static portal shell"
```

## Task 2: Structured Data Model

**Files:**
- Create: `src/data/schema.js`
- Create: `src/data/topics.js`
- Create: `src/data/actors.js`
- Create: `src/data/institutions.js`
- Test: `tests/data-model.test.mjs`

- [ ] **Step 1: Define schema constants**

Create `src/data/schema.js`:

```js
export const recordTypes = [
  "treaty-agreement",
  "institutional-document",
  "negotiation-record",
  "national-law-policy",
  "case-dispute-award",
  "official-statement",
  "research-report",
  "academic-article",
  "book-chapter"
];

export const languageStatuses = [
  "official-original",
  "official-english",
  "official-bilingual",
  "official-summary",
  "unofficial-translation",
  "english-only",
  "chinese-only",
  "site-summary"
];

export const sourceAuthorities = [
  "official-international-organization",
  "official-government",
  "official-regulator",
  "official-court-tribunal",
  "treaty-depository",
  "academic-publisher",
  "think-tank",
  "professional-commentary"
];
```

- [ ] **Step 2: Add topic taxonomy**

Create `src/data/topics.js` with all topic ids used by records:

```js
export const topics = [
  {
    id: "theories-rulemaking",
    title: "Theories of International Rule-Making",
    shortTitle: "Theories",
    summary: "Conceptual approaches to rule-making authority, institutional design, legalization, power, legitimacy, and regime complexity.",
    pilot: false,
    questions: [
      "How do international law and international relations explain rule creation?",
      "When do great powers create, reshape, or bypass international rules?",
      "How do legitimacy, consent, coercion, and expertise interact in rule-making?"
    ]
  },
  {
    id: "great-powers",
    title: "Great Powers and Rule-Making",
    shortTitle: "Great Powers",
    summary: "Comparative study of how leading powers use institutions, markets, domestic law, diplomacy, and standards to shape international economic rules.",
    pilot: false,
    questions: [
      "Which tools do great powers use to project regulatory preferences internationally?",
      "How do hegemonic, multipolar, and contested settings change rule-making strategies?"
    ]
  },
  {
    id: "united-states",
    title: "United States and International Rule-Making",
    shortTitle: "United States",
    summary: "US rule-making through trade agreements, financial regulation, sanctions, standards, development finance, and institutional leadership.",
    pilot: false,
    questions: [
      "How has the United States combined market power, legal design, and institutional leadership?",
      "When does US domestic law operate as a source of international rule pressure?"
    ]
  },
  {
    id: "european-union",
    title: "European Powers, the European Union, and International Rule-Making",
    shortTitle: "Europe and EU",
    summary: "European and EU rule-making through market access, regulatory power, treaty practice, institutional diplomacy, and external governance.",
    pilot: false,
    questions: [
      "How does the EU convert internal regulation into external rule-making influence?",
      "How do European powers use institutional and legal expertise in global rule formation?"
    ]
  },
  {
    id: "china",
    title: "China and International Rule-Making",
    shortTitle: "China",
    summary: "China's participation in, adaptation to, and shaping of rules in trade, investment, finance, digital governance, development, and standards.",
    pilot: false,
    questions: [
      "Where does China seek reform within existing institutions, and where does it build alternatives?",
      "How do Chinese domestic regulatory choices affect international rule-making?"
    ]
  },
  {
    id: "middle-small-powers",
    title: "Middle and Small Powers",
    shortTitle: "Middle and Small Powers",
    summary: "Coalition-building, norm entrepreneurship, forum selection, and technical leadership by middle and small powers.",
    pilot: false,
    questions: [
      "How do smaller states shape rules despite limited market or military power?",
      "Which issue areas reward coalition-building and technical expertise?"
    ]
  },
  {
    id: "wto-reform",
    title: "WTO Institutional Reform and Negotiations",
    shortTitle: "WTO Reform",
    summary: "Rule-making in WTO reform, negotiation architecture, dispute settlement, plurilateral initiatives, and development debates.",
    pilot: false,
    questions: [
      "How is WTO rule-making changing after the single-undertaking model?",
      "What are the legal and political implications of plurilateral negotiation tracks?"
    ]
  },
  {
    id: "digital-trade-ecommerce",
    title: "Digital Trade and E-Commerce",
    shortTitle: "Digital Trade",
    summary: "The deep pilot topic covering WTO e-commerce work, digital trade chapters, data flows, localization, paperless trade, platform rules, source code, and digital economy agreements.",
    pilot: true,
    questions: [
      "How do digital trade rules allocate regulatory space and market-access commitments?",
      "How do US, EU, Chinese, and middle-power approaches differ?",
      "Which institutions are becoming central venues for digital economic rule-making?"
    ]
  },
  {
    id: "cyber-data-governance",
    title: "Cyber Governance and Global Data Governance",
    shortTitle: "Cyber and Data",
    summary: "Cybersecurity, data governance, cross-border data regulation, privacy, security exceptions, and institutional fragmentation.",
    pilot: false,
    questions: [
      "How are data and cyber rules split across trade, security, human rights, and technical institutions?",
      "How do national security claims affect global economic rule-making?"
    ]
  },
  {
    id: "monetary-financial-regulation",
    title: "International Monetary System and Financial Regulation",
    shortTitle: "Money and Finance",
    summary: "Rule-making in monetary governance, financial stability, banking regulation, payment systems, sovereign debt, and development finance.",
    pilot: false,
    questions: [
      "How do monetary and financial rules reflect institutional expertise and power asymmetries?",
      "How do crises reshape rule-making authority?"
    ]
  },
  {
    id: "international-investment",
    title: "International Investment",
    shortTitle: "Investment",
    summary: "Investment treaties, dispute settlement reform, screening regimes, facilitation, sustainable investment, and state regulatory space.",
    pilot: false,
    questions: [
      "How are investment rules being rebalanced between protection, facilitation, and regulation?",
      "Which actors shape ISDS reform and investment facilitation?"
    ]
  },
  {
    id: "ai-governance",
    title: "Global AI Governance",
    shortTitle: "AI Governance",
    summary: "AI standards, safety governance, model regulation, compute controls, risk management, and institutional competition over AI rules.",
    pilot: false,
    questions: [
      "Which institutions are competing to define global AI governance rules?",
      "How do trade, security, standards, and human-rights frameworks interact?"
    ]
  }
];
```

- [ ] **Step 3: Add actor profiles**

Create `src/data/actors.js`:

```js
export const actors = [
  {
    id: "united-states",
    name: "United States",
    type: "great-power",
    summary: "Uses market scale, treaty design, domestic regulation, export controls, sanctions, standards, and institutional leadership to shape international economic rules.",
    topicIds: ["united-states", "digital-trade-ecommerce", "wto-reform", "monetary-financial-regulation", "ai-governance"]
  },
  {
    id: "european-union",
    name: "European Union",
    type: "great-power",
    summary: "Projects regulatory preferences through market access, internal legislation, adequacy and equivalence decisions, trade agreements, and institutional diplomacy.",
    topicIds: ["european-union", "digital-trade-ecommerce", "cyber-data-governance", "ai-governance", "international-investment"]
  },
  {
    id: "china",
    name: "China",
    type: "great-power",
    summary: "Combines participation in existing institutions with domestic regulatory development, standards activity, development initiatives, and alternative institutional projects.",
    topicIds: ["china", "digital-trade-ecommerce", "wto-reform", "international-investment", "monetary-financial-regulation"]
  },
  {
    id: "singapore",
    name: "Singapore",
    type: "middle-power",
    summary: "Acts as a digital economy rule entrepreneur through digital economy agreements, paperless trade initiatives, and coalition-building.",
    topicIds: ["middle-small-powers", "digital-trade-ecommerce", "cyber-data-governance"]
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    type: "middle-power",
    summary: "Uses coalition-building and digital economy agreements to influence rules beyond its market size.",
    topicIds: ["middle-small-powers", "digital-trade-ecommerce"]
  }
];
```

- [ ] **Step 4: Add institution profiles**

Create `src/data/institutions.js`:

```js
export const institutions = [
  {
    id: "wto",
    name: "World Trade Organization",
    shortName: "WTO",
    type: "international-organization",
    summary: "Central forum for multilateral trade rules, dispute settlement, ministerial decisions, and negotiation tracks including e-commerce.",
    topicIds: ["wto-reform", "digital-trade-ecommerce", "international-investment"]
  },
  {
    id: "oecd",
    name: "Organisation for Economic Co-operation and Development",
    shortName: "OECD",
    type: "international-organization",
    summary: "Produces policy standards, analytical reports, and soft-law instruments on digital economy, tax, AI, investment, and governance.",
    topicIds: ["digital-trade-ecommerce", "cyber-data-governance", "ai-governance", "international-investment"]
  },
  {
    id: "g20",
    name: "Group of Twenty",
    shortName: "G20",
    type: "forum",
    summary: "High-level forum where major economies coordinate financial, digital economy, development, and trade-governance agendas.",
    topicIds: ["monetary-financial-regulation", "digital-trade-ecommerce", "ai-governance"]
  },
  {
    id: "uncitral",
    name: "United Nations Commission on International Trade Law",
    shortName: "UNCITRAL",
    type: "international-organization",
    summary: "Develops model laws, conventions, and legal standards relevant to electronic commerce, paperless trade, and investment dispute settlement reform.",
    topicIds: ["digital-trade-ecommerce", "international-investment"]
  },
  {
    id: "imf",
    name: "International Monetary Fund",
    shortName: "IMF",
    type: "international-organization",
    summary: "Shapes monetary, financial stability, surveillance, capital-flow, and debt-governance rules and policy frameworks.",
    topicIds: ["monetary-financial-regulation"]
  },
  {
    id: "world-bank",
    name: "World Bank Group",
    shortName: "World Bank",
    type: "international-organization",
    summary: "Influences development finance, investment climate, digital development, and regulatory-capacity agendas.",
    topicIds: ["international-investment", "digital-trade-ecommerce", "monetary-financial-regulation"]
  }
];
```

- [ ] **Step 5: Add data-model tests for taxonomy**

Create `tests/data-model.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { recordTypes, languageStatuses, sourceAuthorities } from "../src/data/schema.js";
import { topics } from "../src/data/topics.js";
import { actors } from "../src/data/actors.js";
import { institutions } from "../src/data/institutions.js";

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, `${label} ids must be unique`);
}

test("schema lists allowed categories", () => {
  assert.ok(recordTypes.includes("negotiation-record"));
  assert.ok(languageStatuses.includes("official-bilingual"));
  assert.ok(sourceAuthorities.includes("official-international-organization"));
});

test("topics, actors, and institutions use stable unique ids", () => {
  assertUniqueIds(topics, "topic");
  assertUniqueIds(actors, "actor");
  assertUniqueIds(institutions, "institution");
  assert.ok(topics.some((topic) => topic.id === "digital-trade-ecommerce" && topic.pilot));
});

test("actor and institution topic references resolve", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  for (const actor of actors) {
    for (const topicId of actor.topicIds) assert.ok(topicIds.has(topicId), `${actor.id} references ${topicId}`);
  }
  for (const institution of institutions) {
    for (const topicId of institution.topicIds) assert.ok(topicIds.has(topicId), `${institution.id} references ${topicId}`);
  }
});
```

- [ ] **Step 6: Run the data-model tests**

Run: `node --test tests/data-model.test.mjs`

Expected: PASS, with three passing tests.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/data/schema.js src/data/topics.js src/data/actors.js src/data/institutions.js tests/data-model.test.mjs
git commit -m "Add structured portal taxonomy"
```

## Task 3: Seed Corpus and Timeline

**Files:**
- Create: `src/data/records.js`
- Create: `src/data/timeline.js`
- Modify: `tests/data-model.test.mjs`

- [ ] **Step 1: Add seed records**

Create `src/data/records.js` with a balanced first corpus. Use source URLs only after checking that each official URL opens.

```js
export const records = [
  {
    id: "wto-work-programme-electronic-commerce-1998",
    title: "Work Programme on Electronic Commerce",
    alternateTitle: "",
    recordType: "institutional-document",
    date: "1998-09-25",
    year: 1998,
    actors: [],
    jurisdictions: ["multilateral"],
    institutions: ["wto"],
    topics: ["digital-trade-ecommerce", "wto-reform"],
    summary: "WTO General Council work programme establishing examination of trade-related issues arising from global electronic commerce.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "WTO document WT/L/274", url: "https://docs.wto.org/" }
    ],
    citation: "World Trade Organization, Work Programme on Electronic Commerce, WT/L/274, 25 September 1998.",
    relatedRecordIds: [],
    tags: ["wto", "e-commerce", "work-programme"]
  },
  {
    id: "wto-joint-statement-electronic-commerce-2019",
    title: "Joint Statement on Electronic Commerce",
    alternateTitle: "",
    recordType: "negotiation-record",
    date: "2019-01-25",
    year: 2019,
    actors: ["united-states", "european-union", "china", "singapore"],
    jurisdictions: ["multilateral"],
    institutions: ["wto"],
    topics: ["digital-trade-ecommerce", "wto-reform"],
    summary: "Launch statement for WTO members seeking to begin negotiations on trade-related aspects of electronic commerce.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "WTO document WT/L/1056", url: "https://docs.wto.org/" }
    ],
    citation: "World Trade Organization, Joint Statement on Electronic Commerce, WT/L/1056, 25 January 2019.",
    relatedRecordIds: ["wto-work-programme-electronic-commerce-1998"],
    tags: ["wto", "jsi", "negotiation"]
  },
  {
    id: "depa-agreement-2020",
    title: "Digital Economy Partnership Agreement",
    alternateTitle: "DEPA",
    recordType: "treaty-agreement",
    date: "2020-06-12",
    year: 2020,
    actors: ["singapore", "new-zealand"],
    jurisdictions: ["Chile", "New Zealand", "Singapore"],
    institutions: [],
    topics: ["digital-trade-ecommerce", "middle-small-powers"],
    summary: "Modular digital economy agreement covering digital trade facilitation, data issues, business and consumer trust, and emerging technology cooperation.",
    sourceAuthority: "official-government",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "Official DEPA text", url: "https://www.mfat.govt.nz/" }
    ],
    citation: "Digital Economy Partnership Agreement, signed 12 June 2020.",
    relatedRecordIds: [],
    tags: ["digital-economy-agreement", "paperless-trade", "data"]
  },
  {
    id: "usmca-digital-trade-chapter-2020",
    title: "USMCA Chapter 19: Digital Trade",
    alternateTitle: "",
    recordType: "treaty-agreement",
    date: "2020-07-01",
    year: 2020,
    actors: ["united-states"],
    jurisdictions: ["United States", "Mexico", "Canada"],
    institutions: [],
    topics: ["digital-trade-ecommerce", "united-states"],
    summary: "Digital trade chapter addressing customs duties, cross-border data transfer, data localization, source code, electronic authentication, and consumer protection.",
    sourceAuthority: "official-government",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "USTR USMCA agreement text", url: "https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement/agreement-between" }
    ],
    citation: "Agreement between the United States of America, the United Mexican States, and Canada, Chapter 19, entered into force 1 July 2020.",
    relatedRecordIds: [],
    tags: ["usmca", "data-flows", "source-code"]
  },
  {
    id: "eu-digital-services-act-2022",
    title: "Digital Services Act",
    alternateTitle: "Regulation (EU) 2022/2065",
    recordType: "national-law-policy",
    date: "2022-10-19",
    year: 2022,
    actors: ["european-union"],
    jurisdictions: ["European Union"],
    institutions: [],
    topics: ["digital-trade-ecommerce", "cyber-data-governance", "european-union"],
    summary: "EU platform-governance regulation with international effects through compliance obligations for intermediary services and very large online platforms.",
    sourceAuthority: "official-government",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "EUR-Lex official text", url: "https://eur-lex.europa.eu/eli/reg/2022/2065/oj" }
    ],
    citation: "Regulation (EU) 2022/2065, Official Journal of the European Union, 27 October 2022.",
    relatedRecordIds: [],
    tags: ["platform-regulation", "eu", "digital-services"]
  },
  {
    id: "china-data-security-law-2021",
    title: "Data Security Law of the People's Republic of China",
    alternateTitle: "",
    recordType: "national-law-policy",
    date: "2021-06-10",
    year: 2021,
    actors: ["china"],
    jurisdictions: ["China"],
    institutions: [],
    topics: ["digital-trade-ecommerce", "cyber-data-governance", "china"],
    summary: "Chinese data-governance legislation relevant to security review, data classification, cross-border data issues, and international digital economy rule-making.",
    sourceAuthority: "official-government",
    languageStatus: "official-original",
    sourceLinks: [
      { label: "Official Chinese text", url: "https://www.npc.gov.cn/" }
    ],
    citation: "Data Security Law of the People's Republic of China, adopted 10 June 2021.",
    relatedRecordIds: [],
    tags: ["china", "data-security", "cross-border-data"]
  },
  {
    id: "uncitral-model-law-electronic-transferable-records-2017",
    title: "UNCITRAL Model Law on Electronic Transferable Records",
    alternateTitle: "MLETR",
    recordType: "institutional-document",
    date: "2017-07-13",
    year: 2017,
    actors: [],
    jurisdictions: ["multilateral"],
    institutions: ["uncitral"],
    topics: ["digital-trade-ecommerce"],
    summary: "Model law enabling legal recognition of electronic transferable records, central to paperless trade and digital trade facilitation.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "UNCITRAL MLETR page", url: "https://uncitral.un.org/en/MLETR" }
    ],
    citation: "UNCITRAL Model Law on Electronic Transferable Records, 2017.",
    relatedRecordIds: [],
    tags: ["paperless-trade", "model-law", "electronic-records"]
  },
  {
    id: "oecd-digital-trade-inventory-2023",
    title: "OECD Digital Trade Inventory",
    alternateTitle: "",
    recordType: "research-report",
    date: "2023-01-01",
    year: 2023,
    actors: [],
    jurisdictions: ["comparative"],
    institutions: ["oecd"],
    topics: ["digital-trade-ecommerce"],
    summary: "OECD inventory and analytical work mapping digital trade provisions and policy issues across agreements and jurisdictions.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "OECD digital trade materials", url: "https://www.oecd.org/trade/topics/digital-trade/" }
    ],
    citation: "OECD, digital trade policy materials and inventory resources.",
    relatedRecordIds: [],
    tags: ["oecd", "digital-trade", "mapping"]
  },
  {
    id: "uncitral-isds-working-group-iii",
    title: "UNCITRAL Working Group III: Investor-State Dispute Settlement Reform",
    alternateTitle: "",
    recordType: "institutional-document",
    date: "2017-07-10",
    year: 2017,
    actors: [],
    jurisdictions: ["multilateral"],
    institutions: ["uncitral"],
    topics: ["international-investment"],
    summary: "Multilateral process for considering reform of investor-state dispute settlement and related investment-law rule-making.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "UNCITRAL Working Group III", url: "https://uncitral.un.org/en/working_groups/3/investor-state" }
    ],
    citation: "UNCITRAL Working Group III, Investor-State Dispute Settlement Reform materials.",
    relatedRecordIds: [],
    tags: ["investment", "isds", "reform"]
  },
  {
    id: "imf-institutional-view-capital-flows-2012",
    title: "The Liberalization and Management of Capital Flows: An Institutional View",
    alternateTitle: "",
    recordType: "institutional-document",
    date: "2012-11-14",
    year: 2012,
    actors: [],
    jurisdictions: ["multilateral"],
    institutions: ["imf"],
    topics: ["monetary-financial-regulation"],
    summary: "IMF institutional view on capital-flow liberalization and management, illustrating soft-law rule-making in monetary and financial governance.",
    sourceAuthority: "official-international-organization",
    languageStatus: "official-english",
    sourceLinks: [
      { label: "IMF institutional view", url: "https://www.imf.org/" }
    ],
    citation: "International Monetary Fund, The Liberalization and Management of Capital Flows: An Institutional View, 14 November 2012.",
    relatedRecordIds: [],
    tags: ["imf", "capital-flows", "financial-governance"]
  }
];
```

- [ ] **Step 2: Add pilot timeline entries**

Create `src/data/timeline.js`:

```js
export const timeline = [
  {
    date: "1998-09-25",
    title: "WTO establishes Work Programme on Electronic Commerce",
    tag: "WTO",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["wto-work-programme-electronic-commerce-1998"]
  },
  {
    date: "2017-07-13",
    title: "UNCITRAL adopts Model Law on Electronic Transferable Records",
    tag: "Paperless trade",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["uncitral-model-law-electronic-transferable-records-2017"]
  },
  {
    date: "2019-01-25",
    title: "WTO members issue Joint Statement on Electronic Commerce",
    tag: "Negotiation",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["wto-joint-statement-electronic-commerce-2019"]
  },
  {
    date: "2020-06-12",
    title: "Digital Economy Partnership Agreement signed",
    tag: "Digital economy agreement",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["depa-agreement-2020"]
  },
  {
    date: "2020-07-01",
    title: "USMCA enters into force with a dedicated digital trade chapter",
    tag: "FTA",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["usmca-digital-trade-chapter-2020"]
  },
  {
    date: "2022-10-19",
    title: "European Union adopts the Digital Services Act",
    tag: "Platform regulation",
    topicId: "digital-trade-ecommerce",
    relatedIds: ["eu-digital-services-act-2022"]
  }
];
```

- [ ] **Step 3: Extend tests for record integrity**

Append to `tests/data-model.test.mjs`:

```js
import { records } from "../src/data/records.js";
import { timeline } from "../src/data/timeline.js";

test("records use valid schema values and resolved references", () => {
  assertUniqueIds(records, "record");
  const topicIds = new Set(topics.map((topic) => topic.id));
  const actorIds = new Set(actors.map((actor) => actor.id));
  const institutionIds = new Set(institutions.map((institution) => institution.id));
  const recordIds = new Set(records.map((record) => record.id));

  for (const record of records) {
    assert.ok(recordTypes.includes(record.recordType), `${record.id} has valid recordType`);
    assert.ok(languageStatuses.includes(record.languageStatus), `${record.id} has valid languageStatus`);
    assert.ok(sourceAuthorities.includes(record.sourceAuthority), `${record.id} has valid sourceAuthority`);
    assert.ok(record.title.length > 5, `${record.id} has a title`);
    assert.ok(record.summary.length > 30, `${record.id} has a useful summary`);
    assert.ok(record.sourceLinks.length > 0, `${record.id} has at least one source link`);
    for (const topicId of record.topics) assert.ok(topicIds.has(topicId), `${record.id} references topic ${topicId}`);
    for (const actorId of record.actors) assert.ok(actorIds.has(actorId), `${record.id} references actor ${actorId}`);
    for (const institutionId of record.institutions) assert.ok(institutionIds.has(institutionId), `${record.id} references institution ${institutionId}`);
    for (const relatedId of record.relatedRecordIds) assert.ok(recordIds.has(relatedId), `${record.id} references record ${relatedId}`);
  }
});

test("digital trade pilot has visibly deeper seed coverage", () => {
  const pilotRecords = records.filter((record) => record.topics.includes("digital-trade-ecommerce"));
  assert.ok(pilotRecords.length >= 7, "digital trade pilot has at least seven records");
  assert.ok(records.some((record) => record.topics.includes("international-investment")));
  assert.ok(records.some((record) => record.topics.includes("monetary-financial-regulation")));
});

test("timeline entries resolve to records and topics", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  const recordIds = new Set(records.map((record) => record.id));
  for (const entry of timeline) {
    assert.ok(topicIds.has(entry.topicId), `${entry.title} references topic ${entry.topicId}`);
    for (const relatedId of entry.relatedIds) assert.ok(recordIds.has(relatedId), `${entry.title} references record ${relatedId}`);
  }
});
```

- [ ] **Step 4: Run data tests**

Run: `node --test tests/data-model.test.mjs`

Expected: PASS, with taxonomy tests and record-integrity tests passing.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/records.js src/data/timeline.js tests/data-model.test.mjs
git commit -m "Seed rulemaking database records"
```

## Task 4: Search, Formatting, and Shared Rendering Helpers

**Files:**
- Create: `src/lib/format.js`
- Create: `src/lib/search.js`
- Modify: `tests/data-model.test.mjs`

- [ ] **Step 1: Add formatting helpers**

Create `src/lib/format.js`:

```js
export function humanizeId(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export function recordTypeLabel(value) {
  const labels = {
    "treaty-agreement": "Treaty / agreement",
    "institutional-document": "Institutional document",
    "negotiation-record": "Negotiation record",
    "national-law-policy": "National law / policy",
    "case-dispute-award": "Case / dispute / award",
    "official-statement": "Official statement",
    "research-report": "Research report",
    "academic-article": "Academic article",
    "book-chapter": "Book / chapter"
  };
  return labels[value] ?? humanizeId(value);
}

export function authorityLabel(value) {
  const labels = {
    "official-international-organization": "Official international organization",
    "official-government": "Official government",
    "official-regulator": "Official regulator",
    "official-court-tribunal": "Official court or tribunal",
    "treaty-depository": "Treaty depository",
    "academic-publisher": "Academic publisher",
    "think-tank": "Think tank",
    "professional-commentary": "Professional commentary"
  };
  return labels[value] ?? humanizeId(value);
}
```

- [ ] **Step 2: Add search helpers**

Create `src/lib/search.js`:

```js
function normalize(value) {
  return String(value ?? "").toLowerCase().trim();
}

export function recordSearchText(record) {
  return normalize([
    record.title,
    record.alternateTitle,
    record.summary,
    record.recordType,
    record.sourceAuthority,
    record.languageStatus,
    record.year,
    ...record.actors,
    ...record.jurisdictions,
    ...record.institutions,
    ...record.topics,
    ...record.tags
  ].join(" "));
}

export function filterRecords(records, filters = {}) {
  const query = normalize(filters.query);
  return records.filter((record) => {
    if (query && !recordSearchText(record).includes(query)) return false;
    if (filters.recordType && record.recordType !== filters.recordType) return false;
    if (filters.topic && !record.topics.includes(filters.topic)) return false;
    if (filters.actor && !record.actors.includes(filters.actor)) return false;
    if (filters.institution && !record.institutions.includes(filters.institution)) return false;
    if (filters.languageStatus && record.languageStatus !== filters.languageStatus) return false;
    if (filters.sourceAuthority && record.sourceAuthority !== filters.sourceAuthority) return false;
    return true;
  });
}

export function sortRecordsNewestFirst(records) {
  return [...records].sort((a, b) => String(b.date || b.year).localeCompare(String(a.date || a.year)));
}
```

- [ ] **Step 3: Add helper tests**

Append to `tests/data-model.test.mjs`:

```js
import { filterRecords } from "../src/lib/search.js";
import { formatDate, recordTypeLabel } from "../src/lib/format.js";

test("search filters records by query and facets", () => {
  assert.ok(filterRecords(records, { query: "source code" }).some((record) => record.id === "usmca-digital-trade-chapter-2020"));
  assert.ok(filterRecords(records, { topic: "international-investment" }).every((record) => record.topics.includes("international-investment")));
  assert.ok(filterRecords(records, { actor: "china" }).every((record) => record.actors.includes("china")));
});

test("format helpers render stable labels", () => {
  assert.equal(recordTypeLabel("negotiation-record"), "Negotiation record");
  assert.equal(formatDate("2020-06-12"), "Jun 12, 2020");
});
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/data-model.test.mjs`

Expected: PASS, including search and formatting tests.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/format.js src/lib/search.js tests/data-model.test.mjs
git commit -m "Add portal search helpers"
```

## Task 5: Portal Views and Routing

**Files:**
- Create: `src/views/home.js`
- Create: `src/views/topics.js`
- Create: `src/views/database.js`
- Create: `src/views/actors.js`
- Create: `src/views/institutions.js`
- Create: `src/views/sources.js`
- Modify: `src/main.js`
- Modify: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Create the homepage view**

Create `src/views/home.js`:

```js
import { topics } from "../data/topics.js";
import { records } from "../data/records.js";
import { timeline } from "../data/timeline.js";
import { sortRecordsNewestFirst } from "../lib/search.js";

export function renderHome() {
  const pilot = topics.find((topic) => topic.id === "digital-trade-ecommerce");
  const latest = sortRecordsNewestFirst(records).slice(0, 4);
  return `
    <section class="page-hero">
      <p class="eyebrow">International economic governance</p>
      <h1>Great Powers and Rule-Making</h1>
      <p class="lede">A research portal and database on international rule-making, great powers, institutions, and issue-specific governance regimes.</p>
      <form class="global-search" data-global-search>
        <label for="home-search">Search the database</label>
        <div class="search-row">
          <input id="home-search" name="query" type="search" aria-label="Search digital trade, WTO, China, source code, data flows">
          <button type="submit">Search</button>
        </div>
      </form>
    </section>
    <section class="grid two-columns section-block">
      <article class="feature-panel">
        <p class="eyebrow">Deep pilot</p>
        <h2>${pilot.title}</h2>
        <p>${pilot.summary}</p>
        <a class="button primary" href="#/topics/${pilot.id}">Open pilot topic</a>
      </article>
      <article class="panel">
        <h2>Recent Records</h2>
        <div class="compact-list">
          ${latest.map((record) => `<a href="#/records/${record.id}"><strong>${record.title}</strong><span>${record.year} · ${record.recordType}</span></a>`).join("")}
        </div>
      </article>
    </section>
    <section class="section-block">
      <div class="section-heading">
        <h2>Topic Atlas</h2>
        <a href="#/topics">All topics</a>
      </div>
      <div class="card-grid">
        ${topics.map((topic) => `<a class="topic-card" href="#/topics/${topic.id}"><span>${topic.shortTitle}</span><strong>${topic.title}</strong><p>${topic.summary}</p></a>`).join("")}
      </div>
    </section>
    <section class="section-block">
      <div class="section-heading">
        <h2>Digital Trade Timeline</h2>
        <a href="#/topics/digital-trade-ecommerce">Pilot page</a>
      </div>
      <ol class="timeline-list">
        ${timeline.slice(0, 4).map((entry) => `<li><time>${entry.date}</time><strong>${entry.title}</strong><span>${entry.tag}</span></li>`).join("")}
      </ol>
    </section>
  `;
}
```

- [ ] **Step 2: Create topic views**

Create `src/views/topics.js`:

```js
import { topics } from "../data/topics.js";
import { records } from "../data/records.js";
import { timeline } from "../data/timeline.js";
import { recordTypeLabel } from "../lib/format.js";

export function renderTopics() {
  return `
    <section class="page-title">
      <p class="eyebrow">Topic atlas</p>
      <h1>Research Topics</h1>
      <p class="lede">Browse rule-making questions by theory, actor, institution, and issue area.</p>
    </section>
    <div class="card-grid">
      ${topics.map((topic) => `<a class="topic-card" href="#/topics/${topic.id}"><span>${topic.pilot ? "Deep pilot" : "Atlas topic"}</span><strong>${topic.title}</strong><p>${topic.summary}</p></a>`).join("")}
    </div>
  `;
}

export function renderTopicDetail(topicId) {
  const topic = topics.find((item) => item.id === topicId);
  if (!topic) return `<section class="page-title"><h1>Topic not found</h1><p class="lede">The requested topic does not exist.</p></section>`;
  const topicRecords = records.filter((record) => record.topics.includes(topic.id));
  const topicTimeline = timeline.filter((entry) => entry.topicId === topic.id);
  return `
    <section class="page-title">
      <p class="eyebrow">${topic.pilot ? "Deep pilot" : "Topic"}</p>
      <h1>${topic.title}</h1>
      <p class="lede">${topic.summary}</p>
    </section>
    <section class="grid two-columns section-block">
      <article class="panel">
        <h2>Research Questions</h2>
        <ul class="clean-list">${topic.questions.map((question) => `<li>${question}</li>`).join("")}</ul>
      </article>
      <article class="panel">
        <h2>Linked Records</h2>
        <p>${topicRecords.length} records currently linked to this topic.</p>
        <a class="button" href="#/database?topic=${topic.id}">Filter database</a>
      </article>
    </section>
    ${topicTimeline.length ? `<section class="section-block"><h2>Timeline</h2><ol class="timeline-list">${topicTimeline.map((entry) => `<li><time>${entry.date}</time><strong>${entry.title}</strong><span>${entry.tag}</span></li>`).join("")}</ol></section>` : ""}
    <section class="section-block">
      <h2>Records</h2>
      <div class="record-list">
        ${topicRecords.map((record) => `<a class="record-row" href="#/records/${record.id}"><span>${record.year}</span><strong>${record.title}</strong><em>${recordTypeLabel(record.recordType)}</em><p>${record.summary}</p></a>`).join("")}
      </div>
    </section>
  `;
}
```

- [ ] **Step 3: Create database views**

Create `src/views/database.js`:

```js
import { actors } from "../data/actors.js";
import { institutions } from "../data/institutions.js";
import { records } from "../data/records.js";
import { recordTypes, languageStatuses, sourceAuthorities } from "../data/schema.js";
import { topics } from "../data/topics.js";
import { authorityLabel, formatDate, recordTypeLabel } from "../lib/format.js";
import { filterRecords, sortRecordsNewestFirst } from "../lib/search.js";

function options(items, selected = "") {
  return items.map((item) => {
    const id = typeof item === "string" ? item : item.id;
    const label = typeof item === "string" ? recordTypeLabel(item) : item.shortTitle || item.name || item.title;
    return `<option value="${id}" ${selected === id ? "selected" : ""}>${label}</option>`;
  }).join("");
}

function paramsFromHash() {
  const queryIndex = location.hash.indexOf("?");
  return new URLSearchParams(queryIndex >= 0 ? location.hash.slice(queryIndex + 1) : "");
}

export function renderDatabase() {
  const params = paramsFromHash();
  const filters = {
    query: params.get("q") || "",
    topic: params.get("topic") || "",
    actor: params.get("actor") || "",
    institution: params.get("institution") || "",
    recordType: params.get("recordType") || "",
    languageStatus: params.get("languageStatus") || "",
    sourceAuthority: params.get("sourceAuthority") || ""
  };
  const results = sortRecordsNewestFirst(filterRecords(records, filters));
  return `
    <section class="page-title">
      <p class="eyebrow">Database</p>
      <h1>Rule-Making Records</h1>
      <p class="lede">Search and filter treaties, institutional documents, negotiation records, laws, policies, reports, and scholarship.</p>
    </section>
    <form class="filters" data-filter-form>
      <label>Search<input name="q" type="search" value="${filters.query}" aria-label="Search title, summary, tag, actor, institution"></label>
      <label>Topic<select name="topic"><option value="">All topics</option>${options(topics, filters.topic)}</select></label>
      <label>Actor<select name="actor"><option value="">All actors</option>${options(actors, filters.actor)}</select></label>
      <label>Institution<select name="institution"><option value="">All institutions</option>${options(institutions, filters.institution)}</select></label>
      <label>Type<select name="recordType"><option value="">All types</option>${options(recordTypes, filters.recordType)}</select></label>
      <label>Language<select name="languageStatus"><option value="">All language statuses</option>${languageStatuses.map((status) => `<option value="${status}" ${filters.languageStatus === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
      <label>Authority<select name="sourceAuthority"><option value="">All source authorities</option>${sourceAuthorities.map((status) => `<option value="${status}" ${filters.sourceAuthority === status ? "selected" : ""}>${authorityLabel(status)}</option>`).join("")}</select></label>
      <button type="submit">Apply filters</button>
    </form>
    <section class="section-block">
      <div class="section-heading"><h2>${results.length} Records</h2><a href="#/database">Clear filters</a></div>
      <div class="record-list">
        ${results.map((record) => `<a class="record-row" href="#/records/${record.id}"><span>${record.year}</span><strong>${record.title}</strong><em>${recordTypeLabel(record.recordType)}</em><p>${record.summary}</p></a>`).join("")}
      </div>
    </section>
  `;
}

export function renderRecordDetail(recordId) {
  const record = records.find((item) => item.id === recordId);
  if (!record) return `<section class="page-title"><h1>Record not found</h1><p class="lede">The requested record does not exist.</p></section>`;
  return `
    <section class="page-title">
      <p class="eyebrow">${recordTypeLabel(record.recordType)}</p>
      <h1>${record.title}</h1>
      <p class="lede">${record.summary}</p>
    </section>
    <section class="grid two-columns section-block">
      <article class="panel">
        <h2>Metadata</h2>
        <dl class="meta-list">
          <dt>Date</dt><dd>${formatDate(record.date) || record.year}</dd>
          <dt>Source authority</dt><dd>${authorityLabel(record.sourceAuthority)}</dd>
          <dt>Language status</dt><dd>${record.languageStatus}</dd>
          <dt>Topics</dt><dd>${record.topics.map((topicId) => `<a href="#/topics/${topicId}">${topicId}</a>`).join(", ")}</dd>
        </dl>
      </article>
      <article class="panel">
        <h2>Sources</h2>
        <ul class="clean-list">${record.sourceLinks.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`).join("")}</ul>
      </article>
    </section>
    <section class="section-block panel">
      <h2>Citation</h2>
      <p>${record.citation}</p>
    </section>
  `;
}
```

- [ ] **Step 4: Create actor, institution, and sources views**

Create `src/views/actors.js`, `src/views/institutions.js`, and `src/views/sources.js`:

```js
// src/views/actors.js
import { actors } from "../data/actors.js";
import { records } from "../data/records.js";

export function renderActors() {
  return `<section class="page-title"><p class="eyebrow">Actors</p><h1>Rule-Making Actors</h1><p class="lede">Compare great-power, middle-power, and small-power strategies.</p></section><div class="card-grid">${actors.map((actor) => `<a class="topic-card" href="#/actors/${actor.id}"><span>${actor.type}</span><strong>${actor.name}</strong><p>${actor.summary}</p></a>`).join("")}</div>`;
}

export function renderActorDetail(actorId) {
  const actor = actors.find((item) => item.id === actorId);
  if (!actor) return `<section class="page-title"><h1>Actor not found</h1></section>`;
  const linked = records.filter((record) => record.actors.includes(actor.id));
  return `<section class="page-title"><p class="eyebrow">${actor.type}</p><h1>${actor.name}</h1><p class="lede">${actor.summary}</p></section><section class="section-block"><h2>Linked Records</h2><div class="record-list">${linked.map((record) => `<a class="record-row" href="#/records/${record.id}"><span>${record.year}</span><strong>${record.title}</strong><p>${record.summary}</p></a>`).join("")}</div></section>`;
}
```

```js
// src/views/institutions.js
import { institutions } from "../data/institutions.js";
import { records } from "../data/records.js";

export function renderInstitutions() {
  return `<section class="page-title"><p class="eyebrow">Institutions</p><h1>Rule-Making Venues</h1><p class="lede">Browse international organizations, forums, and negotiation venues.</p></section><div class="card-grid">${institutions.map((institution) => `<a class="topic-card" href="#/institutions/${institution.id}"><span>${institution.type}</span><strong>${institution.name}</strong><p>${institution.summary}</p></a>`).join("")}</div>`;
}

export function renderInstitutionDetail(institutionId) {
  const institution = institutions.find((item) => item.id === institutionId);
  if (!institution) return `<section class="page-title"><h1>Institution not found</h1></section>`;
  const linked = records.filter((record) => record.institutions.includes(institution.id));
  return `<section class="page-title"><p class="eyebrow">${institution.type}</p><h1>${institution.name}</h1><p class="lede">${institution.summary}</p></section><section class="section-block"><h2>Linked Records</h2><div class="record-list">${linked.map((record) => `<a class="record-row" href="#/records/${record.id}"><span>${record.year}</span><strong>${record.title}</strong><p>${record.summary}</p></a>`).join("")}</div></section>`;
}
```

```js
// src/views/sources.js
export function renderSourcesMethod() {
  return `
    <section class="page-title">
      <p class="eyebrow">Sources and method</p>
      <h1>Source Policy</h1>
      <p class="lede">The portal prioritizes official and institutionally authoritative materials, while treating scholarship through metadata, summaries, and citation links unless fuller reuse is clearly permitted.</p>
    </section>
    <section class="grid two-columns section-block">
      <article class="panel"><h2>Source hierarchy</h2><ol><li>Official issuing body text</li><li>Official English text or official explanation</li><li>Treaty depository or institutional document system</li><li>High-quality secondary translation or summary</li><li>Research literature metadata and citation</li></ol></article>
      <article class="panel"><h2>Language status</h2><p>Every record labels whether the source is official original, official English, official bilingual, unofficial translation, English-only, Chinese-only, or a site-created summary.</p></article>
    </section>
  `;
}
```

- [ ] **Step 5: Wire routes and forms**

Replace `src/main.js` with:

```js
import { renderActors, renderActorDetail } from "./views/actors.js";
import { renderDatabase, renderRecordDetail } from "./views/database.js";
import { renderHome } from "./views/home.js";
import { renderInstitutions, renderInstitutionDetail } from "./views/institutions.js";
import { renderSourcesMethod } from "./views/sources.js";
import { renderTopicDetail, renderTopics } from "./views/topics.js";

const app = document.querySelector("#app");

function pathParts() {
  const hash = location.hash || "#/";
  return hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean);
}

function renderRoute() {
  const [section, id] = pathParts();
  if (!section) app.innerHTML = renderHome();
  else if (section === "topics" && id) app.innerHTML = renderTopicDetail(id);
  else if (section === "topics") app.innerHTML = renderTopics();
  else if (section === "database") app.innerHTML = renderDatabase();
  else if (section === "records") app.innerHTML = renderRecordDetail(id);
  else if (section === "actors" && id) app.innerHTML = renderActorDetail(id);
  else if (section === "actors") app.innerHTML = renderActors();
  else if (section === "institutions" && id) app.innerHTML = renderInstitutionDetail(id);
  else if (section === "institutions") app.innerHTML = renderInstitutions();
  else if (section === "sources-method") app.innerHTML = renderSourcesMethod();
  else app.innerHTML = `<section class="page-title"><h1>Page not found</h1><p class="lede">Use the navigation to return to the portal.</p></section>`;
  bindForms();
  app.focus();
}

function bindForms() {
  document.querySelector("[data-global-search]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = encodeURIComponent(data.get("query") || "");
    location.hash = `#/database?q=${query}`;
  });
  document.querySelector("[data-filter-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (value) params.set(key, value);
    }
    location.hash = `#/database${params.toString() ? `?${params}` : ""}`;
  });
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
```

- [ ] **Step 6: Extend render smoke test for route imports**

Append to `tests/render-smoke.test.mjs`:

```js
test("view modules export route renderers", async () => {
  const home = await import("../src/views/home.js");
  const topics = await import("../src/views/topics.js");
  const database = await import("../src/views/database.js");
  assert.match(home.renderHome(), /Digital Trade/);
  assert.match(topics.renderTopics(), /Research Topics/);
  assert.match(database.renderDatabase(), /Rule-Making Records/);
});
```

- [ ] **Step 7: Run tests**

Run: `node --test tests/*.test.mjs`

Expected: PASS across data-model and render-smoke tests.

- [ ] **Step 8: Commit**

Run:

```bash
git add src/main.js src/views tests/render-smoke.test.mjs
git commit -m "Render portal topic and database views"
```

## Task 6: Complete Scholarly Interface Styling

**Files:**
- Modify: `src/styles.css`
- Test: `tests/render-smoke.test.mjs`

- [ ] **Step 1: Add layout styles for database components**

Append to `src/styles.css`:

```css
.page-title {
  display: grid;
  gap: 14px;
  padding: 34px 0 26px;
  border-bottom: 1px solid var(--line);
}

.section-block {
  margin-top: 30px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.grid {
  display: grid;
  gap: 18px;
}

.two-columns {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.panel,
.feature-panel,
.topic-card,
.record-row {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.panel,
.feature-panel {
  padding: 20px;
}

.feature-panel {
  border-top: 4px solid var(--accent);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
}

.topic-card {
  display: grid;
  gap: 9px;
  min-height: 190px;
  padding: 18px;
  color: var(--ink);
  text-decoration: none;
}

.topic-card span,
.record-row em {
  color: var(--rule);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  text-transform: uppercase;
}

.topic-card p,
.record-row p,
.compact-list span {
  margin: 0;
  color: var(--muted);
}

.record-list,
.compact-list {
  display: grid;
  gap: 10px;
}

.record-row,
.compact-list a {
  display: grid;
  gap: 5px;
  padding: 14px;
  color: var(--ink);
  text-decoration: none;
}

.record-row {
  grid-template-columns: 70px minmax(0, 1fr) 170px;
  align-items: start;
}

.record-row p {
  grid-column: 2 / -1;
}

.filters,
.global-search {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.filters {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
}

label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

input,
select,
button {
  width: 100%;
  min-height: 40px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: white;
  color: var(--ink);
  font: inherit;
}

input,
select {
  padding: 8px 10px;
}

button {
  align-self: end;
  padding: 8px 12px;
  background: var(--accent);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  gap: 10px;
}

.clean-list,
.timeline-list {
  margin: 0;
  padding-left: 20px;
}

.timeline-list {
  display: grid;
  gap: 10px;
}

.timeline-list li {
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.timeline-list time {
  display: inline-block;
  min-width: 110px;
  color: var(--muted);
  font-size: 14px;
}

.timeline-list span {
  margin-left: 8px;
  color: var(--rule);
  font-size: 13px;
  font-weight: 700;
}

.meta-list {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 8px 14px;
  margin: 0;
}

.meta-list dt {
  color: var(--muted);
  font-weight: 700;
}

.meta-list dd {
  margin: 0;
}

@media (max-width: 760px) {
  .two-columns,
  .search-row,
  .record-row,
  .meta-list {
    grid-template-columns: 1fr;
  }

  .record-row p {
    grid-column: auto;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 2: Add a render assertion for key UI class names**

Append to `tests/render-smoke.test.mjs`:

```js
test("stylesheet defines database interface classes", async () => {
  const css = await readFile("src/styles.css", "utf8");
  assert.match(css, /\.filters/);
  assert.match(css, /\.record-row/);
  assert.match(css, /\.timeline-list/);
});
```

- [ ] **Step 3: Run tests**

Run: `node --test tests/*.test.mjs`

Expected: PASS.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/styles.css tests/render-smoke.test.mjs
git commit -m "Style scholarly research portal"
```

## Task 7: Local Preview and Browser Verification

**Files:**
- Modify: `tests/render-smoke.test.mjs`
- No source files should change unless verification exposes a defect.

- [ ] **Step 1: Add static asset integrity checks**

Append to `tests/render-smoke.test.mjs`:

```js
test("static asset paths are relative for GitHub Pages", async () => {
  const html = await readFile("index.html", "utf8");
  assert.match(html, /href="\.\/src\/styles\.css"/);
  assert.match(html, /src="\.\/src\/main\.js"/);
});
```

- [ ] **Step 2: Run full tests**

Run: `node --test tests/*.test.mjs`

Expected: PASS.

- [ ] **Step 3: Start local preview**

Run one of these commands:

```bash
npm run serve -- --listen 127.0.0.1:4173
```

If `npm` is not available on PATH, run a local server through the bundled Node runtime or use PowerShell:

```powershell
$python = 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $python -m http.server 4173 --bind 127.0.0.1
```

Expected: the site is available at `http://127.0.0.1:4173/`.

- [ ] **Step 4: Verify key routes in Chrome or the in-app browser**

Open and inspect:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/#/topics`
- `http://127.0.0.1:4173/#/topics/digital-trade-ecommerce`
- `http://127.0.0.1:4173/#/database`
- `http://127.0.0.1:4173/#/database?q=source%20code`
- `http://127.0.0.1:4173/#/actors/china`
- `http://127.0.0.1:4173/#/institutions/wto`
- `http://127.0.0.1:4173/#/sources-method`

Expected:

- The homepage opens as a research portal.
- Digital Trade has richer linked records and a timeline.
- Database filters produce visible results.
- Actor and institution detail pages show linked records.
- No mojibake appears in English or Chinese-related strings.
- Layout does not overlap at desktop width or mobile width.

- [ ] **Step 5: Commit verification support**

Run:

```bash
git add tests/render-smoke.test.mjs
git commit -m "Add static portal verification checks"
```

## Task 8: Final Readiness Pass

**Files:**
- Modify files only to fix defects found during verification.

- [ ] **Step 1: Run full test suite**

Run: `node --test tests/*.test.mjs`

Expected: PASS.

- [ ] **Step 2: Check repository status**

Run: `git status --short --branch`

Expected: clean working tree on `main`, or only intentionally uncommitted changes from the final fix.

- [ ] **Step 3: Review success criteria against the design spec**

Confirm:

- All major topics appear in `src/data/topics.js`.
- Digital trade and e-commerce has deeper coverage than other topics in `src/data/records.js` and `src/data/timeline.js`.
- Database filters cover record type, topic, actor, institution, source authority, language status, and search query.
- Source authority and language status appear on record detail pages.
- Actor and institution pages render linked records.
- Sources and Method explains source hierarchy and language-status policy.

- [ ] **Step 4: Commit final fixes**

If any final fixes were needed, run:

```bash
git add index.html src tests package.json
git commit -m "Prepare first portal release"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review Notes

Spec coverage:

- Topic Atlas + Database architecture is covered by Tasks 1, 5, and 6.
- English-first language policy and language-status metadata are covered by Tasks 2, 3, and 5.
- Full topic taxonomy is covered by Task 2.
- Digital Trade and E-commerce deep pilot is covered by Tasks 2, 3, and 5.
- Public authoritative seed corpus is covered by Task 3.
- Search/filter behavior is covered by Tasks 4 and 5.
- GitHub Pages-friendly static delivery is covered by Tasks 1 and 7.
- Verification is covered by Tasks 7 and 8.

No unresolved gaps remain in this plan. The plan intentionally defers complete Google Drive and Zotero synchronization because the approved design defines those as expansion fields, not first-release requirements.
