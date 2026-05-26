# China Scholarship Expansion Design

## Purpose

Strengthen the portal by adding a major scholarly shelf on China and international rule-making without changing the existing record schema.

The current China page is now much stronger on official practice materials, institution-linked participation, and contemporary policy records. It is still weak as a research bibliography. Under the current data model, the China shelf has only one clearly scholarly record. That makes the site less useful for article drafting, chapter planning, and literature-grounded comparison.

This design turns the next expansion into a sweeping scholarly pass across law, international law, international relations, political science, political economy, development, trade, investment, finance, digital governance, standards, and global governance.

## Approved Product Direction

The user approved the following direction:

- keep the current category system rather than redesigning the schema
- do a broad search of journals, reviews, and adjacent scholarly venues
- add as many verified scholarly works on China and rule-making as the source pass supports
- categorize the records within the existing model rather than inventing a new one

This means the task is a literature-expansion and classification-discipline pass, not a front-end redesign and not a schema migration.

## Current Research Gap

At the start of this design pass, the current China shelf contains:

- a dense official-practice layer across WTO, development finance, coalition forums, ASEAN, G20, and UN AI governance
- strong contemporary policy and institutional materials
- only one clearly scholarly China-linked record under the present `recordType` plus `sourceAuthority` model

That imbalance is now the main weakness of the China page. The site can already show what China says, proposes, signs, launches, or funds. It is much less able to show how scholars explain, critique, periodize, or compare China's rule-making behavior.

## Core Expansion Shape

The next expansion should be a dedicated China scholarship batch.

Recommended scale:

- approximately `30-50` new records if the verification pass supports them cleanly
- prefer fewer high-confidence records over weak or uncertain filler
- if the search yields substantially more strong items, continue beyond `50` rather than splitting too early, provided quality control remains stable

The batch should be broad in disciplinary range but still tightly centered on the portal's core question:

How does China participate in, shape, contest, reinterpret, export, or institutionalize international economic and governance rules?

## Category Strategy

The user asked for records to be categorized, but the user also approved keeping the current category system.

Therefore the categorization strategy should be:

- keep `recordType` as the primary category field
- keep `sourceAuthority` as the source-quality field
- use titles, summaries, and tags to preserve finer distinctions such as:
  - `submission`
  - `proposal`
  - `activity`
  - `review-essay`
  - `monograph`
  - `edited-volume`
  - `journal-review`
  - `practice-analysis`

This lets the site remain stable while still capturing the distinctions the user cares about.

## How Scholarly Works Should Be Classified

The main scholarly categories in this pass should be:

- `academic-article`
- `book-chapter`
- `research-report`

Recommended classification discipline:

- use `academic-article` for journal articles, review essays, and peer-reviewed review articles
- use `book-chapter` for monographs, edited-book chapters, and major scholarly books already modeled by the portal under that type
- use `research-report` only for academically serious report-style outputs from think tanks, research institutes, policy centers, or international organizations when they are analytically useful

This pass should not force scholarly materials into `official-statement` or `institutional-document` unless they are genuinely official texts rather than scholarship.

## Search Domain

The literature sweep should be broad but disciplined.

Priority scholarly domains:

- international law
- transnational law
- WTO law and trade law
- international economic law
- international investment law and arbitration
- international relations
- political science
- international political economy
- development studies
- China studies where the work directly addresses rule-making, governance, institutions, standards, bargaining, or legal ordering

Priority publication types:

- peer-reviewed journal articles
- review articles
- law-review articles
- books and major scholarly monographs
- edited-book chapters
- selected research reports from respected academic or policy institutions

The search should be especially attentive to journals and reviews in:

- international law
- international relations
- political science
- political economy
- development
- China studies
- trade and investment governance
- global governance and regulation

## Inclusion Rule

Every new scholarly record must satisfy both of the following tests:

1. It is genuinely scholarly or serious analytical literature under the current schema.
2. It materially helps explain China's role in international rule-making.

This second rule matters. The batch should not become a generic China bibliography.

Included themes should directly connect China to:

- WTO reform, negotiation, and trade governance
- digital governance, data governance, and standards
- international investment, development finance, and ISDS reform
- monetary and financial governance
- AI governance and global technology rule-making
- coalition-building and forum choice
- BRICS, BRI, AIIB, NDB, ASEAN, G20, APEC, UN, and related institutional practice
- comparative great-power rule-making
- legal diffusion, regulatory export, sovereignty framing, or norm entrepreneurship

## Exclusion Rule

Do not add works that are:

- mainly about Chinese domestic politics without a rule-making or governance link
- generic foreign policy commentary without a clear connection to international rules or institutions
- low-confidence citations that cannot be verified cleanly
- repetitive duplicates of the same argument unless they represent a clearly distinct and important stage of the literature
- generic textbook treatments that add little analytical value to the portal

## Literature Clusters

The search and resulting batch should be organized across several analytical clusters.

### China and Multilateral Trade Rule-Making

This cluster should include scholarship on:

- WTO accession and post-accession positioning
- WTO reform and negotiation strategy
- e-commerce and digital trade
- investment facilitation and development framing
- coalition politics inside or around WTO processes

### China and International Economic Law

This cluster should include scholarship on:

- treaty practice
- international investment law
- trade law and legal strategy
- rule interpretation
- institutional contestation within international economic law

### China and Political Economy of Rule-Making

This cluster should include scholarship on:

- great-power competition and institutional choice
- regulatory statecraft
- standards power
- market size, supply chains, and regulatory leverage
- state capitalism and rule export where it links directly to governance design

### China and Development / Development Finance Governance

This cluster should include scholarship on:

- BRI governance
- development finance
- AIIB and NDB
- World Bank or IMF engagement
- South-South framing and development-cooperation rule-making

### China and Technology / Digital / AI Governance

This cluster should include scholarship on:

- cyber sovereignty
- data governance
- platform or digital trade governance
- AI governance strategy
- standards and technical rule-making
- competing governance models involving China

### China and Comparative Institutional Strategy

This cluster should include scholarship on:

- forum shopping
- institutional layering
- reform-from-within versus parallel institution-building
- BRICS, G20, ASEAN, APEC, UN, and similar forums
- comparisons between China, the United States, the European Union, and middle powers

## Data Model Strategy

Implementation should stay within the current architecture.

Rules:

- add the new literature in one dedicated China scholarship batch file
- append that batch through the existing record aggregator
- do not add new top-level routes
- do not redesign search or filters unless a small helper is clearly needed for existing category visibility

The batch should behave like the other record batches already in the repo.

## Tagging Strategy

Because the schema is staying fixed, tags should carry some of the finer-grained categorization value.

Recommended tag patterns:

- discipline tags:
  - `international-law`
  - `international-relations`
  - `political-science`
  - `political-economy`
  - `development`
  - `china-studies`
- form tags:
  - `law-review`
  - `review-essay`
  - `monograph`
  - `edited-volume`
  - `practice-analysis`
- substantive tags:
  - `wto-reform`
  - `digital-governance`
  - `ai-governance`
  - `development-finance`
  - `standards`
  - `bri`
  - `aiib`
  - `brics`
  - `institutional-strategy`

This tagging layer should make future filtering, curation, or export easier without changing the public schema now.

## Coverage Rules

The scholarly batch should materially change the China shelf.

Hard coverage rules:

- the China topic should gain a substantial scholarly shelf rather than only one or two new items
- the new scholarly records should span at least `3` scholarly `recordType` groupings under the current model:
  - `academic-article`
  - `book-chapter`
  - `research-report`
- the new scholarly records should connect China not only to the `china` page but also to several related topics:
  - `great-powers`
  - `wto-reform`
  - `international-investment`
  - `digital-trade-ecommerce`
  - `cyber-data-governance`
  - `monetary-financial-regulation`
  - `ai-governance`
  - `middle-small-powers` where justified

The emphasis should be on analytical reach, not only on count.

## Source and Citation Rules

Scholarly entries must remain strict about verification.

Rules:

- use authoritative metadata or publisher pages first
- prefer DOI, publisher, journal, or stable repository landing pages
- do not fabricate or approximate citations
- where full text is not openly available, metadata-only entries are acceptable
- preserve author and publisher fields carefully for searchability
- use `academic-publisher` for peer-reviewed and scholarly books
- use `think-tank` only where the work is clearly a serious analytical report
- avoid weak commentary sources for the scholarship batch

## Retrieval and Page Propagation

The new scholarly works should not be trapped only on the China page.

They should also propagate into:

- relevant topic pages such as `wto-reform`, `international-investment`, `digital-trade-ecommerce`, `cyber-data-governance`, `monetary-financial-regulation`, and `ai-governance`
- comparative shelves such as `great-powers`
- institution pages where the scholarship is specifically about `WTO`, `AIIB`, `BRICS`, `ASEAN`, `G20`, `UN`, `UNCTAD`, `World Bank`, `IMF`, or related venues

This propagation is necessary because the user asked for a sweeping search, and the resulting value should be visible across the whole portal rather than hidden in one actor page.

## Testing and Validation

This batch should be validated with data-model tests first.

Required validation themes:

- the China topic must show a substantial rise in scholarly materials
- the China topic must gain multiple scholarly `recordType` categories
- at least several secondary topics must gain China-linked scholarship
- every new record must pass schema, citation-field, and source-link checks
- the batch should not break existing source-authority or record-type expectations

Render validation should inspect at least:

- the `China` topic page
- one or more topic pages where China scholarship should now surface prominently
- one or more institution pages where China-linked scholarship should propagate
- at least one record detail page for an academic article and one for a book or chapter

## Non-Goals

This batch should not:

- redesign the schema
- redesign the UI
- convert the site into a generic China bibliography
- prioritize quantity over citation confidence
- replace the official-practice shelf with a theory-only or commentary-only shelf

## Success Criteria

This design is successful when:

- the China page becomes useful as both an institutional-practice shelf and a serious scholarly bibliography
- the user can find substantial China-and-rule-making scholarship across law, international relations, political science, political economy, and development
- the literature is clearly categorized using the current model
- fine distinctions such as proposal, submission, activity, review essay, or monograph are still legible through summaries and tags
- the new records materially improve the portal's value for writing articles, chapters, and monograph sections on China and international rule-making
